import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight, Bell, Bot, Check, ChevronDown, CircleUserRound, BookOpenCheck, Building2,
  Compass, Heart, Home, LayoutDashboard, MapPin, Menu, GraduationCap,
  MessageSquareText, Route, Search, ShieldCheck, SlidersHorizontal, Sparkles,
  Target, TrendingUp, UserRound, WalletCards, X,
} from 'lucide-react'
import { colleges, streams, type College } from './data'
import { CollegeDetail, CompareView, FinanceTools, Onboarding, ParentDashboard, StudentDNA, useStudentProfile } from './ExtendedViews'
import { api } from './api'
import enggxrLogo from './assets/enggxr-logo-transparent.png'
import enggxrLogoDark from './assets/enggxr-logo-dark-transparent.png'

type View = 'home' | 'explore' | 'recommendations' | 'counselling' | 'profile' | 'onboarding' | 'college' | 'compare' | 'dna' | 'parent' | 'finance'

const nav = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'explore', label: 'Explore', icon: Compass },
  { id: 'recommendations', label: 'Matches', icon: Sparkles },
  { id: 'counselling', label: 'Counselling', icon: Route },
  { id: 'profile', label: 'Profile', icon: UserRound },
] as const

function Logo() {
  return <div className="logo" aria-label="EnggXR home">
    <img className="brand-logo logo-on-light" src={enggxrLogo} alt="EnggXR - Smart EAPCET Predictor"/>
    <img className="brand-logo logo-on-dark" src={enggxrLogoDark} alt="EnggXR - Smart EAPCET Predictor"/>
  </div>
}

function Gauge({ value, label, size = 'large' }: { value: number; label: string; size?: 'large' | 'small' }) {
  return <div className={`gauge ${size}`} style={{'--value': `${value * 3.6}deg`} as React.CSSProperties}>
    <div className="gauge-inner"><strong>{value}%</strong><span>{label}</span></div>
  </div>
}

