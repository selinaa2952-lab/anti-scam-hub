import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '全民反詐電話情資庫',
  description: '即時查詢與通報可疑詐騙電話',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <body style={{ margin: 0, fontFamily: 'sans-serif' }}>{children}</body>
    </html>
  );
}