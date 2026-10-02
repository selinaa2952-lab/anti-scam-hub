import scamData from '../../data/scam_numbers.json';
import { ScamRecord } from '../types/scam';

const records: ScamRecord[] = scamData as ScamRecord[];

export function findScamByNumber(input: string): ScamRecord | undefined {
  const cleanInput = input.replace(/\D/g, '');
  if (!cleanInput) return undefined;

  return records.find(
    (item) => item.cleanNumber === cleanInput || item.cleanNumber.endsWith(cleanInput) || cleanInput.endsWith(item.cleanNumber)
  );
}

export function getAllScamRecords(): ScamRecord[] {
  return records;
}