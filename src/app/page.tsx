import Link from 'next/link';
import { getAllScamRecords } from '@/lib/scam-db';

export default function HomePage() {
  const records = getAllScamRecords();

  return (
    <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>🛡️ 全民反詐電話情資庫</h1>
      <p>即時查核可疑電話，守護自身與親友財產安全。</p>
      <div style={{ margin: '1.5rem 0' }}>
        <Link href="/report" style={{ color: '#2563EB', fontWeight: 'bold' }}>
          👉 前往通報可疑電話
        </Link>
      </div>
      <h2>最新詐騙通報名單</h2>
      <ul>
        {records.map((item) => (
          <li key={item.id} style={{ margin: '0.8rem 0' }}>
            <Link href={`/number/${item.cleanNumber}`} style={{ fontWeight: 'bold' }}>
              {item.number}
            </Link>
            {' '}- {item.type}（通報 {item.reportCount} 次）
          </li>
        ))}
      </ul>
    </main>
  );
}