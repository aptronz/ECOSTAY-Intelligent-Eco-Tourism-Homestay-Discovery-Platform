import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft, ArrowRight, BarChart3, CalendarDays, Check, ChevronDown, ChevronRight,
  CircleUserRound, Compass, Download, Heart, LayoutDashboard, Leaf, LogIn, MapPin, Menu,
  Minus, Moon, Palette, Plus, Route as RouteIcon, Search, Send, SlidersHorizontal,
  Sparkles, Star, Sun, TentTree, Users, X, Zap
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Link, NavLink, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import { createBooking, fetchCatalog } from "./api";
import useDarkMode from "./hooks/useDarkMode";
import Loader from "./components/ui/Loader";
import Toast from "./components/ui/Toast";
import ComponentShowcase from "./pages/ComponentShowcase";
import Login from "./pages/Login";

const fadeUp = { initial: { opacity: 0, y: 18 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: .55 } };
const emptyCatalog = { properties: [], destinations: [], experiences: [], status: "idle", error: "" };
const CatalogContext = createContext(emptyCatalog);
const useCatalog = () => useContext(CatalogContext);
const formatMoney = (value) => `₹${value.toLocaleString("en-IN")}`;

function Logo() {
  return <Link to="/" className="flex items-center gap-2 font-extrabold tracking-[-.04em] text-forest dark:text-white">
    <span className="grid h-9 w-9 place-items-center rounded-full bg-forest text-lime dark:bg-lime dark:text-forest"><Leaf size={18} fill="currentColor" /></span>
    <span className="text-xl">ECOSTAY</span>
  </Link>;
}

function Navbar() {
  const [open, setOpen] = useState(false);
  const { isDark, toggleTheme } = useDarkMode();
  const links = [
    ["Explore", "/explore"],
    ["Experiences", "/experiences"],
    ["AI Planner", "/assistant"],
    ["Itinerary", "/itinerary"],
    ["UI Kit", "/component-showcase"],
  ];
  return <header className="sticky top-0 z-50 border-b border-black/5 bg-[#f5f6ed]/90 backdrop-blur-xl dark:border-white/10 dark:bg-[#0f1d18]/90">
    <div className="container-page flex h-[74px] items-center justify-between">
      <Logo />
      <nav className="hidden items-center gap-5 xl:flex">
        {links.map(([label, href]) => <NavLink key={href} to={href} className={({isActive}) => `text-sm font-semibold transition hover:text-leaf ${isActive ? "text-leaf" : "text-ink dark:text-white"}`}>{label}</NavLink>)}
      </nav>
      <div className="flex items-center gap-2">
        <button onClick={toggleTheme} aria-label={`Switch to ${isDark ? "light" : "dark"} mode`} className="grid h-10 w-10 place-items-center rounded-full border border-black/10 dark:border-white/15">
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <Link to="/login" aria-label="Sign in" className="hidden h-10 w-10 place-items-center rounded-full border border-black/10 text-forest dark:border-white/15 dark:text-white sm:grid">
          <LogIn size={18} />
        </Link>
        <Link to="/dashboard" className="hidden items-center gap-2 rounded-full bg-forest px-4 py-2.5 text-sm font-bold text-white md:flex dark:bg-lime dark:text-forest">
          <CircleUserRound size={18} /> My trips
        </Link>
        <button onClick={() => setOpen(!open)} aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} className="grid h-10 w-10 place-items-center xl:hidden">{open ? <X /> : <Menu />}</button>
      </div>
    </div>
    <AnimatePresence>{open && <motion.nav initial={{height:0}} animate={{height:"auto"}} exit={{height:0}} className="overflow-hidden border-t border-black/5 bg-white dark:bg-[#172721] xl:hidden">
      <div className="container-page grid py-3 sm:grid-cols-2">{links.map(([label, href]) => <Link onClick={() => setOpen(false)} className="py-3 font-semibold" key={href} to={href}>{label}</Link>)}<Link onClick={() => setOpen(false)} to="/dashboard" className="py-3 font-semibold">Dashboard</Link><Link onClick={() => setOpen(false)} to="/login" className="py-3 font-semibold">Login</Link></div>
    </motion.nav>}</AnimatePresence>
  </header>;
}

function SectionHead({ eyebrow, title, link, href = "/explore" }) {
  return <div className="mb-7 flex items-end justify-between gap-4">
    <div><p className="mb-2 text-xs font-extrabold uppercase tracking-[.2em] text-leaf">{eyebrow}</p><h2 className="font-display text-3xl leading-tight text-forest dark:text-white md:text-[42px]">{title}</h2></div>
    {link && <Link to={href} className="hidden items-center gap-1 whitespace-nowrap text-sm font-bold text-forest dark:text-lime sm:flex">{link}<ArrowRight size={17}/></Link>}
  </div>;
}

function EcoBadge({ score }) {
  return <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e8f5d0] px-2.5 py-1 text-xs font-extrabold text-[#276125]"><Leaf size={12} fill="currentColor"/>{score} Eco</span>;
}

function Rating({ rating, reviews }) {
  return <span className="inline-flex items-center gap-1 text-sm font-bold"><Star size={14} fill="#f2b84b" color="#f2b84b"/>{rating}{reviews && <span className="font-medium text-slate-500">({reviews})</span>}</span>;
}

function CatalogStatus({ status, error, onRetry }) {
  if (status === "loading") {
    return <div className="fixed bottom-5 left-1/2 z-[100] flex -translate-x-1/2 items-center gap-3 rounded-full bg-forest px-4 py-3 text-sm font-bold text-white shadow-xl dark:bg-lime dark:text-forest"><Loader size="sm"/>Loading ECOSTAY catalog</div>;
  }

  if (status === "error") {
    return <div role="alert" className="container-page mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-100"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><span>{error}</span><button onClick={onRetry} className="self-start rounded-full bg-red-900 px-4 py-2 text-xs font-extrabold text-white dark:bg-red-100 dark:text-red-950">Retry</button></div></div>;
  }

  return null;
}

