/* eslint-disable react-refresh/only-export-components */
import { useEffect, useState } from 'react'
import {
  ArrowLeft, ArrowRight, BadgeIndianRupee, Check, ChevronRight, HeartHandshake,
  MapPin, ShieldCheck, Sparkles, Target, TrendingUp, WalletCards,
} from 'lucide-react'
import { colleges, streams, type College } from './data'

export type StudentProfile = {
  name: string
  rank: string
  category: string
  city: string
  budget: string
  accommodation: string
  goals: string[]
  branches: string[]
}

const defaultProfile: StudentProfile = {
  name: 'Arjun Sharma', rank: '4523', category: 'OC', city: 'Hyderabad',
  budget: '150000', accommodation: 'Day scholar', goals: ['High-paying job', 'Software career'],
  branches: ['Computer Science', 'AI & Machine Learning'],
}

export function useStudentProfile() {
  const [profile, setProfile] = useState<StudentProfile>(() => {
    try { return JSON.parse(localStorage.getItem('enggxr-profile') || '') } catch { return defaultProfile }
  })
  useEffect(() => { localStorage.setItem('enggxr-profile', JSON.stringify(profile)) }, [profile])
  return { profile, setProfile }
}

export function Onboarding({ profile, setProfile, onDone, onBack }: { profile: StudentProfile; setProfile:(p:StudentProfile)=>void; onDone:()=>void; onBack:()=>void }) {
  const [step, setStep] = useState(0)
  const [draft, setDraft] = useState(profile)
  const steps = ['Identity', 'EAPCET', 'Preferences', 'Financial fit']
  const update = (key: keyof StudentProfile, value: string | string[]) => setDraft(d => ({...d,[key]:value}))
  const toggle = (key: 'goals'|'branches', value: string) => update(key, draft[key].includes(value) ? draft[key].filter(x=>x!==value) : [...draft[key],value])
  const finish = () => { setProfile(draft); onDone() }
  return <div className="page decision-page onboarding-page">
    <button className="back-link" onClick={onBack}><ArrowLeft size={16}/> Exit onboarding</button>
    <div className="onboarding-shell">
      <aside className="onboarding-rail"><span className="eyebrow cyan">PROFILE SETUP</span><h1>Build your recommendation profile.</h1><p>We use these details to calculate eligibility and personal fit. You can change them later.</p><ol>{steps.map((label,i)=><li className={i===step?'active':i<step?'done':''} key={label}><span>{i<step?<Check size={13}/>:i+1}</span>{label}</li>)}</ol></aside>
      <section className="onboarding-form">
        <div className="step-count">STEP {step+1} OF {steps.length}</div>
        {step===0 && <><h2>Tell us about the student</h2><p className="form-intro">Use the name shown on counselling documents.</p><div className="field-grid"><label>Full name<input value={draft.name} onChange={e=>update('name',e.target.value)}/></label><label>Home city<input value={draft.city} onChange={e=>update('city',e.target.value)}/></label></div></>}
        {step===1 && <><h2>Add EAPCET details</h2><p className="form-intro">Your rank and reservation category determine eligible options.</p><div className="field-grid"><label>EAPCET rank<input inputMode="numeric" value={draft.rank} onChange={e=>update('rank',e.target.value.replace(/\D/g,''))}/></label><label>Reservation category<select value={draft.category} onChange={e=>update('category',e.target.value)}><option>OC</option><option>BC-A</option><option>BC-B</option><option>BC-C</option><option>BC-D</option><option>BC-E</option><option>SC</option><option>ST</option></select></label></div><div className="form-trust"><ShieldCheck size={18}/><span>Eligibility is estimated from the profile. Official counselling rules always take precedence.</span></div></>}
        {step===2 && <><h2>Select your career goals</h2><p className="form-intro">Choose all that matter. Select all options that apply.</p><div className="choice-section"><strong>Career goals</strong><div className="choice-grid">{['High-paying job','Software career','Government job','Entrepreneurship','Higher studies','Research'].map(x=><button className={draft.goals.includes(x)?'selected':''} onClick={()=>toggle('goals',x)} key={x}>{draft.goals.includes(x)&&<Check size={15}/>} {x}</button>)}</div></div><div className="choice-section"><strong>Interested branches</strong><div className="choice-grid">{streams.map(x=><button className={draft.branches.includes(x.name)?'selected':''} onClick={()=>toggle('branches',x.name)} key={x.name}>{draft.branches.includes(x.name)&&<Check size={15}/>} {x.name}</button>)}</div></div></>}
        {step===3 && <><h2>Set practical boundaries</h2><p className="form-intro">This improves affordability and commute recommendations.</p><div className="field-grid"><label>Maximum annual tuition (INR )<input inputMode="numeric" value={draft.budget} onChange={e=>update('budget',e.target.value.replace(/\D/g,''))}/></label><label>Accommodation preference<select value={draft.accommodation} onChange={e=>update('accommodation',e.target.value)}><option>Day scholar</option><option>Hostel</option><option>Either</option></select></label></div><div className="review-box"><Check size={18}/><div><strong>Ready to calculate</strong><span>{draft.rank?`Rank ${Number(draft.rank).toLocaleString('en-IN')}`:'Rank missing'} - {draft.branches.length} preferred branches - INR {Number(draft.budget||0).toLocaleString('en-IN')} budget</span></div></div></>}
        <div className="onboarding-actions"><button className="secondary-btn" onClick={()=>step===0?onBack():setStep(s=>s-1)}>Back</button>{step<steps.length-1?<button className="primary-btn" disabled={step===0&&!draft.name||step===1&&!draft.rank} onClick={()=>setStep(s=>s+1)}>Continue <ArrowRight size={16}/></button>:<button className="primary-btn" onClick={finish}>Save and view matches <Sparkles size={16}/></button>}</div>
      </section>
    </div>
  </div>
}

