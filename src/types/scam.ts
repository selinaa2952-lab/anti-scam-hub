export interface ScamRecord {
  id: string;
  number: string;
  cleanNumber: string;
  type: string;
  riskLevel: 'high' | 'medium' | 'low';
  reportCount: number;
  summary: string;
  lastReported?: string;
  [key: string]: any; // 允許彈性擴充其他欄位
}