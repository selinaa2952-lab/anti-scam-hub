import { ScamRecord } from '@/types/scam';

const GITHUB_TOKEN = process.env.GITHUB_PERSONAL_ACCESS_TOKEN || '';
const REPO_OWNER = process.env.GITHUB_REPO_OWNER || '';
const REPO_NAME = process.env.GITHUB_REPO_NAME || '';
const FILE_PATH = 'data/scam_numbers.json';

export async function updateScamDatabaseOnGithub(newRecords: ScamRecord[]) {
  if (!GITHUB_TOKEN || !REPO_OWNER || !REPO_NAME) {
    throw new Error('未設定完整的 GitHub 環境變數 (TOKEN, OWNER, NAME)');
  }

  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;

  // 1. 取得 GitHub 上現有的 JSON 檔案內容與 SHA
  const getRes = await fetch(url, {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github.v3+json',
    },
    cache: 'no-store',
  });

  let existingRecords: ScamRecord[] = [];
  let sha = '';

  if (getRes.ok) {
    const data = await getRes.json();
    sha = data.sha;
    const content = Buffer.from(data.content, 'base64').toString('utf-8');
    try {
      existingRecords = JSON.parse(content);
    } catch {
      existingRecords = [];
    }
  }

  // 2. 合併現有資料與新匯入的 CSV 資料（以 cleanNumber 作為唯一值，避免重複）
  const recordMap = new Map<string, ScamRecord>();
  for (const item of existingRecords) {
    recordMap.set(item.cleanNumber, item);
  }
  for (const item of newRecords) {
    if (recordMap.has(item.cleanNumber)) {
      const prev = recordMap.get(item.cleanNumber)!;
      recordMap.set(item.cleanNumber, {
        ...prev,
        reportCount: prev.reportCount + item.reportCount,
        lastReported: item.lastReported,
        summary: item.summary || prev.summary,
      });
    } else {
      recordMap.set(item.cleanNumber, item);
    }
  }

  const mergedRecords = Array.from(recordMap.values());
  const updatedContentBase64 = Buffer.from(
    JSON.stringify(mergedRecords, null, 2),
    'utf-8'
  ).toString('base64');

  // 3. 透過 GitHub API 更新檔案並觸發 Commit
  const putRes = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: `feat(db): batch update scam numbers from CSV (${newRecords.length} records)`,
      content: updatedContentBase64,
      sha: sha || undefined,
    }),
  });

  if (!putRes.ok) {
    const errBody = await putRes.text();
    throw new Error(`GitHub API 回應錯誤: ${errBody}`);
  }

  return await putRes.json();
}