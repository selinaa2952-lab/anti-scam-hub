'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ReportPage() {
  const [number, setNumber] = useState('');
  const [type, setType] = useState('境外異常/假冒客服');
  const [summary, setSummary] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('提交中...');

    try {
      const res = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ number, type, summary }),
      });

      if (res.ok) {
        setStatus('✅ 通報成功！感謝您的互助協助。');
        setNumber('');
        setSummary('');
      } else {
        setStatus('❌ 通報失敗，請稍後再試。');
      }
    } catch {
      setStatus('❌ 發生錯誤，請稍後再試。');
    }
  };

  return (
    <main style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <Link href="/" style={{ color: '#666' }}>← 回首頁</Link>
      <h1 style={{ marginTop: '1rem' }}>通報可疑詐騙電話</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <label>
          可疑電話號碼：
          <input
            type="text"
            required
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
            placeholder="例如：02-23456789 或 +1..."
          />
        </label>
        <label>
          詐騙類型：
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
          >
            <option>境外異常/假冒客服</option>
            <option>假冒電商/解除分期扣款</option>
            <option>假檢警公務機構</option>
            <option>投資詐騙/飆股社團</option>
            <option>其他</option>
          </select>
        </label>
        <label>
          手法特徵或話術摘要：
          <textarea
            rows={4}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
            placeholder="請簡述對方的通話內容或要求..."
          />
        </label>
        <button
          type="submit"
          style={{ padding: '0.75rem', background: '#DC2626', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          送出通報
        </button>
      </form>
      {status && <p style={{ marginTop: '1rem' }}>{status}</p>}
    </main>
  );
}