export function CollegeDetail({ college, onBack, onCompare }: { college: College; onBack:()=>void; onCompare:()=>void }) {
  const probabilityTone = college.probability >= 75 ? 'strong' : college.probability >= 55 ? 'moderate' : 'ambitious'
  return <div className="page decision-page detail-page"><button className="back-link" onClick={onBack}><ArrowLeft size={16}/> Back to matches</button><header className="college-hero"><div><div className="college-meta"><span className={`category ${college.category.toLowerCase()}`}>{college.category}</span><span><MapPin size={14}/>{college.location}</span></div><h1>{college.name}</h1><p>{college.branch} has the highest branch match score for your current profile.</p><div className="hero-actions"><button className="primary-btn">Add to shortlist <HeartHandshake size={16}/></button><button className="secondary-btn" onClick={onCompare}>Compare college</button></div></div><div className="hero-score"><strong>{college.match}%</strong><span>personal fit</span><small>Calculated from 18 profile signals</small></div></header><section className="decision-summary"><div><span className="eyebrow">ADMISSION OUTLOOK</span><strong className={probabilityTone}>{college.probability}%</strong><p>{probabilityTone==='strong'?'Strong historical position':probabilityTone==='moderate'?'Plausible based on recent rounds':'Ambitious based on recent rounds'}</p></div><div><span className="eyebrow">ANNUAL TUITION</span><strong>{college.fee}</strong><p>Before hostel and transport</p></div><div><span className="eyebrow">AVERAGE PACKAGE</span><strong>{college.avgPackage}</strong><p>College-reported sample data</p></div><div><span className="eyebrow">ROI SCORE</span><strong>{college.roi}/100</strong><p>Fees compared with outcomes</p></div></section><div className="detail-grid"><section className="detail-main"><div className="content-section"><span className="eyebrow cyan">WHY IT MATCHES</span><h2>How this result was scored</h2><p>{college.reason} Your preference for {college.branch} and a software-focused career contributes most to this result.</p><ul className="reason-list"><li><Check/>Branch aligns with selected career goals</li><li><Check/>Annual tuition is within your current budget</li><li><Check/>Commute is compatible with day-scholar preference</li></ul></div><div className="content-section"><span className="eyebrow">HISTORICAL CUTOFF POSITION</span><h2>Recent closing-rank range</h2><div className="cutoff-chart" aria-label="Closing rank range from 2023 to 2025"><div><span>2023</span><i style={{width:'72%'}}/><b>5,180</b></div><div><span>2024</span><i style={{width:'63%'}}/><b>4,760</b></div><div><span>2025</span><i style={{width:'58%'}}/><b>4,490</b></div><em>Your rank: 4,523</em></div><small className="source-line">Demonstration data - Replace with official counselling sources before launch.</small></div></section><aside className="detail-aside"><span className="eyebrow">AT A GLANCE</span><dl><div><dt>Recommended branch</dt><dd>{college.branch}</dd></div><div><dt>Distance from home</dt><dd>{college.distance}</dd></div><div><dt>Accommodation</dt><dd>Hostel available</dd></div><div><dt>Accreditation</dt><dd>NAAC A+</dd></div><div><dt>Placement rate</dt><dd>82%</dd></div></dl><button className="secondary-btn">Explore campus in XR</button></aside></div></div>
}

