import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ArrowUpRight, Home, Menu, X, Plus, Trash2, Edit3, Download, Upload, Lock } from 'lucide-react'
import { initialProperties, requirements, services } from './data.js'
import { deleteProperty, getProperties, saveProperty, hasSupabase } from './supabase.js'
import './styles.css'

const WA = 'https://wa.me/919373136048?text=Hey%20Amar%2C%20I%20am%20interested%20in%20one%20of%20your%20real%20estate%20listings.'

function useRoute(){
  const [path,setPath]=useState(location.pathname)
  useEffect(()=>{
    const onPop=()=>setPath(location.pathname)
    addEventListener('popstate',onPop)
    return()=>removeEventListener('popstate',onPop)
  },[])
  const nav=(to)=>{history.pushState(null,'',to); setPath(to); scrollTo({top:0,behavior:'smooth'})}
  return [path,nav]
}

function Header({nav}){
  const [open,setOpen]=useState(false)
  const links=[['/properties','PROPERTIES'],['/about','ABOUT US'],['/requirements','AB Realty Requirements']]
  return <>
    <header className="site-header">
      <button className="brand" onClick={()=>nav('/')}>AB REALTY</button>
      <nav>{links.map(([href,label])=><button key={href} onClick={()=>nav(href)}>{label}</button>)}<button className="cta gold" onClick={()=>nav('/enquire')}>Enquire here <ArrowUpRight size={15}/></button></nav>
      <button className="hamb" onClick={()=>setOpen(true)}><Menu/></button>
    </header>
    {open && <div className="mobile-menu">
      <button className="close" onClick={()=>setOpen(false)}><X/></button>
      {links.map(([href,label])=><button key={href} onClick={()=>{setOpen(false);nav(href)}}>{label}</button>)}
      <button className="cta gold" onClick={()=>{setOpen(false);nav('/enquire')}}>Enquire here <ArrowUpRight size={15}/></button>
    </div>}
  </>
}

function Preloader(){
  const [hide,setHide]=useState(false)
  useEffect(()=>{const t=setTimeout(()=>setHide(true),1450); return()=>clearTimeout(t)},[])
  return <div className={`preloader ${hide?'hide':''}`}><img src="/assets/logo-original.webp" alt="AB Realty"/><span/></div>
}

function Reveal({children, className=''}){ return <div className={`reveal ${className}`}>{children}</div> }

function HomePage({nav,properties}){
  return <main>
    <section className="hero">
      <video className="hero-video" autoPlay muted loop playsInline poster="/assets/landing-wide.webp"><source src="/hero.mp4" type="video/mp4"/></video>
      <div className="hero-fallback"></div><div className="hero-shade"></div>
      <div className="hero-content">
        <Reveal><h1>Goa Real Estate,<br/>Made Clear</h1></Reveal>
        <Reveal><p>Boutique property advisory for villas, apartments, land<br/>and investment opportunities across Goa.</p></Reveal>
        <button className="cta light" onClick={()=>nav('/properties')}>Find your home <ArrowUpRight size={16}/></button>
      </div>
    </section>

    <section className="about-strip grid-2 section-pad">
      <div>
        <p className="eyebrow">ABOUT AB REALTY</p>
        <h2>Trusted Boutique Real Estate Advisory in Goa</h2>
        <p>Founded by Amar Bernard, AB Realty is a boutique property consultancy built on trust, transparency and personalised guidance.</p>
        <p>With roots in London and years of family experience in Goa’s property market, Amar brings a rare mix of international perspective and local insight. AB Realty works with HNIs, NRIs and serious buyers looking for luxury villas, apartments, land and high-value investment opportunities.</p>
        <p>Every property is carefully vetted for location, design, legal strength, resale potential and long-term value, giving clients safer decisions and a smoother buying experience.</p>
        <button className="cta dark" onClick={()=>nav('/about')}>READ MORE <ArrowUpRight size={15}/></button>
      </div>
      <div className="portrait-holder"><img src="/assets/landing-hero.webp" alt="AB Realty luxury interior placeholder"/></div>
    </section>

    <section className="instagram-band">
      <p>Follow us on Instagram&nbsp; <a href="https://www.instagram.com/ab_realty_in" target="_blank" rel="noreferrer">@ab_realty_in</a></p>
      <div className="insta-rail">
        {[1,2,3,4,5].map((n)=><a key={n} href="https://www.instagram.com/ab_realty_in" target="_blank" rel="noreferrer" className="insta-card"><img src={n%2?'/assets/brand-ad.webp':'/assets/landing-wide.webp'} alt="AB Realty Instagram preview"/><span>View on Instagram</span></a>)}
      </div>
    </section>

    <section className="properties-preview section-pad">
      <p className="eyebrow">FEATURED PROPERTIES</p>
      <div className="section-head"><h2>We Find Spaces You’ll Love</h2><button className="cta dark" onClick={()=>nav('/properties')}>ALL PROPERTIES <ArrowUpRight size={15}/></button></div>
      <PropertyGrid properties={properties.slice(0,2)} nav={nav}/>
    </section>

    <section className="services section-pad muted">
      <h2>We Offer a Range of Services<br/>Tailored to Your Needs</h2>
      <div className="service-grid">{services.map((s,i)=><div className="service-card" key={s.title}><div className="service-icon"><Home size={36}/></div><h3>{s.title}</h3><p>{s.text}</p></div>)}</div>
    </section>
  </main>
}

