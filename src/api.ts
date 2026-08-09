import type { College } from './data'
import type { StudentProfile } from './ExtendedViews'

const baseUrl = import.meta.env.VITE_ENGGXR_API_URL || ''

type ApiRecommendation = {
  id:number; name:string; short:string; location:string; branch:string; match:number;
  probability:number; classification:College['category']; annualFee:number;
  averagePackage:number; roi:number; distanceKm:number; reason:string;
}

async function request<T>(path:string, init?:RequestInit):Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, { ...init, headers:{ 'Content-Type':'application/json', ...init?.headers } })
  if (!response.ok) {
    const payload = await response.json().catch(()=>null) as {error?:{message?:string}}|null
    throw new Error(payload?.error?.message || `Request failed (${response.status})`)
  }
  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

export const api = {
  health: () => request<{status:string;dataMode:string}>('/api/health'),
  recommendations: async ():Promise<College[]> => {
    const payload = await request<{data:ApiRecommendation[]}>('/api/recommendations/demo-student')
    return payload.data.map(c=>({ id:c.id,name:c.name,short:c.short,location:c.location,branch:c.branch,
      match:c.match,probability:c.probability,category:c.classification,fee:`INR ${(c.annualFee/100000).toFixed(2).replace(/\.00$/,'')}L`,
      avgPackage:`INR ${(c.averagePackage/100000).toFixed(1)}L`,roi:c.roi,distance:`${c.distanceKm} km`,reason:c.reason }))
  },
  saveProfile: (profile:StudentProfile) => request('/api/students/demo-student',{method:'PUT',body:JSON.stringify({...profile,rank:Number(profile.rank)||null,budget:Number(profile.budget)||0})}),
  shortlist: (collegeId:number, selected:boolean) => request(`/api/shortlists/demo-student/${collegeId}`,{method:selected?'PUT':'DELETE'}),
}
