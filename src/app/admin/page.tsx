'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert('請先選擇 CSV 檔案');
      return;
    }

    setLoading(true);
    setStatus('正在解析並上傳至 GitHub，請稍候...');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('adminKey', adminKey);

    try {
      const res = await fetch('/api/admin/import-csv', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setStatus(`✅ ${data.message}`);
        setFile(null);
      } else {
        setStatus(`❌ 匯入失敗：${data.error}`);
      }
    } catch (err: any) {
      setStatus(`❌ 連線錯誤：${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '640px', margin: '3rem auto', padding: '1.5rem', fontFamily: 'sans-serif' }}>
      <Link href="/" style={{ color: '#666', textDecoration: 'none' }}>← 返回前台首頁</Link>
      <h1 style={{ marginTop: '1rem', color: '#1E293B' }}>🛡️️ 反詐情資管理後台</h1>
      <p style={{ color: '#64748B' }}>透過批次上傳 CSV 檔案，更新詐騙號碼資料庫至 GitHub 與 LINE 機器人。</p>

      <form onSubmit={handleUpload} style={{ background: '#F8FAFC', padding: '1.5rem', borderRadius: '8px', border: '1px solid #E2E8F0', marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>後台管理密碼：</label>
          <input
            type="password"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            placeholder="請輸入後台通行密碼"
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #CBD5E1' }}
            required
          />
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>選擇 CSV 檔案：</label>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
            style={{ width: '100%' }}
            required
          />
          <small style={{ color: '#64748B', display: 'block', marginTop: '0.5rem' }}>
            CSV 格式範例：<code>號碼,詐騙類型,手法特徵,通報次數</code>（第一行為欄位標題）
          </small>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '0.75rem',
            background: loading ? '#94A3B8' : '#2563EB',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? '更新處理中...' : '確認上傳並發布'}
        </button>
      </form>

      {status && (
        <div style={{ marginTop: '1.5rem', padding: '1rem', borderRadius: '6px', background: status.startsWith('✅') ? '#ECFDF5' : '#FEF2F2', border: `1px solid ${status.startsWith('✅') ? '#A7F3D0' : '#FECACA'}` }}>
          {status}
        </div>
      )}
    </div>
  );
}