function PropertyGrid({properties, nav}){
  return <div className="property-grid">{properties.map(p=><article className="property-card" key={p.id} onClick={()=>nav(`/properties/${p.id}`)}>
    <div className="property-img"><img src={p.image || '/assets/landing-wide.webp'} alt={p.title}/><span>{p.badge}</span></div>
    <div className="property-body"><h3>{p.title}</h3><p>{p.location}</p><strong>{p.price}</strong><p>{p.summary}</p><button className="text-link">View Property <ArrowUpRight size={14}/></button></div>
  </article>)}</div>
}

function PropertiesPage({nav,properties}){
  return <main className="page"><section className="page-hero small"><p className="eyebrow">FEATURED PROPERTIES</p><h1>Selected Goa Properties</h1><p>We only share properties we believe are worth your time. Explore selected Goa properties with honest guidance, clear details and support from AB Realty at every step.</p></section><section className="section-pad"><PropertyGrid properties={properties} nav={nav}/></section></main>
}

function PropertyDetail({id, properties, nav}){
  const p=properties.find(x=>x.id===id)||properties[0]
  return <main className="page detail"><section className="detail-hero"><img src={p.image} alt={p.title}/><div><p className="eyebrow">{p.badge}</p><h1>{p.title}</h1><p className="lead">{p.summary}</p><div className="meta"><span>{p.location}</span><span>{p.price}</span><span>{p.area}</span></div><p>{p.highlights}</p><a className="cta gold" href={p.whatsapp || WA} target="_blank" rel="noreferrer">Enquire Now <ArrowUpRight size={15}/></a></div></section></main>
}

function AboutPage(){ return <main className="page"><section className="about-page section-pad"><p className="eyebrow">ABOUT AB REALTY</p><h1>Built on Trust, Local Knowledge and Personal Service</h1><div className="copy"><p>AB Realty is a boutique real estate consultancy in Goa, founded by Amar Bernard. Built on trust, local knowledge and personal service, we help clients buy, sell, rent, invest and manage property with clear guidance at every step.</p><p>Real estate has always been close to Amar’s life. Raised around Goa’s property market and guided by family experience of more than two decades, he understands that a good property decision is not just about price or location. It is about lifestyle, long-term value, legal clarity, timing and trust.</p><p>At AB Realty, we do not believe in pushing every listing. We believe in showing properties that make sense.</p></div></section><section className="founder-note"><h2>A Responsible Future for Goa Real Estate</h2><p>Goa is one of the most special places in the world, and real estate here has to be handled with respect. It is not just about buying land, selling homes or building value. It is about understanding the balance between people, property, nature and the future of the place we call home.</p><p>Goa’s beauty is part of its value. The beaches, villages, fields, trees, old homes and quiet neighbourhoods are what make people want to live and invest here. That is why responsible real estate matters.</p><p>The goal is simple: to make real estate in Goa feel clearer, safer and more personal, while respecting the land, the community and the future being built here.</p><strong>Amar Bernard<br/>Founder, AB Realty</strong></section></main> }

function RequirementsPage(){ return <main className="page"><section className="page-hero small"><p className="eyebrow">LIVE REQUIREMENTS</p><h1>AB Realty Requirements</h1><p>Active property requirements from AB Realty’s client network. If you have a matching property, contact Amar directly.</p></section><section className="section-pad requirements-grid">{requirements.map(r=><article className="req-card" key={r.title}><span>{r.badge}</span><h3>{r.title}</h3><p><b>{r.location}</b> · {r.budget}</p><p>{r.summary}</p><a className="cta dark" href="https://wa.me/919373136048?text=Hey%20Amar%2C%20I%20have%20a%20match%21" target="_blank" rel="noreferrer">I Have a Match <ArrowUpRight size={14}/></a></article>)}</section></main> }