function PropertyCard({ property, horizontal = false }) {
  const [liked, setLiked] = useState(false);
  return <motion.article {...fadeUp} className={`paper card-lift overflow-hidden rounded-[20px] bg-white ${horizontal ? "grid sm:grid-cols-[42%_58%]" : ""}`}>
    <div className={`relative overflow-hidden ${horizontal ? "min-h-56" : "aspect-[4/3]"}`}>
      <Link to={`/property/${property.id}`}><img src={property.image} alt={property.name} className="h-full w-full object-cover transition duration-700 hover:scale-105"/></Link>
      <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1.5 text-xs font-extrabold text-forest backdrop-blur">{property.tag}</span>
      <button onClick={() => setLiked(!liked)} aria-label="Save property" className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-forest">
        <Heart size={18} fill={liked ? "#2e7d32" : "transparent"}/>
      </button>
    </div>
    <div className="p-4">
      <div className="mb-2 flex items-center justify-between gap-2"><EcoBadge score={property.score}/><Rating rating={property.rating}/></div>
      <Link to={`/property/${property.id}`}><h3 className="text-lg font-extrabold tracking-tight">{property.name}</h3></Link>
      <p className="mt-1 flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400"><MapPin size={14}/>{property.location}</p>
      {horizontal && <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">{property.description}</p>}
      <div className="mt-4 flex items-end justify-between"><p><b className="text-lg">{formatMoney(property.price)}</b><span className="text-sm text-slate-500"> / night</span></p><ChevronRight size={19} className="text-leaf"/></div>
    </div>
  </motion.article>;
}

function ExperienceCard({ item }) {
  return <motion.article {...fadeUp} className="paper card-lift overflow-hidden rounded-[20px] bg-white">
    <div className="relative aspect-[4/3] overflow-hidden"><img src={item.image} alt={item.title} className="h-full w-full object-cover transition duration-700 hover:scale-105"/><span className="absolute left-3 top-3 rounded-full bg-forest/90 px-3 py-1.5 text-xs font-bold text-white">{item.type}</span></div>
    <div className="p-4"><div className="mb-2 flex items-center justify-between text-xs font-bold text-slate-500"><span className="flex items-center gap-1"><MapPin size={13}/>{item.place}</span><Rating rating={item.rating}/></div><h3 className="text-lg font-extrabold">{item.title}</h3><p className="mt-3 text-sm"><b>{formatMoney(item.price)}</b> / person</p></div>
  </motion.article>;
}

function SearchBar({ compact = false }) {
  const navigate = useNavigate();
  const [guests, setGuests] = useState(2);
  const fields = [
    {icon:<MapPin/>, label:"Where", content:<input aria-label="Destination" placeholder="Try Tirthan Valley" className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-slate-400"/>},
    {icon:<CalendarDays/>, label:"Check in", content:<input aria-label="Check in" type="date" className="w-full bg-transparent text-sm font-semibold outline-none"/>},
    {icon:<CalendarDays/>, label:"Check out", content:<input aria-label="Check out" type="date" className="w-full bg-transparent text-sm font-semibold outline-none"/>},
    {icon:<Users/>, label:"Guests", content:<div className="flex items-center gap-2 text-sm font-bold"><button onClick={()=>setGuests(Math.max(1,guests-1))}><Minus size={14}/></button>{guests}<button onClick={()=>setGuests(guests+1)}><Plus size={14}/></button></div>},
  ];
  return <div className={`glass soft-shadow grid rounded-[22px] p-2 ${compact ? "md:grid-cols-[1.2fr_1fr_1fr_.8fr_auto]" : "md:grid-cols-[1.3fr_1fr_1fr_.8fr_auto]"}`}>
    {fields.map((field, i)=><div key={field.label} className={`flex items-center gap-3 px-4 py-3 ${i ? "md:border-l md:border-black/10" : ""}`}><span className="text-leaf [&>svg]:h-[18px] [&>svg]:w-[18px]">{field.icon}</span><div className="min-w-0 flex-1"><p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">{field.label}</p>{field.content}</div></div>)}
    <button onClick={()=>navigate("/explore")} className="flex items-center justify-center gap-2 rounded-2xl bg-lime px-5 py-4 font-extrabold text-forest transition hover:bg-[#cfea42] active:scale-95"><Search size={18}/> <span className="md:hidden lg:inline">Find stays</span></button>
  </div>;
}

function Home() {
  const { destinations, properties } = useCatalog();
  return <main>
    <section className="relative min-h-[690px] overflow-hidden">
      <img src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2000&q=88" className="absolute inset-0 h-full w-full object-cover" alt="A quiet cabin in a green mountain landscape"/>
      <div className="hero-gradient absolute inset-0"/>
      <div className="container-page relative flex min-h-[690px] flex-col justify-center pb-32 pt-20 text-white">
        <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:.7}} className="max-w-3xl">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[.18em] backdrop-blur"><Sparkles size={14} className="text-lime"/> AI-powered conscious travel</span>
          <h1 className="font-display text-5xl leading-[.96] md:text-7xl lg:text-[88px]">Travel lightly.<br/><i className="font-normal text-lime">Stay deeply.</i></h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-white/80 md:text-lg">Handpicked homestays and local experiences that are kinder to the planet, richer for communities, and unforgettable for you.</p>
        </motion.div>
      </div>
      <div className="container-page absolute inset-x-0 bottom-7"><SearchBar/></div>
    </section>

    <section className="container-page py-20"><SectionHead eyebrow="Worth the journey" title="Places that give back" link="See all destinations"/>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{destinations.map((d,i)=><motion.div {...fadeUp} transition={{delay:i*.07}} key={d.name} className="group relative aspect-[.78] overflow-hidden rounded-[22px]"><img src={d.image} alt={d.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105"/><div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent"/><div className="absolute bottom-0 p-4 text-white md:p-5"><h3 className="font-display text-2xl">{d.name}</h3><p className="mt-1 text-xs text-white/75">{d.meta}</p></div></motion.div>)}</div>
    </section>

    <section className="bg-white/65 py-20 dark:bg-white/5"><div className="container-page"><SectionHead eyebrow="Community favourites" title="Stays people love" link="Explore all stays"/>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{properties.slice(0,3).map(p=><PropertyCard key={p.id} property={p}/>)}</div>
    </div></section>

    <section className="container-page grid gap-8 py-20 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
      <motion.div {...fadeUp} className="relative min-h-[520px] overflow-hidden rounded-[28px]"><img src="https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1000&q=88" alt="Forest path" className="absolute h-full w-full object-cover"/><div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/92 p-4 backdrop-blur"><div className="flex items-center gap-4"><span className="grid h-12 w-12 place-items-center rounded-full bg-lime text-forest"><Leaf/></span><div><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Your estimated impact</p><p className="font-extrabold text-forest">18.4 kg CO₂ saved on this trip</p></div></div></div></motion.div>
      <div className="lg:pl-10"><p className="mb-3 text-xs font-extrabold uppercase tracking-[.2em] text-leaf">A better way to wander</p><h2 className="font-display text-4xl leading-tight text-forest dark:text-white md:text-5xl">Good for the earth.<br/>Great for the soul.</h2><p className="mt-5 max-w-lg leading-7 text-slate-600 dark:text-slate-300">Every ECOSTAY is scored for environmental care, community benefit, and authentic hosting, so choosing well feels effortless.</p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">{[
          [Leaf,"Verified sustainability","Clear scores based on energy, waste, water, and sourcing."],
          [Users,"Local-first impact","Your stay directly supports hosts, makers, and guides."],
          [Sparkles,"Made for you","AI recommendations tuned to your pace, budget, and values."],
          [Compass,"Beyond the obvious","Quiet places and meaningful experiences, thoughtfully curated."]
        ].map(([Icon,title,text])=><div key={title} className="flex gap-3"><Icon className="mt-1 shrink-0 text-leaf" size={21}/><div><h3 className="font-extrabold">{title}</h3><p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">{text}</p></div></div>)}</div>
      </div>
    </section>

    <section className="container-page pb-20"><div className="overflow-hidden rounded-[28px] bg-forest px-6 py-12 text-white md:px-14 md:py-16"><div className="grid items-center gap-8 md:grid-cols-[1fr_auto]"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-lime">Your next trip, intelligently planned</p><h2 className="mt-3 font-display text-4xl md:text-5xl">Tell us what moves you.</h2><p className="mt-4 max-w-xl text-white/65">Our AI trip companion turns a simple idea into conscious stays, local experiences, and a day-by-day plan.</p></div><Link to="/assistant" className="inline-flex items-center justify-center gap-2 rounded-full bg-lime px-6 py-3.5 font-extrabold text-forest">Plan with AI <ArrowRight size={18}/></Link></div></div></section>
  </main>;
}

function FilterPanel({ open, close, score, setScore }) {
  const content = <div className="space-y-7">
    <div className="flex items-center justify-between"><h2 className="text-lg font-extrabold">Filters</h2>{close && <button onClick={close}><X/></button>}</div>
    <div><p className="mb-3 text-sm font-extrabold">Nightly price</p><div className="grid grid-cols-2 gap-2"><div className="rounded-xl border p-3 text-sm text-slate-500">Min <b className="block text-ink dark:text-white">₹1,000</b></div><div className="rounded-xl border p-3 text-sm text-slate-500">Max <b className="block text-ink dark:text-white">₹8,000</b></div></div></div>
    <div><div className="mb-2 flex justify-between text-sm font-extrabold"><span>Eco score</span><span className="text-leaf">{score}+</span></div><input className="range-accent w-full" type="range" min="70" max="98" value={score} onChange={e=>setScore(Number(e.target.value))}/><div className="flex justify-between text-xs text-slate-400"><span>70</span><span>98</span></div></div>
    <div><p className="mb-3 text-sm font-extrabold">Amenities</p>{["Farm-to-table meals","Solar powered","Pet friendly","Mountain view"].map((a,i)=><label key={a} className="mb-3 flex items-center gap-3 text-sm"><input type="checkbox" defaultChecked={i<2} className="h-4 w-4 accent-[#2e7d32]"/>{a}</label>)}</div>
    <div><p className="mb-3 text-sm font-extrabold">Rating</p><div className="flex gap-2">{["Any","4.5+","4.8+"].map((r,i)=><button key={r} className={`rounded-full border px-3 py-2 text-xs font-bold ${i===1?"border-forest bg-forest text-white":""}`}>{r}</button>)}</div></div>
    <button className="w-full rounded-xl bg-forest py-3 font-bold text-white dark:bg-lime dark:text-forest">Show stays</button>
  </div>;
  return <><aside className="paper hidden rounded-[20px] bg-white p-5 lg:block">{content}</aside><AnimatePresence>{open&&<motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[60] bg-black/40 lg:hidden"><motion.aside initial={{x:"100%"}} animate={{x:0}} exit={{x:"100%"}} className="paper absolute right-0 h-full w-[88%] max-w-sm overflow-auto bg-white p-6">{content}</motion.aside></motion.div>}</AnimatePresence></>;
}

function Explore() {
  const { properties } = useCatalog();
  const [filters, setFilters] = useState(false);
  const [score, setScore] = useState(80);
  const shown = properties.filter(p=>p.score>=score);
  return <main className="container-page py-10">
    <div className="mb-8"><p className="text-xs font-extrabold uppercase tracking-[.2em] text-leaf">Find your breathing room</p><h1 className="mt-2 font-display text-4xl text-forest dark:text-white md:text-6xl">Explore conscious stays</h1></div>
    <SearchBar compact/>
    <div className="my-7 flex items-center justify-between"><p className="text-sm text-slate-500"><b className="text-ink dark:text-white">{shown.length} stays</b> matched to your values</p><div className="flex gap-2"><button onClick={()=>setFilters(true)} className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold lg:hidden"><SlidersHorizontal size={16}/>Filters</button><button className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold">Recommended <ChevronDown size={15}/></button></div></div>
    <div className="grid gap-6 lg:grid-cols-[250px_1fr]"><FilterPanel open={filters} close={()=>setFilters(false)} score={score} setScore={setScore}/><div className="grid gap-5 sm:grid-cols-2">{shown.map(p=><PropertyCard key={p.id} property={p}/>)}</div></div>
  </main>;
}

function PropertyDetails() {
  const { properties, status } = useCatalog();
  const { id } = useParams();
  const property = properties.find(p=>p.id===id);
  const [guests,setGuests] = useState(2);
  const [checkIn,setCheckIn] = useState("");
  const [checkOut,setCheckOut] = useState("");
  const [bookingState,setBookingState] = useState({ status: "idle", message: "" });

  const reserve = async () => {
    setBookingState({ status: "loading", message: "" });

    try {
      await createBooking({
        stayId: property.id,
        guestName: "Aditya",
        guestEmail: "aditya@example.com",
        checkIn,
        checkOut,
        guests,
      });
      setBookingState({ status: "success", message: "Stay reserved successfully." });
    } catch (error) {
      setBookingState({ status: "error", message: error.message });
    }
  };

  if (!property) {
    return <main className="container-page py-16"><Link to="/explore" className="mb-5 inline-flex items-center gap-2 text-sm font-bold"><ArrowLeft size={17}/>Back to explore</Link><div className="paper rounded-[22px] bg-white p-8 text-center"><h1 className="font-display text-4xl text-forest dark:text-white">{status === "loading" ? "Loading stay..." : "Stay not found"}</h1><p className="mt-3 text-sm text-slate-500">{status === "loading" ? "Fetching the latest property details from the API." : "This property is not available in the current catalog."}</p></div></main>;
  }

  return <main className="container-page py-8">
    <Link to="/explore" className="mb-5 inline-flex items-center gap-2 text-sm font-bold"><ArrowLeft size={17}/>Back to explore</Link>
    <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-end"><div><h1 className="font-display text-4xl text-forest dark:text-white md:text-5xl">{property.name}</h1><p className="mt-2 flex flex-wrap items-center gap-3 text-sm"><Rating rating={property.rating} reviews={property.reviews}/><span className="flex items-center gap-1 text-slate-500"><MapPin size={15}/>{property.location}</span></p></div><button className="flex items-center gap-2 self-start rounded-full border px-4 py-2 text-sm font-bold"><Heart size={17}/>Save</button></div>
    <div className="grid h-[420px] grid-cols-1 gap-2 overflow-hidden rounded-[24px] md:grid-cols-4 md:grid-rows-2"><img src={property.image} className="h-full w-full object-cover md:col-span-2 md:row-span-2" alt={property.name}/><img src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=85" className="hidden h-full w-full object-cover md:block" alt="Interior"/><img src="https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=800&q=85" className="hidden h-full w-full object-cover md:block" alt="Homestay exterior"/><img src="https://images.unsplash.com/photo-1560185008-b033106af5c3?auto=format&fit=crop&w=800&q=85" className="hidden h-full w-full object-cover md:col-span-2 md:block" alt="Warm guest room"/></div>
    <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
      <div>
        <div className="flex items-center justify-between border-b pb-6"><div><h2 className="text-xl font-extrabold">Hosted by Meera & Arun</h2><p className="mt-1 text-sm text-slate-500">6 guests · 3 bedrooms · 4 beds · 2 baths</p></div><div className="grid h-14 w-14 place-items-center rounded-full bg-[#dce9cf] text-xl">MA</div></div>
        <p className="border-b py-6 leading-7 text-slate-600 dark:text-slate-300">{property.description} Everything here is designed for slow mornings and meaningful connection, from locally made furniture to seasonal meals shared around one table.</p>
        <div className="border-b py-7"><h2 className="text-xl font-extrabold">What this place offers</h2><div className="mt-5 grid grid-cols-2 gap-4 text-sm">{["Solar power","Organic breakfast","Fast Wi-Fi","Guided nature walks","Free parking","Rainwater harvesting"].map(a=><span key={a} className="flex items-center gap-2"><Check size={17} className="text-leaf"/>{a}</span>)}</div></div>
        <div className="py-7"><h2 className="text-xl font-extrabold">Sustainability, made visible</h2><div className="mt-5 grid gap-3 sm:grid-cols-3">{[["94","Eco score"],["82%","Local sourcing"],["100%","Renewable energy"]].map(([n,l])=><div key={l} className="paper rounded-2xl bg-white p-5"><p className="font-display text-4xl text-leaf">{n}</p><p className="mt-1 text-xs font-bold text-slate-500">{l}</p></div>)}</div></div>
        <div className="paper rounded-[22px] bg-white p-6"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-lime text-forest"><Sparkles size={18}/></span><div><h3 className="font-extrabold">Guests leave feeling restored</h3><p className="text-xs text-slate-500">AI sentiment summary from 128 verified reviews</p></div></div><p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">Visitors consistently praise the thoughtful hosts, peaceful orchard setting, and exceptional home-cooked food. The road in is narrow, but guests say the view is more than worth it.</p></div>
      </div>
      <aside className="paper soft-shadow sticky top-24 h-fit rounded-[22px] bg-white p-5"><p><b className="text-2xl">{formatMoney(property.price)}</b> / night</p><div className="mt-5 grid grid-cols-2 overflow-hidden rounded-xl border"><label className="p-3 text-[10px] font-bold uppercase">Check in<input type="date" value={checkIn} onChange={e=>setCheckIn(e.target.value)} className="mt-1 block w-full text-xs font-medium"/></label><label className="border-l p-3 text-[10px] font-bold uppercase">Check out<input type="date" value={checkOut} onChange={e=>setCheckOut(e.target.value)} className="mt-1 block w-full text-xs font-medium"/></label><div className="col-span-2 flex items-center justify-between border-t p-3 text-xs font-bold"><span>Guests</span><span className="flex items-center gap-3"><button onClick={()=>setGuests(Math.max(1,guests-1))}><Minus size={14}/></button>{guests}<button onClick={()=>setGuests(guests+1)}><Plus size={14}/></button></span></div></div><button onClick={reserve} disabled={bookingState.status==="loading"} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-lime py-3.5 font-extrabold text-forest disabled:opacity-70">{bookingState.status==="loading"&&<Loader size="sm"/>}{bookingState.status==="loading"?"Reserving...":"Reserve your stay"}</button>{bookingState.message&&<p className={`mt-3 text-center text-xs font-bold ${bookingState.status==="error"?"text-red-600":"text-leaf"}`}>{bookingState.message}</p>}<p className="mt-3 text-center text-xs text-slate-400">You won’t be charged yet</p><div className="mt-5 space-y-3 border-t pt-5 text-sm"><p className="flex justify-between"><span>₹4,200 × 3 nights</span><span>₹12,600</span></p><p className="flex justify-between"><span>Community contribution</span><span>₹630</span></p><p className="flex justify-between border-t pt-3 font-extrabold"><span>Total</span><span>₹13,230</span></p></div></aside>
    </div>
    <section className="py-16"><SectionHead eyebrow="Stay a little longer" title="Similar places nearby"/><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{properties.filter(p=>p.id!==property.id).slice(0,3).map(p=><PropertyCard key={p.id} property={p}/>)}</div></section>
  </main>;
}

function Assistant() {
  const [messages,setMessages] = useState([{role:"ai",text:"Hi, I’m Aira. Tell me the kind of trip you need, and I’ll make it lighter on the planet and easier on you."}]);
  const [input,setInput] = useState("");
  const send = (text=input) => { if(!text.trim()) return; setMessages(m=>[...m,{role:"user",text},{role:"ai",text:"I’d build this around Tirthan Valley: a community-run riverside stay, a guided forest walk, and local meals. For 3 days, your estimated total is ₹8,750 with an eco score of 92. Want the day-by-day plan?"}]); setInput(""); };
  const suggestions=["3 days in Uttarakhand under ₹10,000","A quiet workation near Bengaluru","Wildlife trip with low-impact stays"];
  return <main className="container-page py-8"><div className="grid min-h-[720px] overflow-hidden rounded-[26px] border border-black/5 bg-white dark:border-white/10 dark:bg-[#172721] lg:grid-cols-[280px_1fr]">
    <aside className="hidden bg-forest p-6 text-white lg:block"><div className="flex items-center gap-2 font-extrabold"><Sparkles className="text-lime"/>Aira, your travel AI</div><button onClick={()=>setMessages(messages.slice(0,1))} className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 py-3 text-sm font-bold"><Plus size={16}/>New journey</button><p className="mt-8 text-[10px] font-bold uppercase tracking-widest text-white/45">Recent plans</p>{["Monsoon in Coorg","Slow trip to Sikkim","Jaipur with parents"].map(x=><button key={x} className="mt-2 block w-full rounded-lg px-3 py-2 text-left text-sm text-white/75 hover:bg-white/10">{x}</button>)}<div className="mt-10 rounded-2xl bg-white/10 p-4"><Leaf className="text-lime"/><p className="mt-3 text-sm font-bold">Your choices matter</p><p className="mt-1 text-xs leading-5 text-white/55">Aira prioritises locally owned stays and low-carbon routes.</p></div></aside>
    <section className="flex min-w-0 flex-col"><header className="flex items-center justify-between border-b p-5"><div><h1 className="font-display text-2xl text-forest dark:text-white">Where should we wander?</h1><p className="text-xs text-slate-500">Ask naturally. I’ll handle the details.</p></div><span className="flex items-center gap-1.5 rounded-full bg-[#edf7de] px-3 py-1.5 text-xs font-bold text-leaf"><span className="h-2 w-2 rounded-full bg-leaf"/>Online</span></header>
      <div className="flex-1 space-y-5 overflow-auto p-5 md:p-8">{messages.map((m,i)=><motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} key={i} className={`flex ${m.role==="user"?"justify-end":"justify-start"}`}><div className={`max-w-[85%] rounded-[18px] px-4 py-3 text-sm leading-6 md:max-w-[70%] ${m.role==="user"?"bg-forest text-white dark:bg-lime dark:text-forest":"bg-[#f1f3eb] dark:bg-white/10"}`}>{m.text}{m.role==="ai"&&i>0&&<div className="mt-4 flex flex-wrap gap-2 border-t border-black/10 pt-3"><Link to="/itinerary" className="rounded-full bg-lime px-3 py-1.5 text-xs font-bold text-forest">Build itinerary</Link><Link to="/explore" className="rounded-full border border-black/10 px-3 py-1.5 text-xs font-bold">View stays</Link></div>}</div></motion.div>)}</div>
      {messages.length===1&&<div className="px-5 pb-3 md:px-8"><p className="mb-2 text-xs font-bold text-slate-400">TRY ASKING</p><div className="flex gap-2 overflow-x-auto hide-scrollbar">{suggestions.map(s=><button onClick={()=>send(s)} key={s} className="whitespace-nowrap rounded-full border px-3 py-2 text-xs font-semibold hover:border-leaf">{s}</button>)}</div></div>}
      <div className="border-t p-4 md:p-6"><div className="flex items-end gap-2 rounded-2xl border bg-[#fafbf7] p-2 dark:bg-white/5"><textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}} placeholder="Describe your dream trip..." className="max-h-28 min-h-11 flex-1 resize-none bg-transparent p-2 text-sm outline-none"/><button onClick={()=>send()} className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-forest text-white dark:bg-lime dark:text-forest"><Send size={18}/></button></div></div>
    </section>
  </div></main>;
}

function Experiences() {
  const { experiences } = useCatalog();
  const [active,setActive]=useState("All");
  const cats=["All","Adventure","Culture","Local food","Nature trail","Community"];
  const filtered=active==="All"?experiences:experiences.filter(e=>e.type.toLowerCase().includes(active.toLowerCase().split(" ")[0]));
  return <main className="container-page py-10"><div className="max-w-2xl"><p className="text-xs font-extrabold uppercase tracking-[.2em] text-leaf">Made by local hands</p><h1 className="mt-2 font-display text-5xl leading-tight text-forest dark:text-white md:text-6xl">Do more than visit.</h1><p className="mt-4 leading-7 text-slate-500">Meet the people who know these places by heart, and bring home more than photographs.</p></div><div className="my-8 flex gap-2 overflow-auto hide-scrollbar">{cats.map(c=><button onClick={()=>setActive(c)} key={c} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold ${active===c?"bg-forest text-white dark:bg-lime dark:text-forest":"border"}`}>{c}</button>)}</div><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{filtered.map(e=><ExperienceCard key={e.title} item={e}/>)}</div></main>;
}

function Itinerary() {
  const [generated,setGenerated]=useState(false);
  const days=[
    {day:"Day 1",title:"Arrive & settle into the valley",items:["Scenic bus from Aut to Gushaini","Check in at Wildflower Retreat","Riverside walk and Himachali dinner"],cost:"₹3,150"},
    {day:"Day 2",title:"Forest paths & village stories",items:["Breakfast with your host","Guided Great Himalayan forest trail","Traditional weaving workshop"],cost:"₹2,100"},
    {day:"Day 3",title:"Slow morning, local flavours",items:["Farm visit and trout lunch","Explore Chehni Kothi village","Return journey via Aut"],cost:"₹2,850"}
  ];
  return <main className="container-page py-10"><div className="mb-8 text-center"><span className="inline-flex items-center gap-2 rounded-full bg-[#e9f4d4] px-3 py-1.5 text-xs font-bold text-leaf"><Sparkles size={14}/>AI itinerary generator</span><h1 className="mt-4 font-display text-4xl text-forest dark:text-white md:text-6xl">A thoughtful trip, in seconds.</h1><p className="mx-auto mt-3 max-w-xl text-slate-500">Share the basics. We’ll balance your interests, budget, travel time, and impact.</p></div>
    {!generated?<motion.div initial={{opacity:0,y:15}} animate={{opacity:1,y:0}} className="paper mx-auto max-w-3xl rounded-[26px] bg-white p-6 soft-shadow md:p-8"><div className="grid gap-5 md:grid-cols-2">{[["Destination","Tirthan Valley, Himachal","map"],["Budget","₹10,000 per person","wallet"],["Travel dates","18 Jun — 20 Jun","date"],["Travellers","2 adults","users"]].map(([l,p])=><label key={l} className="text-sm font-bold">{l}<div className="mt-2 flex items-center gap-3 rounded-xl border p-3 text-slate-400"><MapPin size={17}/><input defaultValue={p} className="w-full bg-transparent text-sm text-ink outline-none dark:text-white"/></div></label>)}</div><div className="mt-6"><p className="text-sm font-bold">What do you enjoy?</p><div className="mt-3 flex flex-wrap gap-2">{["Nature & wildlife","Local food","Easy hikes","Culture","Photography","Wellness"].map((x,i)=><button key={x} className={`rounded-full px-4 py-2 text-sm font-semibold ${i<3?"bg-[#e7f2d7] text-leaf":"border"}`}>{x}</button>)}</div></div><button onClick={()=>setGenerated(true)} className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-lime py-4 font-extrabold text-forest"><Sparkles size={18}/>Create my itinerary</button></motion.div>:
    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="grid gap-7 lg:grid-cols-[1fr_300px]"><section><div className="mb-6 flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm font-bold text-leaf">YOUR 3-DAY PLAN</p><h2 className="font-display text-3xl text-forest dark:text-white">Tirthan, at nature’s pace</h2></div><button className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold"><Download size={16}/>Download</button></div><div className="space-y-5">{days.map((d,i)=><div key={d.day} className="paper relative rounded-[20px] bg-white p-5 pl-20"><span className="absolute left-5 top-5 grid h-10 w-10 place-items-center rounded-full bg-forest text-sm font-bold text-white dark:bg-lime dark:text-forest">{i+1}</span><p className="text-xs font-extrabold uppercase tracking-wider text-leaf">{d.day}</p><h3 className="mt-1 text-lg font-extrabold">{d.title}</h3><div className="mt-4 space-y-3">{d.items.map((x,j)=><p key={x} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300"><span className="h-1.5 w-1.5 rounded-full bg-leaf"/>{j===0?"08:30":j===1?"12:00":"18:30"} · {x}</p>)}</div><p className="mt-4 text-right text-sm font-bold">{d.cost}</p></div>)}</div></section><aside className="paper h-fit rounded-[20px] bg-white p-5"><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Trip snapshot</p><p className="mt-3 font-display text-4xl text-forest dark:text-white">₹8,100</p><p className="text-xs text-slate-500">estimated per person</p><div className="mt-5 space-y-4 border-t pt-5 text-sm"><p className="flex justify-between"><span>Eco score</span><EcoBadge score={92}/></p><p className="flex justify-between"><span>Travel time</span><b>11h 20m</b></p><p className="flex justify-between"><span>Local spend</span><b>78%</b></p><p className="flex justify-between"><span>CO₂ saved</span><b className="text-leaf">14.2 kg</b></p></div><button onClick={()=>setGenerated(false)} className="mt-6 w-full rounded-xl border py-3 text-sm font-bold">Edit trip</button></aside></motion.div>}
  </main>;
}

const chartData=[{m:"Jan",v:12},{m:"Feb",v:18},{m:"Mar",v:16},{m:"Apr",v:27},{m:"May",v:32},{m:"Jun",v:44}];
function Dashboard() {
  const { properties } = useCatalog();
  return <main className="container-page py-10"><div className="mb-8 flex flex-wrap items-end justify-between gap-3"><div><p className="text-sm text-slate-500">Welcome back, Aditya</p><h1 className="font-display text-4xl text-forest dark:text-white md:text-5xl">Your greener journeys</h1></div><Link to="/itinerary" className="rounded-full bg-lime px-5 py-3 text-sm font-extrabold text-forest">Plan a new trip</Link></div>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[[TentTree,"4","Stays discovered"],[Leaf,"38 kg","CO₂ avoided"],[Users,"₹12.8k","Spent locally"],[Zap,"Silver","Impact level"]].map(([Icon,n,l])=><div className="paper rounded-[20px] bg-white p-5" key={l}><Icon className="text-leaf" size={20}/><p className="mt-5 font-display text-3xl text-forest dark:text-white">{n}</p><p className="text-xs font-bold text-slate-500">{l}</p></div>)}</div>
    <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_.7fr]"><section className="paper rounded-[22px] bg-white p-5"><div className="flex items-center justify-between"><div><h2 className="font-extrabold">Your impact is growing</h2><p className="text-xs text-slate-500">Carbon avoided across your ECOSTAY trips</p></div><BarChart3 className="text-leaf"/></div><div className="mt-4 h-64"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData}><defs><linearGradient id="colorV" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#4CAF50" stopOpacity={.35}/><stop offset="95%" stopColor="#4CAF50" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" vertical={false} opacity={.2}/><XAxis dataKey="m" axisLine={false} tickLine={false}/><YAxis hide/><Tooltip/><Area type="monotone" dataKey="v" stroke="#2E7D32" strokeWidth={3} fill="url(#colorV)"/></AreaChart></ResponsiveContainer></div></section><section className="overflow-hidden rounded-[22px] bg-forest p-6 text-white"><p className="text-xs font-bold uppercase tracking-wider text-lime">Next adventure</p><h2 className="mt-3 font-display text-3xl">Monsoon in Coorg</h2><p className="mt-1 text-sm text-white/60">24–27 July · 2 travellers</p><div className="mt-8 space-y-3 text-sm"><p className="flex items-center gap-2"><Check size={16} className="text-lime"/>Stay reserved</p><p className="flex items-center gap-2"><Check size={16} className="text-lime"/>Experience booked</p><p className="flex items-center gap-2 text-white/50"><span className="h-4 w-4 rounded-full border border-white/40"/>Transport pending</p></div><button className="mt-8 w-full rounded-xl bg-white py-3 text-sm font-extrabold text-forest">View trip</button></section></div>
    <section className="mt-12"><SectionHead eyebrow="Picked for you" title="Your next favourite stay" link="See all"/><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{properties.slice(2,5).map(p=><PropertyCard key={p.id} property={p}/>)}</div></section>
  </main>;
}

function ResponsiveDashboard() {
  const { properties } = useCatalog();
  const dashboardLinks = [
    [LayoutDashboard, "Overview"],
    [RouteIcon, "Trips"],
    [Heart, "Saved stays"],
    [Palette, "Preferences"],
  ];

  return <main className="container-page py-8 md:py-10">
    <div className="grid min-w-0 gap-6 xl:grid-cols-[210px_minmax(0,1fr)]">
      <aside className="paper hidden h-fit rounded-lg border border-black/5 bg-white p-4 dark:border-white/10 xl:block">
        <p className="px-3 pb-3 text-xs font-extrabold uppercase tracking-[.18em] text-slate-400">Your account</p>
        <nav aria-label="Dashboard navigation" className="space-y-1">
          {dashboardLinks.map(([Icon, label], index) => <button key={label} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-bold transition ${index === 0 ? "bg-[#e9f4d4] text-leaf dark:bg-lime dark:text-forest" : "hover:bg-black/5 dark:hover:bg-white/10"}`}><Icon size={17}/>{label}</button>)}
        </nav>
      </aside>

      <div className="min-w-0">
        <div className="mb-5 flex gap-2 overflow-x-auto pb-1 hide-scrollbar xl:hidden">
          {dashboardLinks.map(([Icon, label], index) => <button key={label} className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${index === 0 ? "bg-forest text-white dark:bg-lime dark:text-forest" : "border border-black/10 dark:border-white/15"}`}><Icon size={16}/>{label}</button>)}
        </div>

        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div><p className="text-sm text-slate-500">Welcome back, Aditya</p><h1 className="font-display text-4xl text-forest dark:text-white md:text-5xl">Your greener journeys</h1></div>
          <Link to="/itinerary" className="inline-flex min-h-11 items-center justify-center rounded-lg bg-lime px-5 py-3 text-sm font-extrabold text-forest">Plan a new trip</Link>
        </div>

        <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">{[[TentTree,"4","Stays discovered"],[Leaf,"38 kg","CO2 avoided"],[Users,"INR 12.8k","Spent locally"],[Zap,"Silver","Impact level"]].map(([Icon,n,l])=><div className="paper min-w-0 rounded-lg bg-white p-4 md:p-5" key={l}><Icon className="text-leaf" size={20}/><p className="mt-5 break-words font-display text-2xl text-forest dark:text-white md:text-3xl">{n}</p><p className="text-xs font-bold text-slate-500">{l}</p></div>)}</div>

        <div className="mt-6 grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(260px,.7fr)]">
          <section className="paper min-w-0 rounded-lg bg-white p-4 md:p-5"><div className="flex items-center justify-between gap-4"><div><h2 className="font-extrabold">Your impact is growing</h2><p className="text-xs text-slate-500">Carbon avoided across your ECOSTAY trips</p></div><BarChart3 className="shrink-0 text-leaf"/></div><div className="mt-4 h-64 min-w-0"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData}><defs><linearGradient id="responsiveColorV" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#4CAF50" stopOpacity={.35}/><stop offset="95%" stopColor="#4CAF50" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" vertical={false} opacity={.2}/><XAxis dataKey="m" axisLine={false} tickLine={false}/><YAxis hide/><Tooltip/><Area type="monotone" dataKey="v" stroke="#2E7D32" strokeWidth={3} fill="url(#responsiveColorV)"/></AreaChart></ResponsiveContainer></div></section>
          <section className="overflow-hidden rounded-lg bg-forest p-5 text-white md:p-6"><p className="text-xs font-bold uppercase tracking-wider text-lime">Next adventure</p><h2 className="mt-3 font-display text-3xl">Monsoon in Coorg</h2><p className="mt-1 text-sm text-white/60">24-27 July · 2 travellers</p><div className="mt-8 space-y-3 text-sm"><p className="flex items-center gap-2"><Check size={16} className="text-lime"/>Stay reserved</p><p className="flex items-center gap-2"><Check size={16} className="text-lime"/>Experience booked</p><p className="flex items-center gap-2 text-white/50"><span className="h-4 w-4 rounded-full border border-white/40"/>Transport pending</p></div><button className="mt-8 w-full rounded-lg bg-white py-3 text-sm font-extrabold text-forest">View trip</button></section>
        </div>

        <section className="mt-12"><SectionHead eyebrow="Picked for you" title="Your next favourite stay" link="See all"/><div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">{properties.slice(2,5).map(p=><PropertyCard key={p.id} property={p}/>)}</div></section>
      </div>
    </div>
  </main>;
}

function Footer() {
  return <footer className="mt-12 bg-[#0d2a20] py-12 text-white"><div className="container-page grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]"><div><div className="[&_a]:text-white"><Logo/></div><p className="mt-4 max-w-xs text-sm leading-6 text-white/55">Thoughtful stays, real local connection, and a lighter footprint wherever you go.</p></div>{[["Discover","Eco stays","Local experiences","AI trip planner"],["Company","Our story","Impact report","Host with us"],["Support","Help centre","Trust & safety","Contact"]].map(([h,...x])=><div key={h}><p className="mb-3 text-sm font-extrabold">{h}</p>{x.map(y=><a href="#" key={y} className="mb-2 block text-sm text-white/55 hover:text-lime">{y}</a>)}</div>)}</div><div className="container-page mt-10 flex flex-col justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row"><p>© 2026 ECOSTAY. Travel well.</p><p>Privacy · Terms · Accessibility</p></div></footer>;
}

function App() {
  const [catalog, setCatalog] = useState(emptyCatalog);
  const [toast, setToast] = useState({ isOpen: false, type: "info", message: "" });
  const location=useLocation();
  useEffect(()=>window.scrollTo(0,0),[location.pathname]);

  const loadCatalog = useCallback(() => {
    const controller = new AbortController();

    setCatalog((currentCatalog) => ({ ...currentCatalog, status: "loading", error: "" }));

    fetchCatalog(controller.signal)
      .then((nextCatalog) => {
        setCatalog({ ...nextCatalog, status: "success", error: "" });
        setToast({ isOpen: true, type: "success", message: "Catalog loaded from backend API." });
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          setCatalog({ ...emptyCatalog, status: "error", error: error.message || "Unable to load catalog from backend." });
          setToast({ isOpen: true, type: "error", message: "Could not load catalog from backend." });
        }
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    return loadCatalog();
  }, [loadCatalog]);

  return <CatalogContext.Provider value={catalog}><div className="page-surface min-h-screen overflow-x-clip transition-colors"><Navbar/><CatalogStatus status={catalog.status} error={catalog.error} onRetry={loadCatalog}/><Toast isOpen={toast.isOpen} type={toast.type} message={toast.message} onClose={()=>setToast({...toast,isOpen:false})}/><AnimatePresence mode="wait"><motion.div key={location.pathname} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.2}}><Routes><Route path="/" element={<Home/>}/><Route path="/login" element={<Login/>}/><Route path="/explore" element={<Explore/>}/><Route path="/property/:id" element={<PropertyDetails/>}/><Route path="/assistant" element={<Assistant/>}/><Route path="/experiences" element={<Experiences/>}/><Route path="/itinerary" element={<Itinerary/>}/><Route path="/component-showcase" element={<ComponentShowcase/>}/><Route path="/recommendations" element={<Dashboard/>}/><Route path="/dashboard" element={<ResponsiveDashboard/>}/><Route path="*" element={<Home/>}/></Routes></motion.div></AnimatePresence><Footer/></div></CatalogContext.Provider>;
}

export default App;
