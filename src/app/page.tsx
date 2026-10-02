import Link from 'next/link';
import Image from 'next/image';
import { getAllScamRecords } from '@/lib/scam-db';

export default function HomePage() {
  const records = getAllScamRecords();

  // 將資料夾內的 4 張卡片圖片依序分配給清單卡片
  const cardImages = [
    '/images/card01.png',
    '/images/card02.png',
    '/images/card03.png',
    '/images/card04.png',
  ];

  return (
    <div style={{ backgroundColor: '#FAF9F6', color: '#1F2937', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      
      {/* 1. 頂部跑馬燈公告 */}
      <div style={{ backgroundColor: '#FF8A50', color: '#FFFFFF', fontSize: '13px', padding: '9px 0', textAlign: 'center', fontWeight: 'bold', letterSpacing: '1px' }}>
        📢 提醒：接獲「+886」或「自稱電商客服要求解除分期」電話，請立即掛斷並至本站查核！
      </div>

      {/* 2. 導航列 (Navbar) */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 2.5rem', borderBottom: '2px solid #1F2937', backgroundColor: '#FFFFFF' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '26px' }}>🛡️</span>
          <span style={{ fontWeight: '900', fontSize: '22px', letterSpacing: '-0.5px' }}>
            SCAM HUB <span style={{ fontSize: '12px', background: '#1F2937', color: '#fff', padding: '2px 8px', borderRadius: '12px' }}>v1.0</span>
          </span>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/report" style={{ background: '#FF4757', color: '#FFFFFF', padding: '9px 20px', borderRadius: '30px', fontWeight: 'bold', textDecoration: 'none', border: '2px solid #1F2937', boxShadow: '2px 2px 0px #1F2937' }}>
            ＋ 我要通報
          </Link>
          <Link href="/admin" style={{ background: '#FFFFFF', color: '#1F2937', padding: '9px 20px', borderRadius: '30px', fontWeight: 'bold', textDecoration: 'none', border: '2px solid #1F2937' }}>
            後台管理
          </Link>
        </div>
      </header>

      {/* 3. Hero 主視覺區（引入 hero-banner.png） */}
      <section style={{ backgroundColor: '#4EBA97', borderBottom: '3px solid #1F2937', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 1.5rem 1rem 1.5rem', textAlign: 'center' }}>
          
          <div style={{ display: 'inline-block', backgroundColor: '#FEFCBF', color: '#744210', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', marginBottom: '1.2rem', border: '2px solid #1F2937' }}>
            全民即時電話防護網
          </div>
          
          <h1 style={{ fontSize: '2.75rem', fontWeight: '900', color: '#FFFFFF', margin: '0 0 1rem 0', letterSpacing: '-1px', textShadow: '2px 2px 0px #1F2937' }}>
            全民反詐電話情資庫
          </h1>

          {/* 搜尋條 */}
          <div style={{ maxWidth: '560px', margin: '0 auto 2.5rem auto', display: 'flex', gap: '8px', background: '#FFFFFF', padding: '8px', borderRadius: '18px', border: '3px solid #1F2937', boxShadow: '5px 5px 0px #1F2937' }}>
            <input
              type="text"
              placeholder="輸入可疑號碼（例如：02-2345-6789）..."
              style={{ flex: 1, border: 'none', outline: 'none', padding: '10px 16px', fontSize: '16px', color: '#333' }}
            />
            <button style={{ backgroundColor: '#FFD32A', border: '2px solid #1F2937', padding: '10px 24px', borderRadius: '12px', fontWeight: '900', color: '#1F2937', cursor: 'pointer' }}>
              快速查核
            </button>
          </div>

          {/* Banner 插畫呈現 */}
          <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', borderRadius: '16px 16px 0 0', overflow: 'hidden', border: '3px solid #1F2937', borderBottom: 'none', boxShadow: '4px -4px 0px rgba(0,0,0,0.1)' }}>
            <img
              src="/images/hero-banner.png"
              alt="主視覺插圖"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>

        </div>
      </section>

      {/* 4. What's new? 卡片列表區（卡片搭配 card01 ~ card04） */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '4.5rem 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span style={{ fontSize: '13px', fontWeight: '900', letterSpacing: '2px', color: '#FF4757', textTransform: 'uppercase' }}>Alert Database</span>
          <h2 style={{ fontSize: '2.4rem', fontWeight: '900', margin: '0.3rem 0', letterSpacing: '-0.5px' }}>
            What's new?
          </h2>
          <p style={{ color: '#6B7280', fontSize: '15px', margin: 0 }}>最新通報之詐騙電話名單與話術拆解</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          {records.map((item, index) => {
            const cardImg = cardImages[index % cardImages.length];

            return (
              <div
                key={item.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: '2px solid #1F2937',
                  boxShadow: '4px 4px 0px #1F2937',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'transform 0.15s ease',
                }}
              >
                {/* 卡片封面圖 */}
                <div style={{ width: '100%', aspectRatio: '1 / 1', position: 'relative', borderBottom: '2px solid #1F2937', backgroundColor: '#F3F4F6' }}>
                  <img
                    src={cardImg}
                    alt={item.number}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                {/* 卡片內容 */}
                <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <span style={{ backgroundColor: '#FFEAA7', color: '#2D3436', fontSize: '11px', fontWeight: 'bold', padding: '3px 8px', borderRadius: '12px', border: '1.5px solid #1F2937' }}>
                        {item.type}
                      </span>
                      <span style={{ fontSize: '12px', color: '#FF4757', fontWeight: '900' }}>
                        通報 {item.reportCount} 次
                      </span>
                    </div>

                    <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#1F2937', marginBottom: '0.5rem' }}>
                      {item.number}
                    </div>

                    <p style={{ fontSize: '13px', color: '#4B5563', lineHeight: '1.5', margin: 0 }}>
                      {item.summary || '自稱客服或公務機構，話術涉及個資核對與轉帳指示。'}
                    </p>
                  </div>

                  <div style={{ marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px dashed #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: '#9CA3AF' }}>{item.lastReported || '今日紀錄'}</span>
                    <Link
                      href={`/number/${item.cleanNumber}`}
                      style={{ color: '#1F2937', fontWeight: 'bold', fontSize: '12px', textDecoration: 'none', borderBottom: '2px solid #1F2937' }}
                    >
                      查看詳細 →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. 底部頁尾 */}
      <footer style={{ backgroundColor: '#1F2937', color: '#9CA3AF', padding: '3rem 2rem', textAlign: 'center', fontSize: '13px' }}>
        <p style={{ margin: '0 0 8px 0', color: '#FFFFFF', fontWeight: 'bold' }}>全民反詐電話情資庫 · Anti-Scam Hub</p>
        <p style={{ margin: 0 }}>共同守護通訊安全，如有疑慮請即時撥打 165 反詐騙諮詢專線。</p>
      </footer>

    </div>
  );
}