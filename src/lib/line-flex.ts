import { ScamRecord } from '../types/scam';

export function createScamAlertFlexMessage(scam: ScamRecord, websiteBaseUrl: string) {
  const isCritical = (scam.riskLevel as string) === 'critical' || scam.riskLevel === 'high';
  const headerColor = isCritical ? '#DC2626' : '#EA580C';
  const riskTitle = isCritical ? '極高風險！確認為詐騙電話' : '高風險！疑似詐騙電話';

  return {
    type: 'flex',
    altText: `⚠️ 詐騙警示：${scam.number}（${scam.type}）`,
    contents: {
      type: 'bubble',
      header: {
        type: 'box',
        layout: 'vertical',
        backgroundColor: headerColor,
        contents: [
          {
            type: 'text',
            text: riskTitle,
            weight: 'bold',
            color: '#FFFFFF',
            size: 'md'
          }
        ]
      },
      body: {
        type: 'box',
        layout: 'vertical',
        spacing: 'md',
        contents: [
          {
            type: 'text',
            text: scam.number,
            weight: 'bold',
            size: 'xl',
            color: '#111827'
          },
          {
            type: 'box',
            layout: 'vertical',
            margin: 'lg',
            spacing: 'sm',
            contents: [
              {
                type: 'box',
                layout: 'baseline',
                contents: [
                  { type: 'text', text: '詐騙類型', color: '#6B7280', size: 'sm', flex: 2 },
                  { type: 'text', text: scam.type, color: '#1F2937', size: 'sm', flex: 5, weight: 'bold' }
                ]
              },
              {
                type: 'box',
                layout: 'baseline',
                contents: [
                  { type: 'text', text: '通報次數', color: '#6B7280', size: 'sm', flex: 2 },
                  { type: 'text', text: `${scam.reportCount} 次`, color: '#DC2626', size: 'sm', flex: 5, weight: 'bold' }
                ]
              },
              {
                type: 'text',
                text: scam.summary,
                wrap: true,
                color: '#374151',
                size: 'sm',
                margin: 'md'
              }
            ]
          }
        ]
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        spacing: 'sm',
        contents: [
          {
            type: 'button',
            style: 'primary',
            color: '#1E293B',
            action: {
              type: 'uri',
              label: '查看完整防詐情資',
              uri: `${websiteBaseUrl}/number/${scam.cleanNumber}`
            }
          },
          {
            type: 'button',
            style: 'secondary',
            action: {
              type: 'uri',
              label: '分享提醒好友',
              uri: `https://line.me/R/share?text=${encodeURIComponent(`⚠️ 注意詐騙電話：${scam.number}（${scam.type}）。請勿聽信轉帳或提供個人資料！情資詳情：${websiteBaseUrl}/number/${scam.cleanNumber}`)}`
            }
          }
        ]
      }
    }
  };
}