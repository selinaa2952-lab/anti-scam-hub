import { NextRequest, NextResponse } from 'next/server';
import { updateScamDatabaseOnGithub } from '@/lib/github';
import { ScamRecord } from '@/types/scam';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const adminKey = formData.get('adminKey') as string;

    // 簡易安全密碼驗證（可於環境變數設定 ADMIN_SECRET）
    const validKey = process.env.ADMIN_SECRET || 'admin123';
    if (adminKey !== validKey) {
      return NextResponse.json({ error: '後台通行碼錯誤' }, { status: 401 });
    }

    if (!file) {
      return NextResponse.json({ error: '未上傳 CSV 檔案' }, { status: 400 });
    }

    const text = await file.text();
    const lines = text.split(/\r?\n/).filter((line) => line.trim() !== '');

    if (lines.length <= 1) {
      return NextResponse.json({ error: 'CSV 檔案內容為空或無有效資料' }, { status: 400 });
    }

    // 解析 CSV（假設欄位順序：電話號碼, 詐騙類型, 手法特徵, 通報次數）
    const newRecords: ScamRecord[] = lines.slice(1).map((line, idx) => {
      // 處理逗號分隔（若包含引號可視需要微調）
      const parts = line.split(',');
      const number = parts[0]?.trim() || '';
      const type = parts[1]?.trim() || '其他';
      const summary = parts[2]?.trim() || '民眾通報可疑詐騙電話';
      const count = parseInt(parts[3]?.trim() || '1', 10);
      const cleanNumber = number.replace(/\D/g, '');

      return {
        id: `csv-${Date.now()}-${idx + 1}`,
        number,
        cleanNumber,
        type,
        riskLevel: 'high' as const,
        reportCount: isNaN(count) ? 1 : count,
        summary,
        lastReported: new Date().toISOString().split('T')[0],
      };
    }).filter(item => item.cleanNumber.length > 0);

    // 透過 GitHub API 更新 data/scam_numbers.json
    await updateScamDatabaseOnGithub(newRecords);

    return NextResponse.json({
      success: true,
      count: newRecords.length,
      message: `成功匯入 ${newRecords.length} 筆資料，GitHub 儲存庫已更新，Vercel 正在自動部署！`,
    });
  } catch (error: any) {
    console.error('CSV 匯入錯誤:', error);
    return NextResponse.json({ error: error.message || '匯入過程發生錯誤' }, { status: 500 });
  }
}