import { mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { DatabaseSync } from 'node:sqlite'

const databasePath = resolve(process.env.ENGGXR_DATABASE_PATH || 'data/enggxr.db')
mkdirSync(dirname(databasePath), { recursive: true })

export const db = new DatabaseSync(databasePath)
db.exec('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;')

db.exec(`
  CREATE TABLE IF NOT EXISTS students (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    rank INTEGER,
    category TEXT NOT NULL DEFAULT 'OC',
    city TEXT,
    budget INTEGER,
    accommodation TEXT,
    goals_json TEXT NOT NULL DEFAULT '[]',
    branches_json TEXT NOT NULL DEFAULT '[]',
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS colleges (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    short_name TEXT NOT NULL,
    location TEXT NOT NULL,
    branch TEXT NOT NULL,
    category TEXT NOT NULL,
    annual_fee INTEGER NOT NULL,
    average_package INTEGER NOT NULL,
    roi_score INTEGER NOT NULL,
    distance_km INTEGER NOT NULL,
    cutoff_rank INTEGER NOT NULL,
    placement_rate INTEGER NOT NULL,
    reason TEXT NOT NULL,
    data_status TEXT NOT NULL DEFAULT 'demonstration',
    source_url TEXT,
    source_updated_at TEXT
  );

  CREATE TABLE IF NOT EXISTS shortlists (
    student_id TEXT NOT NULL,
    college_id INTEGER NOT NULL,
    created_at TEXT NOT NULL,
    PRIMARY KEY (student_id, college_id),
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE CASCADE
  );
`)

const seedCollege = db.prepare(`
  INSERT OR IGNORE INTO colleges
  (id,name,short_name,location,branch,category,annual_fee,average_package,roi_score,distance_km,cutoff_rank,placement_rate,reason,data_status)
  VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,'demonstration')
`)

const seeds = [
  [1,'JNTUH University College of Engineering','JNTUH','Hyderabad','CSE','Target',120000,840000,94,18,5180,84,'Strong CSE outcomes and a balanced historical rank position.'],
  [2,'CBIT Hyderabad','CBIT','Gandipet','AI & ML','Dream',160000,910000,89,31,3900,88,'Strong AI career alignment with an ambitious historical cutoff.'],
  [3,'VNR VJIET','VNR','Bachupally','Data Science','Safe',135000,780000,87,24,6200,82,'Balanced admission position, commute and software placements.'],
  [4,'Vasavi College of Engineering','VASAVI','Ibrahim Bagh','ECE','Target',140000,720000,83,27,5300,80,'Reliable electronics outcomes with a plausible rank position.'],
] as const

for (const seed of seeds) seedCollege.run(...seed)

db.prepare(`INSERT OR IGNORE INTO students
  (id,name,rank,category,city,budget,accommodation,goals_json,branches_json,updated_at)
  VALUES (?,?,?,?,?,?,?,?,?,?)`).run(
  'demo-student','Arjun Sharma',4523,'OC','Hyderabad',150000,'Day scholar',
  JSON.stringify(['High-paying job','Software career']),
  JSON.stringify(['Computer Science','AI & Machine Learning']),
  new Date().toISOString(),
)

