import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { findScamByNumber } from '../../../../lib/scam-db';
import { createScamAlertFlexMessage } from '../../../../lib/line-flex';

const CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET || '';
const CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN || '';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.vercel.app';

// 驗證 LINE 數位簽章
function verifySignature(body: string, signature: string | null): boolean {
  if (!signature) return false;
  const hash = crypto
    .createHmac('SHA256', CHANNEL_SECRET)
    .update(body)
    .digest('base64');
  return hash === signature;
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-line-signature');

    if (!verifySignature(rawBody, signature)) {
      return NextResponse.json({ message: 'Invalid signature' }, { status: 401 });
    }

    const eventData = JSON.parse(rawBody);
    const events = eventData.events || [];

    for (const event of events) {
      if (event.type === 'message' && event.message.type === 'text') {
        const userText = (event.message.text || '').trim();
        const replyToken = event.replyToken;

        // 判斷是否為「通報」指令或直接輸入號碼
        if (userText.startsWith('通報')) {
          await sendLineReply(replyToken, [
            {
              type: 'text',
              text: `感謝您的防詐互助！請點擊下方連結前往快速通報頁面，提交可疑電話與話術：\n${SITE_URL}/report`
            }
          ]);
          continue;
        }

        // 嘗試以輸入號碼比對資料庫
        const matched = findScamByNumber(userText);

        if (matched) {
          const flexMsg = createScamAlertFlexMessage(matched, SITE_URL);
          await sendLineReply(replyToken, [flexMsg]);
        } else {
          // 查無資料時的宣導警示
          await sendLineReply(replyToken, [
            {
              type: 'text',
              text: `⚠️ 系統目前查無【${userText}】的詐騙通報紀錄。\n\n💡 請注意：\n1. 未列入「不代表絕對安全」，詐騙集團經常更換跳板號碼。\n2. 若電話中提及「誤設分期付款」、「ATM 解除扣款」、「檢警要求監管帳戶」，100% 是詐騙，請立即掛斷！\n\n👉 如欲通報此可疑號碼，請至：\n${SITE_URL}/report`
            }
          ]);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Line webhook error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

async function sendLineReply(replyToken: string, messages: any[]) {
  await fetch('https://api.line.me/v2/bot/message/reply', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`
    },
    body: JSON.stringify({ replyToken, messages })
  });
}