function App() {
  const [authenticated, setAuthenticated] = useState(false)
  const [view, setView] = useState<View>('home')
  const [shortlisted, setShortlisted] = useState<number[]>([1])
  const [compare, setCompare] = useState<number[]>([])
  const [menuOpen, setMenuOpen] = useState(false)
  const [selectedCollege, setSelectedCollege] = useState<College>(colleges[0])
  const { profile, setProfile } = useStudentProfile()
  const [apiOnline, setApiOnline] = useState(false)

  useEffect(() => { api.health().then(()=>setApiOnline(true)).catch(()=>setApiOnline(false)) }, [])

  const navigate = (next: View) => { setView(next); setMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const toggleShortlist = (id: number) => setShortlisted(current => {
    const selected = !current.includes(id)
    void api.shortlist(id, selected).catch(() => undefined)
    return selected ? [...current, id] : current.filter(item => item !== id)
  })
  const toggleCompare = (id: number) => setCompare(s => s.includes(id) ? s.filter(x => x !== id) : s.length < 3 ? [...s, id] : s)

  if (!authenticated) return <PublicHome
    onSignIn={() => { setAuthenticated(true); setView('home') }}
    onStart={() => { setAuthenticated(true); setView('onboarding') }}
  />

  return <div className="app-shell">
    <a className="skip-link" href="#main">Skip to content</a>
    <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
      <div className="sidebar-head"><Logo/><button className="icon-btn close-menu" onClick={() => setMenuOpen(false)} aria-label="Close menu"><X/></button></div>
      <div className={`system-state ${apiOnline?'online':'offline'}`}><span/><div><b>Recommendation engine</b><small>{apiOnline?'API connected - demonstration data':'Offline demonstration mode'}</small></div></div>
      <nav aria-label="Primary navigation">
        {nav.map(item => <button key={item.id} className={view === item.id ? 'active' : ''} onClick={() => navigate(item.id)}>
          <item.icon size={19}/><span>{item.label}</span>{item.id === 'counselling' && <em>3</em>}
        </button>)}
      </nav>
      <div className="sidebar-card">
        <Bot size={22}/><span className="eyebrow">COLLEGE COUNSELLOR</span>
        <strong>Review a college decision</strong><p>Ask about ranks, fees, or preference order.</p>
        <button onClick={() => navigate('counselling')}>Start conversation <ArrowRight size={15}/></button>
      </div>
      <div className="student-mini"><div className="avatar">AS</div><div><strong>Arjun Sharma</strong><span>EAPCET - 4,523</span></div><ChevronDown size={16}/></div>
    </aside>

    <div className={`main-column ${(['explore', 'recommendations', 'profile', 'onboarding', 'college', 'compare', 'dna', 'parent', 'finance'] as View[]).includes(view) ? 'light-mode' : 'instrument-mode'}`}>
      <header className="topbar">
        <button className="icon-btn menu-btn" onClick={() => setMenuOpen(true)} aria-label="Open menu"><Menu/></button>
        <div className="mobile-logo"><Logo/></div>
        <div className="breadcrumb"><span>ENGGXR /</span> {view.toUpperCase()}</div>
        <div className="top-actions"><button className="deadline"><span/> EAPCET counselling in 08 days</button><button className="icon-btn" aria-label="Notifications"><Bell size={19}/><i/></button></div>
      </header>

      <main id="main">
        {view === 'home' && <Dashboard navigate={navigate} shortlisted={shortlisted.length}/>} 
        {view === 'explore' && <Explore navigate={navigate}/>} 
        {view === 'recommendations' && <Recommendations shortlisted={shortlisted} compare={compare} toggleShortlist={toggleShortlist} toggleCompare={toggleCompare} onCollege={(college)=>{setSelectedCollege(college);navigate('college')}} onCompare={()=>navigate('compare')}/>} 
        {view === 'counselling' && <Counselling/>} 
        {view === 'profile' && <Profile onOnboarding={()=>navigate('onboarding')} onDNA={()=>navigate('dna')} onParent={()=>navigate('parent')}/>} 
        {view === 'onboarding' && <Onboarding profile={profile} setProfile={(next)=>{setProfile(next);api.saveProfile(next).catch(()=>undefined)}} onDone={()=>navigate('recommendations')} onBack={()=>navigate('profile')}/>} 
        {view === 'college' && <CollegeDetail college={selectedCollege} onBack={()=>navigate('recommendations')} onCompare={()=>{if(!compare.includes(selectedCollege.id))setCompare(c=>[...c,selectedCollege.id]);navigate('compare')}}/>}
        {view === 'compare' && <CompareView selected={compare.map(id=>colleges.find(c=>c.id===id)).filter((c):c is College=>Boolean(c))} onBack={()=>navigate('recommendations')}/>} 
        {view === 'dna' && <StudentDNA onBack={()=>navigate('profile')}/>} 
        {view === 'parent' && <ParentDashboard onBack={()=>navigate('profile')} onFinance={()=>navigate('finance')}/>} 
        {view === 'finance' && <FinanceTools onBack={()=>navigate('parent')}/>} 
      </main>
    </div>

    <nav className="mobile-nav" aria-label="Mobile navigation">
      {nav.map(item => <button key={item.id} className={view === item.id ? 'active' : ''} onClick={() => navigate(item.id)}><item.icon size={20}/><span>{item.label}</span></button>)}
    </nav>
  </div>
}

function PublicHome({ onSignIn, onStart }: { onSignIn:()=>void; onStart:()=>void }) {
  return <div className="public-home">
    <header className="public-nav">
      <Logo/>
      <nav aria-label="Public navigation"><a href="#how">How it works</a><a href="#families">For families</a><a href="#trust">Our approach</a></nav>
      <div className="public-actions"><button className="public-signin" onClick={onSignIn}>Sign in</button><button className="public-start" onClick={onStart}>Build my shortlist <ArrowRight size={16}/></button></div>
    </header>

    <main>
      <section className="public-hero">
        <div className="hero-copy">
          <span className="hero-kicker"><i/> ENGINEERING ADMISSIONS, MADE CLEAR</span>
          <h1>Choose the right college.<br/><em>Know why.</em></h1>
          <p>Enter your rank, goals, and budget. EnggXR uses them to produce a college shortlist with reasons for each result.</p>
          <div className="hero-actions"><button className="hero-primary" onClick={onStart}>Find my college matches <ArrowRight size={18}/></button><a href="#how">See how EnggXR works</a></div>
          <div className="hero-assurance"><span><Check size={15}/> No payment required</span><span><Check size={15}/> Takes about 4 minutes</span><span><Check size={15}/> Estimates, never guarantees</span></div>
        </div>
        <div className="decision-preview" aria-label="Example college match explanation">
          <div className="preview-top"><span>YOUR DECISION BRIEF</span><small>Example profile - EAPCET</small></div>
          <div className="preview-rank"><small>RANK</small><strong>4,523</strong><span>38 realistic combinations found</span></div>
          <div className="preview-match"><div><b>01</b><span><strong>JNTUH - CSE</strong><small>Fits the selected budget and outcome filters</small></span></div><em>83% match</em></div>
          <div className="preview-match"><div><b>02</b><span><strong>VNR VJIET - Data Science</strong><small>Higher admission estimate in the sample data</small></span></div><em>87% match</em></div>
          <div className="preview-reason"><Sparkles size={18}/><p><strong>Why these fit</strong>Your rank, software interests, annual budget and commute preference were considered together.</p></div>
          <small className="preview-note">Illustrative results. Admission estimates are not guarantees.</small>
        </div>
      </section>

      <section className="trust-strip" id="trust"><p>One decision view for the questions that matter</p><div><span>Admission chance</span><span>Fees & ROI</span><span>Branch fit</span><span>Placements</span><span>Distance</span><span>Scholarships</span></div></section>

      <section className="public-how" id="how">
        <div className="section-intro"><span className="eyebrow cyan">FROM RANK TO PREFERENCE LIST</span><h2>A calmer way through counselling.</h2><p>Every recommendation comes with the reasoning and trade-offs you need to make the final call.</p></div>
        <div className="how-sequence">
          <article><span>01</span><GraduationCap/><h3>Tell us what matters</h3><p>Add your rank, preferred branches, budget and practical constraints.</p></article>
          <article><span>02</span><Target/><h3>Understand your matches</h3><p>See Dream, Target and Safe options with clear confidence context.</p></article>
          <article><span>03</span><BookOpenCheck/><h3>Build your preference order</h3><p>Compare trade-offs and enter counselling with a plan you can explain.</p></article>
        </div>
      </section>

      <section className="family-section" id="families">
        <div className="family-visual"><div className="family-number">INR 4.8L</div><p>Estimated four-year tuition</p><div className="family-row"><span>Expected outcome</span><strong>INR 8.4L avg. package</strong></div><div className="family-row"><span>Commute</span><strong>18 km</strong></div><div className="family-row"><span>Scholarship</span><strong>2 options to check</strong></div></div>
        <div className="family-copy"><span className="eyebrow">BUILT FOR FAMILY DECISIONS</span><h2>Parents can review the facts.</h2><p>Review cost, outcomes, commute, safety, and scholarships. Each recommendation lists its assumptions for family discussion.</p><ul><li><ShieldCheck/> Estimates include caveats</li><li><WalletCards/> Four-year cost and ROI view</li><li><Building2/> College-by-college trade-offs</li></ul><button onClick={onStart}>Create a free student profile <ArrowRight size={16}/></button></div>
      </section>

      <section className="public-cta"><span>YOUR NEXT STEP</span><h2>Start with your rank.<br/>Leave with a plan.</h2><button onClick={onStart}>Build my shortlist <ArrowRight size={18}/></button><p>Currently using demonstration college data for the prototype.</p></section>
    </main>
    <footer className="public-footer"><Logo/><p>Decision support for engineering admissions.</p><span>(c) 2026 EnggXR</span></footer>
  </div>
}

function Dashboard({ navigate, shortlisted }: { navigate: (v: View) => void; shortlisted: number }) {
  return <div className="page dashboard">
    <section className="welcome">
      <div><span className="eyebrow cyan">COUNSELLING CONSOLE - PROFILE 74% COMPLETE</span><h1>Good morning, Arjun.</h1><p>Your current profile returns 38 college-branch combinations. The first eight have the highest match scores.</p></div>
      <button className="primary-btn" onClick={() => navigate('recommendations')}>View your matches <ArrowRight size={17}/></button>
    </section>

    <section className="readiness-panel">
      <div className="readiness-copy"><span className="eyebrow">DECISION READINESS</span><h2>Your profile has most required fields.</h2><p>Complete your budget details to improve financial-fit accuracy.</p><button className="text-btn" onClick={() => navigate('profile')}>Complete missing details <ArrowRight size={15}/></button></div>
      <Gauge value={82} label="READY" />
      <div className="signal-list">
        <div><span>Rank confidence</span><strong>High</strong></div><div><span>Profile signals</span><strong>18 / 21</strong></div><div><span>Shortlisted</span><strong>{shortlisted} college</strong></div>
      </div>
    </section>

    <section className="section-block">
      <div className="section-heading"><div><span className="eyebrow">TODAY'S PRIORITY</span><h2>Next actions</h2></div><span className="updated">Updated 4 min ago</span></div>
      <div className="action-grid">
        <button className="action-primary" onClick={() => navigate('recommendations')}><span className="step">01</span><Sparkles/><div><strong>Review 8 college matches</strong><p>Three have changed after the latest cutoff update.</p></div><ArrowRight/></button>
        <button onClick={() => navigate('counselling')}><span className="step">02</span><Route/><div><strong>Build preference order</strong><p>Balance ambitious and higher-probability options.</p></div><ArrowRight/></button>
        <button onClick={() => navigate('profile')}><span className="step">03</span><WalletCards/><div><strong>Add annual budget</strong><p>Add this value to calculate ROI and scholarship matches.</p></div><ArrowRight/></button>
      </div>
    </section>

    <section className="dashboard-grid">
      <div className="recommend-preview">
        <div className="section-heading"><div><span className="eyebrow">TOP COLLEGE MATCHES</span><h2>Best-fit options</h2></div><button className="text-btn" onClick={() => navigate('recommendations')}>View all</button></div>
        {colleges.slice(0,3).map((college, i) => <div className="compact-college" key={college.id}><span className="rank">0{i+1}</span><div className="college-monogram">{college.short.slice(0,2)}</div><div><strong>{college.name}</strong><span>{college.branch} - {college.location}</span></div><div className="match"><strong>{college.match}%</strong><span>match</span></div></div>)}
      </div>
      <div className="deadline-panel"><span className="eyebrow amber">COUNSELLING TIMELINE</span><h2>8 days remaining</h2><p>Web-option entry is expected to open on 14 August.</p><div className="timeline"><span className="done"/><span className="done"/><span className="current"/><span/></div><div className="timeline-labels"><span>Verified</span><span>Shortlist</span><span>Order</span><span>Submit</span></div><button className="secondary-btn" onClick={() => navigate('counselling')}>Open counselling plan</button></div>
    </section>
  </div>
}

function Explore({ navigate }: { navigate: (v: View) => void }) {
  const [query, setQuery] = useState('')
  const filtered = streams.filter(s => s.name.toLowerCase().includes(query.toLowerCase()))
  return <div className="page">
    <section className="page-title"><span className="eyebrow cyan">CAREER DISCOVERY</span><h1>Compare engineering branches.</h1><p>Compare branches using your academic results, interests, and preferred work environment.</p></section>
    <div className="toolbar"><label className="search"><Search size={18}/><span className="sr-only">Search streams</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search engineering streams"/></label><button className="secondary-btn"><SlidersHorizontal size={16}/> Filters</button></div>
    {filtered.length > 0 ? <div className="stream-grid">{filtered.map((stream, i) => <article className="stream-card" key={stream.name}><div className="stream-top"><span>UNIT_0{i+1}</span><strong>{stream.match}%</strong></div><h2>{stream.name}</h2><div className="stream-score"><span style={{width: `${stream.match}%`}}/></div><dl><div><dt>Career outlook</dt><dd>{stream.outlook}</dd></div><div><dt>Salary range</dt><dd>{stream.salary}</dd></div></dl><button onClick={() => navigate('recommendations')}>Explore matched colleges <ArrowRight size={16}/></button></article>)}</div> : <section className="empty-state" aria-live="polite"><Search size={24}/><h2>No matching streams</h2><p>Try a broader term such as "computer," "data," or "electronics."</p><button className="secondary-btn" onClick={()=>setQuery('')}>Clear search</button></section>}
  </div>
}

function Recommendations({ shortlisted, compare, toggleShortlist, toggleCompare, onCollege, onCompare }: { shortlisted: number[]; compare: number[]; toggleShortlist: (id:number)=>void; toggleCompare:(id:number)=>void; onCollege:(college:College)=>void; onCompare:()=>void }) {
  const [filter, setFilter] = useState<'All' | College['category']>('All')
  const [recommendationData,setRecommendationData] = useState<College[]>(colleges)
  const [dataState,setDataState] = useState<'loading'|'api'|'fallback'>('loading')
  useEffect(()=>{ api.recommendations().then(data=>{setRecommendationData(data);setDataState('api')}).catch(()=>setDataState('fallback')) },[])
  const shown = useMemo(() => filter === 'All' ? recommendationData : recommendationData.filter(c => c.category === filter), [filter,recommendationData])
  return <div className="page">
    <section className="page-title split"><div><span className="eyebrow cyan">MATCH RESULTS - SAMPLE DATA</span><h1>College matches for your profile.</h1><p>Ranked using your EAPCET performance, career goals, budget, commute, and placement priorities.</p></div><div className="summary-chip"><strong>{colleges.length}</strong><span>results shown</span></div></section>
    <aside className="evidence-note" aria-label="Recommendation methodology"><ShieldCheck size={18}/><div><strong>{dataState==='loading'?'Calculating recommendations...':dataState==='api'?'Local API connected - demonstration model':'Offline demonstration results'}</strong><span>Probabilities use your current profile and demonstration cutoffs. They are guidance, not an admission guarantee.</span></div><button>How this was calculated</button></aside>
    <div className="filter-row"><div role="group" aria-label="Filter by admission category">{(['All','Dream','Target','Safe'] as const).map(x => <button className={filter === x ? 'active' : ''} onClick={() => setFilter(x)} key={x}>{x}</button>)}</div><button className="secondary-btn"><SlidersHorizontal size={16}/> More filters</button></div>
    <div className="college-list">{shown.map((college, i) => <CollegeCard key={college.id} college={college} index={i} shortlisted={shortlisted.includes(college.id)} comparing={compare.includes(college.id)} onShortlist={() => toggleShortlist(college.id)} onCompare={() => toggleCompare(college.id)} onView={()=>onCollege(college)}/>)}</div>
    {compare.length > 0 && <div className="compare-tray"><div><strong>{compare.length} selected</strong><span>{compare.map(id => colleges.find(c => c.id === id)?.short).join(' - ')}</span></div><button className="primary-btn" disabled={compare.length < 2} onClick={onCompare}>Compare colleges <ArrowRight size={16}/></button></div>}
  </div>
}

function CollegeCard({ college, index, shortlisted, comparing, onShortlist, onCompare, onView }: {college:College; index:number; shortlisted:boolean; comparing:boolean; onShortlist:()=>void; onCompare:()=>void; onView:()=>void}) {
  return <article className="college-card"><div className="college-index">0{index+1}</div><div className="college-main"><div className="college-heading"><div className="college-monogram large">{college.short.slice(0,2)}</div><div><div className="college-meta"><span className={`category ${college.category.toLowerCase()}`}>{college.category}</span><span><MapPin size={13}/>{college.location}</span></div><h2>{college.name}</h2><p>{college.branch} recommended</p></div></div><div className="reason"><Sparkles size={17}/><span><b>Why it fits:</b> {college.reason}</span></div></div><div className="college-metrics"><Gauge value={college.match} label="MATCH" size="small"/><dl><div><dt>Admission probability</dt><dd>{college.probability}%</dd></div><div><dt>Annual fee</dt><dd>{college.fee}</dd></div><div><dt>Average package</dt><dd>{college.avgPackage}</dd></div><div><dt>ROI score</dt><dd>{college.roi}/100</dd></div></dl></div><div className="college-actions"><button className={shortlisted ? 'selected' : ''} onClick={onShortlist} aria-pressed={shortlisted}><Heart size={17} fill={shortlisted ? 'currentColor' : 'none'}/>{shortlisted ? 'Shortlisted' : 'Shortlist'}</button><button className={comparing ? 'selected' : ''} onClick={onCompare} aria-pressed={comparing}><LayoutDashboard size={17}/>{comparing ? 'Added' : 'Compare'}</button><button className="view-btn" onClick={onView}>View college <ArrowRight size={16}/></button></div></article>
}

function Counselling() {
  const [order, setOrder] = useState(colleges)
  const move = (index: number, direction: -1 | 1) => { const next = [...order]; const target = index + direction; if (target < 0 || target >= next.length) return; [next[index], next[target]] = [next[target], next[index]]; setOrder(next) }
  return <div className="page">
    <section className="war-room-head"><div><span className="eyebrow amber">COUNSELLING WAR ROOM</span><h1>Build a preference order you can trust.</h1><p>Your current sequence balances ambition with admission security. Nothing is submitted automatically.</p></div><div className="round-status"><span>ROUND 01</span><strong>08d : 14h : 32m</strong><small>Estimated time to option entry</small></div></section>
    <div className="strategy-strip"><div><Target/><span><b>1 Dream</b> ambitious option</span></div><div><TrendingUp/><span><b>2 Target</b> balanced options</span></div><div><ShieldCheck/><span><b>1 Safe</b> higher-probability option</span></div><div className="strategy-score"><strong>88</strong><span>List coverage</span></div></div>
    <section className="preference-builder"><div className="section-heading"><div><span className="eyebrow">PREFERENCE SEQUENCE</span><h2>Your working order</h2></div><span className="updated">Changes saved locally</span></div><div className="preference-list">{order.map((college, i) => <div className="preference-row" key={college.id}><span className="drag">::</span><strong className="pref-number">{String(i+1).padStart(2,'0')}</strong><div className="college-monogram">{college.short.slice(0,2)}</div><div className="pref-name"><strong>{college.name}</strong><span>{college.branch} - {college.category}</span></div><div className="prob"><span>Admission</span><strong>{college.probability}%</strong></div><div className="move-buttons"><button onClick={() => move(i,-1)} disabled={i===0} aria-label={`Move ${college.short} up`}>Up</button><button onClick={() => move(i,1)} disabled={i===order.length-1} aria-label={`Move ${college.short} down`}>Down</button></div></div>)}</div></section>
    <section className="ai-note"><Bot/><div><span className="eyebrow cyan">SEQUENCE REVIEW</span><h2>Review one branch trade-off.</h2><p>Move VNR VJIET above Vasavi if software placements matter more than the ECE branch. This is guidance, not an admission guarantee.</p></div><button className="secondary-btn">View reasons <MessageSquareText size={16}/></button></section>
  </div>
}

function Profile({onOnboarding,onDNA,onParent}:{onOnboarding:()=>void;onDNA:()=>void;onParent:()=>void}) {
  const [saved, setSaved] = useState(false)
  return <div className="page profile-page"><section className="page-title"><span className="eyebrow cyan">STUDENT SIGNALS</span><h1>Your recommendation profile.</h1><p>Keep these details current. Each change can affect your matches and admission estimates.</p></section><div className="profile-shortcuts"><button onClick={onOnboarding}><CircleUserRound/><div><strong>Guided profile setup</strong><span>Complete every recommendation field</span></div><ArrowRight/></button><button onClick={onDNA}><Sparkles/><div><strong>Student profile report</strong><span>Review the inputs behind your matches</span></div><ArrowRight/></button><button onClick={onParent}><ShieldCheck/><div><strong>Parent view</strong><span>Review cost, safety, and outcomes</span></div><ArrowRight/></button></div><div className="profile-layout"><aside className="profile-summary"><div className="avatar big">AS</div><h2>Arjun Sharma</h2><span>EAPCET 2026 aspirant</span><Gauge value={74} label="COMPLETE" size="small"/><div className="verified"><Check size={15}/> Rank details verified</div></aside><form className="profile-form" onSubmit={e => {e.preventDefault();setSaved(true)}}><div className="form-section"><span className="eyebrow">ACADEMIC IDENTITY</span><div className="field-grid"><label>Full name<input defaultValue="Arjun Sharma"/></label><label>EAPCET rank<input defaultValue="4523" inputMode="numeric"/></label><label>Reservation category<select defaultValue="OC"><option>OC</option><option>BC-A</option><option>BC-B</option><option>SC</option><option>ST</option></select></label><label>Preferred city<select defaultValue="Hyderabad"><option>Hyderabad</option><option>Warangal</option><option>Vijayawada</option><option>Any location</option></select></label></div></div><div className="form-section"><span className="eyebrow">FINANCIAL PREFERENCES</span><div className="field-grid"><label>Annual college budget<input placeholder="e.g. INR 1,50,000"/></label><label>Accommodation<select defaultValue="Day scholar"><option>Day scholar</option><option>Hostel</option><option>Either</option></select></label></div></div><div className="form-footer"><span>{saved ? <><Check size={15}/> Profile saved</> : 'Changes update your recommendations'}</span><button className="primary-btn" type="submit">Save profile</button></div></form></div></div>
}

export default App
