import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { z } from 'zod'
import { db } from './db.js'

const app = express()
const port = Number(process.env.ENGGXR_API_PORT || 4400)
const webOrigin = process.env.ENGGXR_WEB_ORIGIN || 'http://127.0.0.1:4399'

app.use(helmet())
app.use(cors({ origin: [webOrigin, 'http://localhost:4399'] }))
app.use(express.json({ limit: '256kb' }))

const profileSchema = z.object({
  name: z.string().trim().min(2).max(120),
  rank: z.coerce.number().int().positive().max(1_000_000).nullable().optional(),
  category: z.string().trim().min(1).max(20),
  city: z.string().trim().max(100).optional().default(''),
  budget: z.coerce.number().int().nonnegative().max(10_000_000).optional().default(0),
  accommodation: z.string().trim().max(40).optional().default('Either'),
  goals: z.array(z.string().max(80)).max(20).default([]),
  branches: z.array(z.string().max(80)).max(20).default([]),
})

type CollegeRow = {
  id:number; name:string; short_name:string; location:string; branch:string; category:string;
  annual_fee:number; average_package:number; roi_score:number; distance_km:number;
  cutoff_rank:number; placement_rate:number; reason:string; data_status:string;
  source_url:string|null; source_updated_at:string|null;
}

const serializeCollege = (row: CollegeRow) => ({
  id:row.id, name:row.name, short:row.short_name, location:row.location, branch:row.branch,
  category:row.category, annualFee:row.annual_fee, averagePackage:row.average_package,
  roi:row.roi_score, distanceKm:row.distance_km, cutoffRank:row.cutoff_rank,
  placementRate:row.placement_rate, reason:row.reason, dataStatus:row.data_status,
  sourceUrl:row.source_url, sourceUpdatedAt:row.source_updated_at,
})

app.get('/api/health', (_req,res) => res.json({ status:'ok', service:'enggxr-api', dataMode:'demonstration', timestamp:new Date().toISOString() }))

app.get('/api/colleges', (req,res) => {
  const branch = typeof req.query.branch === 'string' ? req.query.branch : undefined
  const rows = branch
    ? db.prepare('SELECT * FROM colleges WHERE branch LIKE ? ORDER BY roi_score DESC').all(`%${branch}%`)
    : db.prepare('SELECT * FROM colleges ORDER BY roi_score DESC').all()
  res.json({ data:(rows as unknown as CollegeRow[]).map(serializeCollege), meta:{ dataMode:'demonstration', authoritative:false } })
})

app.get('/api/students/:id', (req,res) => {
  const row = db.prepare('SELECT * FROM students WHERE id = ?').get(req.params.id) as Record<string,unknown>|undefined
  if (!row) return res.status(404).json({ error:{ code:'student_not_found', message:'Student profile was not found.' } })
  return res.json({ data:{ ...row, goals:JSON.parse(String(row.goals_json)), branches:JSON.parse(String(row.branches_json)), goals_json:undefined, branches_json:undefined } })
})

app.put('/api/students/:id', (req,res) => {
  const parsed = profileSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error:{ code:'invalid_profile', message:'Check the highlighted profile information.', fields:parsed.error.flatten().fieldErrors } })
  const p = parsed.data
  db.prepare(`INSERT INTO students (id,name,rank,category,city,budget,accommodation,goals_json,branches_json,updated_at)
    VALUES (?,?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET name=excluded.name,rank=excluded.rank,category=excluded.category,
    city=excluded.city,budget=excluded.budget,accommodation=excluded.accommodation,goals_json=excluded.goals_json,
    branches_json=excluded.branches_json,updated_at=excluded.updated_at`).run(
      req.params.id,p.name,p.rank??null,p.category,p.city,p.budget,p.accommodation,JSON.stringify(p.goals),JSON.stringify(p.branches),new Date().toISOString())
  res.json({ data:{ id:req.params.id,...p }, meta:{ saved:true } })
})

app.get('/api/recommendations/:studentId', (req,res) => {
  const student = db.prepare('SELECT * FROM students WHERE id = ?').get(req.params.studentId) as {rank:number|null;budget:number|null;branches_json:string}|undefined
  if (!student) return res.status(404).json({ error:{ code:'student_not_found', message:'Complete a student profile before calculating recommendations.' } })
  const branches = JSON.parse(student.branches_json || '[]') as string[]
  const rows = db.prepare('SELECT * FROM colleges').all() as unknown as CollegeRow[]
  const results = rows.map(row => {
    const rankGap = student.rank ? row.cutoff_rank - student.rank : 0
    const probability = student.rank ? Math.max(15,Math.min(92,Math.round(55 + rankGap/55))) : 50
    const budgetFit = !student.budget || row.annual_fee <= student.budget ? 100 : Math.max(35,100-Math.round((row.annual_fee-student.budget)/2500))
    const branchFit = branches.some(b => row.branch.toLowerCase().includes(b.split(' ')[0].toLowerCase())) ? 100 : 78
    const match = Math.round(probability*.35 + budgetFit*.2 + branchFit*.2 + row.roi_score*.25)
    const classification = probability >= 75 ? 'Safe' : probability >= 50 ? 'Target' : 'Dream'
    return { ...serializeCollege(row), probability, match, classification, explanation:[`${probability}% estimate from demonstration cutoff position`,`${budgetFit}% financial fit`,`${branchFit}% branch preference fit`] }
  }).sort((a,b)=>b.match-a.match)
  res.json({ data:results, meta:{ modelVersion:'rules-demo-1', dataMode:'demonstration', authoritative:false, disclaimer:'Not an admission guarantee. Replace demonstration cutoffs with official counselling data.' } })
})

app.get('/api/shortlists/:studentId', (req,res) => {
  const rows = db.prepare(`SELECT c.* FROM colleges c JOIN shortlists s ON s.college_id=c.id WHERE s.student_id=? ORDER BY s.created_at DESC`).all(req.params.studentId)
  res.json({ data:(rows as unknown as CollegeRow[]).map(serializeCollege) })
})

app.put('/api/shortlists/:studentId/:collegeId', (req,res) => {
  const student = db.prepare('SELECT id FROM students WHERE id=?').get(req.params.studentId)
  const college = db.prepare('SELECT id FROM colleges WHERE id=?').get(Number(req.params.collegeId))
  if (!student || !college) return res.status(404).json({ error:{ code:'resource_not_found', message:'Student or college was not found.' } })
  db.prepare('INSERT OR IGNORE INTO shortlists (student_id,college_id,created_at) VALUES (?,?,?)').run(req.params.studentId,Number(req.params.collegeId),new Date().toISOString())
  res.status(201).json({ data:{ studentId:req.params.studentId,collegeId:Number(req.params.collegeId),shortlisted:true } })
})

app.delete('/api/shortlists/:studentId/:collegeId', (req,res) => {
  db.prepare('DELETE FROM shortlists WHERE student_id=? AND college_id=?').run(req.params.studentId,Number(req.params.collegeId))
  res.status(204).end()
})

app.use((_req,res) => res.status(404).json({ error:{ code:'route_not_found', message:'API route not found.' } }))

app.listen(port,'127.0.0.1',() => console.log(`EnggXR API listening on http://127.0.0.1:${port}`))

