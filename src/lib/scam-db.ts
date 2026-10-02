import scamData from '../../data/scam_numbers.json';
import { ScamRecord } from '../types/scam';

const records = scamData as ScamRecord[];

export function findScamByNumber(input: string): ScamRecord | undefined {
  // 移除常見符號，只比對純數字
  const cleanInput = input.replace(/\D/g, '');
  if (!cleanInput) return undefined;

  return records.find(
    (item) => item.cleanNumber === cleanInput || item.cleanNumber.endsWith(cleanInput) || cleanInput.endsWith(item.cleanNumber)
  );
}

export function getAllScamRecords(): ScamRecord[] {
  return records;
}