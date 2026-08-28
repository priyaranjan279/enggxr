export type MobileCollege = {
  id: number;
  short: string;
  name: string;
  branch: string;
  location: string;
  category: string;
  match: number;
  probability: number;
  fee: string;
  pkg: string;
  reason: string;
};

type Recommendation = {
  id: number;
  short: string;
  name: string;
  branch: string;
  location: string;
  classification: string;
  match: number;
  probability: number;
  annualFee: number;
  averagePackage: number;
  reason: string;
};

const apiUrl = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '');

export const hasApi = Boolean(apiUrl);

async function request(path: string, init?: RequestInit) {
  if (!apiUrl) throw new Error('API URL is not configured.');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(`${apiUrl}${path}`, {
      ...init,
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json', ...init?.headers },
    });
    if (!response.ok) throw new Error(`Request failed with status ${response.status}.`);
    return response;
  } finally {
    clearTimeout(timeout);
  }
}

export async function saveProfile(name: string, rank: string, budget: string) {
  await request('/api/students/mobile-student', {
    method: 'PUT',
    body: JSON.stringify({
      name,
      rank: Number(rank),
      category: 'General',
      city: '',
      budget: Number(budget),
      accommodation: 'Either',
      goals: ['Strong placements'],
      branches: ['CSE', 'AI and ML'],
    }),
  });
}

export async function getRecommendations(): Promise<MobileCollege[]> {
  const response = await request('/api/recommendations/mobile-student');
  const payload = (await response.json()) as { data: Recommendation[] };
  return payload.data.map((item) => ({
    id: item.id,
    short: item.short,
    name: item.name,
    branch: item.branch,
    location: item.location,
    category: item.classification,
    match: item.match,
    probability: item.probability,
    fee: `INR ${(item.annualFee / 100000).toFixed(2)}L`,
    pkg: `INR ${(item.averagePackage / 100000).toFixed(1)}L`,
    reason: item.reason,
  }));
}

export async function updateRemoteShortlist(collegeId: number, selected: boolean) {
  await request(`/api/shortlists/mobile-student/${collegeId}`, { method: selected ? 'PUT' : 'DELETE' });
}