export function CompareView({ selected, onBack }: { selected: College[]; onBack:()=>void }) {
  const list = selected.length >= 2 ? selected : colleges.slice(0,3)
  const rows: [string,(c:College)=>string][] = [['Admission probability',c=>`${c.probability}%`],['Recommended branch',c=>c.branch],['Annual tuition',c=>c.fee],['Average package',c=>c.avgPackage],['ROI score',c=>`${c.roi}/100`],['Distance from home',c=>c.distance],['Classification',c=>c.category]]
  return <div className="page decision-page compare-page"><button className="back-link" onClick={onBack}><ArrowLeft size={16}/> Back to matches</button><section className="page-title"><span className="eyebrow cyan">COLLEGE COMPARISON</span><h1>Compare the trade-offs.</h1><p>No college wins every category. Focus on the combination that best supports your admission chances, budget and career goals.</p></section><div className="comparison-table" role="table" aria-label="College comparison"><div className="comparison-row header" role="row"><div role="columnheader">Decision factor</div>{list.map(c=><div role="columnheader" key={c.id}><span>{c.short}</span><strong>{c.name}</strong></div>)}</div>{rows.map(([label,get])=><div className="comparison-row" role="row" key={label}><div role="rowheader">{label}</div>{list.map(c=><div role="cell" key={c.id}>{get(c)}</div>)}</div>)}</div><aside className="comparison-guidance"><Sparkles/><div><strong>How to read this comparison</strong><p>{list[0].short} has the highest combined score. {list[1].short} is the more ambitious career-outcome option, while {list[list.length-1].short} offers greater admission security. These are estimates, not guarantees.</p></div></aside></div>
}

export function StudentDNA({ onBack }: { onBack:()=>void }) {
  const dimensions = [{name:'Academic fit',value:91},{name:'Career fit',value:94},{name:'Financial fit',value:78},{name:'Campus fit',value:84},{name:'Lifestyle fit',value:82},{name:'Placement fit',value:93}]
  return <div className="page decision-page dna-page"><button className="back-link" onClick={onBack}><ArrowLeft size={16}/> Back to profile</button><section className="page-title split"><div><span className="eyebrow cyan">PROFILE ANALYSIS</span><h1>Your engineering decision profile.</h1><p>This report summarizes the profile fields used in your recommendations.</p></div><div className="dna-total"><strong>87</strong><span>overall readiness</span></div></section><div className="dna-layout"><section className="dna-dimensions">{dimensions.map(d=><div key={d.name}><header><strong>{d.name}</strong><span>{d.value}/100</span></header><div><i style={{width:`${d.value}%`}}/></div></div>)}</section><aside className="dna-story"><span className="eyebrow">PROFILE SUMMARY</span><h2>Your selected goals favor computing branches.</h2><p>Your mathematics result, selected interest in AI, and placement priority increase the scores for computing branches. Your annual budget is incomplete.</p><div className="strength-tags"><span>Systems thinking</span><span>Software focus</span><span>Career goals</span></div></aside></div><section className="dna-next"><Target/><div><strong>Recommended next step</strong><p>Compare CSE and AI & ML curricula before locking your branch order.</p></div><button className="primary-btn">Review recommended streams</button></section></div>
}

