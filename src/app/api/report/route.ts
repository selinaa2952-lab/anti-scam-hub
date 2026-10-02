import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { number, type, summary } = body;

    if (!number) {
      return NextResponse.json({ error: '電話號碼為必填' }, { status: 400 });
    }

    // 接收通報資料
    console.log('收到通報資料:', { number, type, summary });

    return NextResponse.json({
      success: true,
      message: '感謝您的通報，情資已成功送出！'
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}