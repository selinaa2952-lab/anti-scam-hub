import { Metadata } from 'next';
import { getAllScamRecords, findScamByNumber } from '@/lib/scam-db';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface Props {
  params: { number: string };
}

// 建立時自動為所有號碼預先生成靜態頁面
export async function generateStaticParams() {
  const records = getAllScamRecords();
  return records.map((record) => ({
    number: record.cleanNumber
  }));
}

// 自動產出 Meta 標題與描述，大幅提升 Google 搜尋排名
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const scam = findScamByNumber(params.number);
  if (!scam) return { title: '查無詐騙紀錄' };

  return {
    title: `【詐騙警示】${scam.number} 是詐騙電話嗎？${scam.type}手法通報與解析`,
    description: `電話號碼 ${scam.number} 已被通報 ${scam.reportCount} 次。詐騙手法：${scam.summary}。請提高警覺勿依指示操作！`,
    openGraph: {
      title: `⚠️ 警示：${scam.number} 疑似詐騙電話`,
      description: scam.summary
    }
  };
}

export default function NumberDetailPage({ params }: Props) {
  const scam = findScamByNumber(params.number);
  if (!scam) return notFound();

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-10">
        <div className="inline-block bg-red-100 text-red-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
          風險等級：{scam.riskLevel.toUpperCase()}
        </div>
        
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
          {scam.number}
        </h1>
        <p className="text-slate-500 text-sm mb-6">
          初次通報：{scam.firstReportedAt} ｜ 最近通報：{scam.lastReportedAt} ｜ 累計通報：{scam.reportCount} 次
        </p>

        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6">
          <p className="text-amber-800 font-medium">通報手法特徵：</p>
          <p className="text-amber-950 mt-1 text-sm leading-relaxed">{scam.summary}</p>
        </div>

        <div className="space-y-4 mb-8">
          <div>
            <span className="text-sm font-semibold text-slate-700">來電類型：</span>
            <span className="text-sm text-slate-600 ml-2">{scam.type}</span>
          </div>
          <div>
            <span className="text-sm font-semibold text-slate-700">特徵標籤：</span>
            <div className="inline-flex gap-2 ml-2 flex-wrap">
              {scam.tags.map((tag) => (
                <span key={tag} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-4 border-t border-slate-100 pt-6">
          <Link
            href="/"
            className="text-sm text-slate-600 hover:text-slate-900 font-medium"
          >
            ← 回首頁搜尋其他號碼
          </Link>
        </div>
      </div>
    </main>
  );
}