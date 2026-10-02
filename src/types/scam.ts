export interface ScamRecord {
  id: string;
  number: string;          // 原始顯示號碼，例如 "+1 (960) 354-2859" 或 "02-2345-6789"
  cleanNumber: string;     // 純數字（去除符號），供比對與 URL 使用，例如 "19603542859"
  type: string;            // 詐騙類型（境外異常、假冒電商、假檢警等）
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  summary: string;         // 摘要與手法說明
  reportCount: number;     // 累計通報次數
  firstReportedAt: string; // YYYY-MM-DD
  lastReportedAt: string;  // YYYY-MM-DD
  sourcePlatform: string;  // 來電特徵 / 管道
  tags: string[];
}