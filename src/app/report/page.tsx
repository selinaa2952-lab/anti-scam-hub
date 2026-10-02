'use client';

import { useState } from 'react';
import Link from 'next/link';

interface LocalReport {
  id: string;
  number: string;
  scamType: string;
  callerIdentity: string;
  summary: string;
  timestamp: string;
  status: '待核對';
}

const SCAM_TYPES = ['假檢警', '分期付款', '假投資', '騷擾', '其他'];

export default function QuickReportPage() {
  // 表單狀態
  const [phoneNumber, setPhoneNumber] = useState('');
  const [scamType, setScamType] = useState('分期付款');
  const [callerIdentity, setCallerIdentity] = useState('');
  const [summary, setSummary] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // 當前通報紀錄清單
  const [reports, setReports] = useState<LocalReport[]>([]);

  // 提交處理
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // 格式驗證：僅接受數字、破折號與 + 號
    const phoneRegex = /^[0-9\-+ ]+$/;
    if (!phoneNumber.trim() || !phoneRegex.test(phoneNumber.trim())) {
      setErrorMsg('請輸入正確的電話格式（僅接受數字、破折號 - 與 + 號）');
      return;
    }

    const now = new Date();
    const formattedTime = now.toLocaleString('zh-TW', {
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    const newReport: LocalReport = {
      id: Date.now().toString(),
      number: phoneNumber.trim(),
      scamType,
      callerIdentity: callerIdentity.trim() || '未說明',
      summary: summary.trim() || '無話術摘要',
      timestamp: formattedTime,
      status: '待核對',
    };

    // 新增至清單最上方
    setReports([newReport, ...reports]);

    // 清空輸入框
    setPhoneNumber('');
    setCallerIdentity('');
    setSummary('');
  };

  // 匯出今日通報紀錄文字檔
  const handleExportText = () => {
    if (reports.length === 0) {
      alert('目前尚無通報紀錄可供匯出！');
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    let fileContent = `=== 全民反詐情資庫 - 今日通報紀錄彙整 (${todayStr}) ===\n總計通報：${reports.length} 筆\n\n`;

    reports.forEach((item, index) => {
      fileContent += `【第 ${index + 1} 筆通報】\n`;
      fileContent += `通報狀態：${item.status}\n`;
      fileContent += `電話號碼：${item.number}\n`;
      fileContent += `疑似類型：${item.scamType}\n`;
      fileContent += `自稱身分：${item.callerIdentity}\n`;
      fileContent += `通報時間：${item.timestamp}\n`;
      fileContent += `話術摘要：${item.summary}\n`;
      fileContent += `----------------------------------------\n`;
    });

    // 觸發文字檔下載
    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `詐騙電話通報紀錄_${todayStr}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', minHeight: '100vh', backgroundColor: '#F8FAFC', padding: '1.25rem', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      
      {/* 頂部導航 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <Link href="/" style={{ color: '#64748B', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' }}>
          ← 回到首頁
        </Link>
        <span style={{ fontSize: '12px', background: '#E2E8F0', padding: '3px 8px', borderRadius: '12px', color: '#475569' }}>
          免登入通報
        </span>
      </div>

      {/* 標題區 */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#0F172A', margin: '0 0 0.5rem 0' }}>
          可疑電話快速通報與標註
        </h1>
        <p style={{ fontSize: '13px', color: '#64748B', margin: 0, lineHeight: '1.5' }}>
          剛掛斷陌生電話？隨手留下情報，守護自身與親友財產安全。
        </p>
      </div>

      {/* 通報表單 */}
      <form onSubmit={handleSubmit} style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: '16px', border: '2px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        
        {/* 1. 電話號碼 (必填) */}
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#1E293B', marginBottom: '0.4rem' }}>
            可疑電話號碼 <span style={{ color: '#EF4444' }}>*</span>
          </label>
          <input
            type="text"
            placeholder="例：+886-2-2345-6789"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }}
            required
          />
          {errorMsg && <div style={{ color: '#EF4444', fontSize: '12px', marginTop: '0.3rem' }}>{errorMsg}</div>}
        </div>

        {/* 2. 疑似詐騙類型 (必填快選標籤) */}
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#1E293B', marginBottom: '0.4rem' }}>
            疑似詐騙類型 <span style={{ color: '#EF4444' }}>*</span>
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {SCAM_TYPES.map((type) => {
              const isSelected = scamType === type;
              return (
                <button
                  type="button"
                  key={type}
                  onClick={() => setScamType(type)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '13px',
                    fontWeight: isSelected ? 'bold' : 'normal',
                    backgroundColor: isSelected ? '#1E293B' : '#F1F5F9',
                    color: isSelected ? '#FFFFFF' : '#475569',
                    border: isSelected ? '1px solid #1E293B' : '1px solid #E2E8F0',
                    cursor: 'pointer',
                  }}
                >
                  {type}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. 對方自稱身分 (選填) */}
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#1E293B', marginBottom: '0.4rem' }}>
            對方自稱身分 <span style={{ color: '#94A3B8', fontWeight: 'normal', fontSize: '12px' }}>(選填)</span>
          </label>
          <input
            type="text"
            placeholder="例：知名電商客服、健保局公務員"
            value={callerIdentity}
            onChange={(e) => setCallerIdentity(e.target.value)}
            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        {/* 4. 通話話術摘要 (選填) */}
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#1E293B', marginBottom: '0.4rem' }}>
            通話話術摘要 <span style={{ color: '#94A3B8', fontWeight: 'normal', fontSize: '12px' }}>(選填)</span>
          </label>
          <textarea
            placeholder="例：說我之前買東西被誤設分期，要我操作 ATM 或網銀解除設定..."
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={3}
            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }}
          />
        </div>

        {/* 提交按鈕 */}
        <button
          type="submit"
          style={{
            marginTop: '0.5rem',
            padding: '0.85rem',
            backgroundColor: '#DC2626',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '10px',
            fontSize: '15px',
            fontWeight: '900',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(220, 38, 38, 0.3)',
          }}
        >
          🚨 立即新增通報
        </button>
      </form>

      {/* 即時通報紀錄預覽區塊 */}
      <div style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 'bold', color: '#0F172A', margin: 0 }}>
            今日暫存紀錄 ({reports.length})
          </h2>
          {reports.length > 0 && (
            <button
              onClick={handleExportText}
              style={{
                fontSize: '12px',
                padding: '6px 12px',
                backgroundColor: '#2563EB',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              📥 匯出今日通報紀錄（文字檔）
            </button>
          )}
        </div>

        {reports.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem', background: '#FFFFFF', borderRadius: '12px', border: '1px dashed #CBD5E1', color: '#94A3B8', fontSize: '13px' }}>
            尚未新增任何紀錄。剛掛斷電話？請填寫上方表單送出！
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {reports.map((item) => (
              <div
                key={item.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  padding: '1rem',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '11px', backgroundColor: '#FEF3C7', color: '#92400E', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>
                      ⏳ {item.status}
                    </span>
                    <span style={{ fontSize: '11px', backgroundColor: '#F1F5F9', color: '#475569', padding: '2px 8px', borderRadius: '12px' }}>
                      {item.scamType}
                    </span>
                  </div>
                  <span style={{ fontSize: '11px', color: '#94A3AF' }}>{item.timestamp}</span>
                </div>

                <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#1E293B', marginBottom: '0.25rem' }}>
                  {item.number}
                </div>

                <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '0.5rem' }}>
                  <strong>對方自稱：</strong>{item.callerIdentity}
                </div>

                <div style={{ fontSize: '13px', color: '#334155', background: '#F8FAFC', padding: '0.5rem', borderRadius: '6px', lineHeight: '1.4' }}>
                  {item.summary}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}