function EnquirePage(){ return <main className="page enquire-page"><section className="enquire grid-2 section-pad"><div><p className="eyebrow">Start your property conversation.</p><h1>Your Goa Property Search Starts Here.</h1><p>Share your Requirement with AB Realty & we'll help you move forward with clarity, confidence & trusted insights.</p><form action={`mailto:abrealtygoa@gmail.com`} method="post" encType="text/plain"><input placeholder="First name *" required/><input placeholder="Last name *" required/><input placeholder="Phone Number *" required/><input placeholder="Subject *" required/><select required><option>When are you looking to start?*</option><option>Immediately</option><option>1-3 months</option><option>3-6 months</option></select><select required><option>What type of real estate are you interested in?*</option><option>Villa</option><option>Apartment</option><option>Land</option><option>Rental</option><option>Investment</option></select><textarea placeholder="Tell us what you are looking for"></textarea><button className="cta dark">Submit Enquiry</button></form></div><img className="quote-img" src="/assets/landing-hero.webp" alt="AB Realty landing page"/></section></main> }

function AdminPage({refresh}){
  const [logged,setLogged]=useState(sessionStorage.getItem('ab-admin')==='yes')
  const [password,setPassword]=useState('')
  const [properties,setProperties]=useState([])
  const blank={title:'',badge:'',location:'',price:'',summary:'',highlights:'',area:'',image:'/assets/landing-wide.webp',whatsapp:WA}
  const [form,setForm]=useState(blank)
  const adminPass=import.meta.env.VITE_ADMIN_PASSWORD || 'abrealty2026'
  useEffect(()=>{ if(logged) getProperties().then(setProperties)},[logged])
  const login=e=>{e.preventDefault(); if(password===adminPass){sessionStorage.setItem('ab-admin','yes');setLogged(true)} else alert('Wrong password')}
  const submit=async(e)=>{e.preventDefault(); await saveProperty(form); const ps=await getProperties(); setProperties(ps); setForm(blank); refresh()}
  const edit=p=>setForm(p)
  const remove=async(id)=>{if(confirm('Delete property?')){await deleteProperty(id); const ps=await getProperties(); setProperties(ps); refresh()}}
  const exportJson=()=>{const blob=new Blob([JSON.stringify(properties,null,2)],{type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='ab-realty-properties.json'; a.click()}
  if(!logged) return <main className="page admin"><form onSubmit={login} className="login"><Lock/><h1>AB Realty Admin</h1><p>Update properties simply. Default password is in the README.</p><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Admin password"/><button className="cta dark">Login</button></form></main>
  return <main className="page admin"><section className="section-pad"><div className="admin-head"><div><p className="eyebrow">ADMIN</p><h1>Property Manager</h1><p>{hasSupabase?'Connected to Supabase backend.':'Local mode active. Connect Supabase for live database updates on Vercel.'}</p></div><button className="cta dark" onClick={exportJson}><Download size={15}/> Export JSON</button></div><form className="admin-form" onSubmit={submit}>{Object.keys(blank).map(k=> k==='summary'||k==='highlights'?<textarea key={k} value={form[k]||''} onChange={e=>setForm({...form,[k]:e.target.value})} placeholder={k}/>:<input key={k} value={form[k]||''} onChange={e=>setForm({...form,[k]:e.target.value})} placeholder={k}/>)}<button className="cta gold"><Plus size={15}/> Save Property</button></form><div className="admin-list">{properties.map(p=><div key={p.id}><strong>{p.title}</strong><span>{p.location}</span><button onClick={()=>edit(p)}><Edit3 size={15}/></button><button onClick={()=>remove(p.id)}><Trash2 size={15}/></button></div>)}</div></section></main>
}

function Footer({nav}){ return <footer><div><h2>AB<br/>REALTY</h2><button onClick={()=>nav('/properties')}>PROPERTIES</button><button onClick={()=>nav('/about')}>ABOUT US</button><button onClick={()=>nav('/requirements')}>AB Realty Requirements</button></div><div><p>Contact</p><a href="tel:+919373136048">+91 9373136048</a><a href="mailto:abrealtygoa@gmail.com">abrealtygoa@gmail.com</a></div><div><p>SOCIALS</p><a href="https://www.facebook.com" target="_blank">Facebook</a><a href="https://www.instagram.com/ab_realty_in" target="_blank">Instagram</a><a href="https://www.linkedin.com" target="_blank">LinkedIn</a></div><div><p>INQUIRIES</p><a className="cta light" href="https://wa.me/919373136048" target="_blank">Speak to Amar <ArrowUpRight size={15}/></a></div><small>Privacy Policy</small><small>Accessibility Statement</small><small>AB Realty 2026 by Mavorra Creative</small></footer> }

function App(){
  const [path,nav]=useRoute(); const [properties,setProperties]=useState(initialProperties)
  const refresh=()=>getProperties().then(setProperties).catch(()=>setProperties(initialProperties))
  useEffect(()=>{refresh(); addEventListener('properties-updated',refresh); return()=>removeEventListener('properties-updated',refresh)},[])
  const page=useMemo(()=>{
    if(path.startsWith('/properties/')) return <PropertyDetail id={decodeURIComponent(path.split('/').pop())} properties={properties} nav={nav}/>
    if(path==='/properties') return <PropertiesPage nav={nav} properties={properties}/>
    if(path==='/about') return <AboutPage/>
    if(path==='/requirements') return <RequirementsPage/>
    if(path==='/enquire') return <EnquirePage/>
    if(path==='/admin') return <AdminPage refresh={refresh}/>
    return <HomePage nav={nav} properties={properties}/>
  },[path,properties])
  return <><Preloader/><Header nav={nav}/>{page}<Footer nav={nav}/></>
}

createRoot(document.getElementById('root')).render(<App />)