export function ParentDashboard({ onBack, onFinance }: { onBack:()=>void; onFinance:()=>void }) {
  return <div className="page decision-page parent-page"><button className="back-link" onClick={onBack}><ArrowLeft size={16}/> Back to student profile</button><section className="page-title"><span className="eyebrow cyan">PARENT VIEW</span><h1>Review cost, safety, and outcomes.</h1><p>This view shows the student's preferences with cost, safety, and outcome data.</p></section><div className="parent-summary"><div><WalletCards/><span>Estimated 4-year tuition</span><strong>INR 5.2L</strong><small>Before accommodation</small></div><div><TrendingUp/><span>Expected starting range</span><strong>INR 6-10L</strong><small>Based on sample placement data</small></div><div><ShieldCheck/><span>Safe options shortlisted</span><strong>1</strong><small>Add one more for balance</small></div></div><section className="family-checklist"><div><span className="eyebrow">FAMILY CHECKLIST</span><h2>Three decisions need attention.</h2></div><ol><li><span>01</span><div><strong>Confirm the annual education budget</strong><p>Scholarship eligibility may change the affordable range.</p></div><button onClick={onFinance}>Review finances <ChevronRight/></button></li><li><span>02</span><div><strong>Visit the top two campuses</strong><p>Compare commute, hostel and safety in person or through XR.</p></div><button>Open campus list <ChevronRight/></button></li><li><span>03</span><div><strong>Agree on a safe-option threshold</strong><p>Decide how much admission uncertainty the family accepts.</p></div><button>Review strategy <ChevronRight/></button></li></ol></section></div>
}

export function FinanceTools({ onBack }: { onBack:()=>void }) {
  const [fee,setFee]=useState(130000), [living,setLiving]=useState(70000), [salary,setSalary]=useState(800000)
  const total=(fee+living)*4, payback=total/salary
  const scholarships=[{name:'EAPCET Fee Reimbursement',fit:'Possible match',amount:'Up to full tuition'},{name:'AICTE Pragati Scholarship',fit:'Check eligibility',amount:'Up to INR 50,000/year'},{name:'College Merit Scholarship',fit:'Check requirements',amount:'10-50% tuition'}]
  return <div className="page decision-page finance-page"><button className="back-link" onClick={onBack}><ArrowLeft size={16}/> Back to parent view</button><section className="page-title"><span className="eyebrow cyan">FINANCIAL PLANNING</span><h1>Calculate education costs.</h1><p>Explore scenarios before committing. Final fees and scholarship decisions must be verified with official sources.</p></section><div className="finance-layout"><section className="roi-calculator"><span className="eyebrow">ROI SCENARIO</span><div className="field-grid"><label>Annual tuition (INR )<input type="number" value={fee} onChange={e=>setFee(Number(e.target.value))}/></label><label>Annual living & travel (INR )<input type="number" value={living} onChange={e=>setLiving(Number(e.target.value))}/></label><label>Expected starting salary (INR )<input type="number" value={salary} onChange={e=>setSalary(Number(e.target.value))}/></label></div><div className="roi-output"><div><span>Estimated 4-year cost</span><strong>INR {(total/100000).toFixed(1)}L</strong></div><div><span>Cost / starting salary</span><strong>{payback.toFixed(1)}x</strong></div><div><span>Planning assessment</span><strong>{payback<1.2?'Comfortable':'Review funding'}</strong></div></div></section><section className="scholarship-list"><span className="eyebrow">SCHOLARSHIP FINDER</span><h2>Scholarship options to verify</h2>{scholarships.map(s=><article key={s.name}><BadgeIndianRupee/><div><strong>{s.name}</strong><span>{s.amount}</span></div><em>{s.fit}</em></article>)}<small>Demonstration matches. Eligibility must be confirmed on the official scheme portal.</small></section></div></div>
}
