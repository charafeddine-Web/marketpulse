import { useMemo, useRef, useState, type DragEvent, type FormEvent, type HTMLAttributes, type ReactNode } from 'react'
import { BrowserRouter, Link, NavLink, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Activity, ArrowDownRight, ArrowDownUp, ArrowLeft, ArrowRight, ArrowUpRight, Bell,
  BriefcaseBusiness, CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight,
  CircleHelp, ClipboardList, CloudUpload, Database, Download, ExternalLink,
  Eye, EyeOff, FileBarChart, FileDown, Heart, LayoutDashboard, LineChart,
  ListFilter, LogOut, Menu, MessageSquareText, Moon, MoreHorizontal, Package,
  Search, Send, Settings, ShieldCheck, SlidersHorizontal, Sparkles,
  Star, Sun, Tag, TrendingDown, TrendingUp, Upload, Users, X, Zap,
} from 'lucide-react'
import {
  Area, AreaChart, Bar, CartesianGrid, Cell, ComposedChart, Line,
  LineChart as RechartsLineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import { categoryShare, formatMAD, marketActivity, notifications, products, type Product } from './data/market'
import { usePreferences } from './store/preferences'
import './App.css'

const queryClient = new QueryClient()
const navItems = [
  { label: 'Vue d’ensemble', path: '/', icon: LayoutDashboard },
  { label: 'Catalogue produits', path: '/products', icon: Package },
  { label: 'Tendances du marché', path: '/trends', icon: TrendingUp },
  { label: 'Analyse des sentiments', path: '/sentiment', icon: MessageSquareText },
  { label: 'Prévisions des prix', path: '/forecasting', icon: LineChart },
  { label: 'Opportunités', path: '/opportunities', icon: BriefcaseBusiness },
  { label: 'Gestion des données', path: '/data', icon: Database },
  { label: 'Alertes & notifications', path: '/notifications', icon: Bell, badge: '3' },
  { label: 'Rapports', path: '/reports', icon: FileBarChart },
]
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/register" element={<AuthPage mode="register" />} />
          <Route path="/forgot-password" element={<AuthPage mode="forgot" />} />
          <Route path="*" element={<Application />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

function Application() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenu, setMobileMenu] = useState(false)
  const [modal, setModal] = useState<'assistant' | 'compare' | 'import' | 'export' | null>(null)
  const [compareIds, setCompareIds] = useState<number[]>([])
  const [search, setSearch] = useState('')
  const [searchDraft, setSearchDraft] = useState('')
  const [noticeOpen, setNoticeOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [toast, setToast] = useState('')
  const { darkMode, toggleTheme } = usePreferences()
  const location = useLocation()
  const navigate = useNavigate()
  const currentNav = navItems.find((item) => item.path === location.pathname)
  const title = currentNav?.label ?? (location.pathname.startsWith('/products/') ? 'Détail du produit' : location.pathname === '/assistant' ? 'Assistant MarketPulse' : 'Paramètres')

  const notify = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2800)
  }
  const handleStaticControl = (event: React.MouseEvent<HTMLDivElement>) => {
    const control = (event.target as HTMLElement).closest<HTMLButtonElement>('button.select-button, button.small-icon')
    if (!control || control.dataset.action === 'interactive') return
    notify(control.classList.contains('select-button')
      ? `Affichage de démonstration · ${control.textContent?.trim()}`
      : 'Données du widget actualisées.')
  }

  return (
    <div className={`app-shell ${darkMode ? 'dark' : ''}`}>
      {mobileMenu && <button className="mobile-backdrop" aria-label="Fermer le menu" onClick={() => setMobileMenu(false)} />}
      <aside className={`sidebar ${sidebarOpen ? '' : 'sidebar-collapsed'} ${mobileMenu ? 'mobile-open' : ''}`}>
        <Link to="/" className="brand">
          <span className="brand-mark"><Activity size={19} strokeWidth={2.6} /></span>
          {sidebarOpen && <span className="brand-copy">market<span>pulse</span><small>INTELLIGENCE MAROC</small></span>}
        </Link>
        <button className="workspace-switch" onClick={() => notify('Espace Équipe Atlas sélectionné')}>
          <span className="workspace-avatar">A</span>
          {sidebarOpen && <><span className="workspace-text"><b>Équipe Atlas</b><small>Offre Business</small></span><ChevronDown size={15} /></>}
        </button>
        <div className="nav-caption">{sidebarOpen ? 'ESPACE DE TRAVAIL' : 'MENU'}</div>
        <nav className="side-nav">
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path} end={item.path === '/'} title={!sidebarOpen ? item.label : undefined} onClick={() => setMobileMenu(false)}>
              <item.icon size={18} />
              {sidebarOpen && <span>{item.label}</span>}
              {item.badge && sidebarOpen && <i className="nav-badge">{item.badge}</i>}
            </NavLink>
          ))}
        </nav>
        <div className="nav-caption tools-caption">{sidebarOpen ? 'VOTRE ESPACE' : ''}</div>
        <NavLink to="/settings" className="nav-link" title={!sidebarOpen ? 'Paramètres' : undefined}>
          <Settings size={18} />{sidebarOpen && <span>Paramètres</span>}
        </NavLink>
        <button className="assistant-nav" onClick={() => setModal('assistant')} title={!sidebarOpen ? 'Assistant IA' : undefined}>
          <span className="assistant-symbol"><Sparkles size={16} /></span>{sidebarOpen && <span>Assistant MarketPulse</span>}
        </button>
        <div className="sidebar-bottom">
          {sidebarOpen && <div className="plan-card"><div className="plan-head"><span>Votre espace</span><span className="plan-pill">PRO</span></div><b>Le marché, en clair.</b><div className="plan-progress"><span /></div><small>Votre essai se termine dans 12 jours</small><button onClick={() => notify('Les offres MarketPulse arrivent bientôt')}>Découvrir les offres <ArrowRight size={13} /></button></div>}
          <button className="sidebar-user" onClick={() => setProfileOpen((open) => !open)}>
            <span className="user-avatar">SB</span>{sidebarOpen && <><span className="user-meta"><b>Salma Benali</b><small>Administratrice</small></span><MoreHorizontal size={17} /></>}
          </button>
        </div>
      </aside>

      <div className="main-column" onClick={handleStaticControl}>
        <header className="topbar">
          <div className="topbar-left">
            <button className="icon-button mobile-menu-btn" aria-label="Ouvrir le menu" onClick={() => setMobileMenu(true)}><Menu size={19} /></button>
            <button className="icon-button collapse-btn" aria-label="Réduire le menu" onClick={() => setSidebarOpen((open) => !open)}><ChevronLeft size={17} className={!sidebarOpen ? 'rotate-icon' : ''} /></button>
            <span className="breadcrumb">MarketPulse <ChevronRight size={13} /> <b>{title}</b></span>
          </div>
          <div className="topbar-actions">
            <label className="global-search"><Search size={16} /><input placeholder="Rechercher un produit..." value={searchDraft} onChange={(event) => setSearchDraft(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') { setSearch(searchDraft); navigate('/products') } }} /><kbd>⌘ K</kbd></label>
            <button className="icon-button theme-toggle" aria-label="Changer le thème" onClick={toggleTheme}>{darkMode ? <Sun size={18} /> : <Moon size={18} />}</button>
            <div className="popover-wrap">
              <button className="icon-button notification-button" aria-label="Notifications" onClick={() => setNoticeOpen((open) => !open)}><Bell size={18} /><i /></button>
              {noticeOpen && <div className="popover notification-popover"><div className="popover-heading"><b>Notifications</b><button onClick={() => { setNoticeOpen(false); navigate('/notifications') }}>Tout voir</button></div>{notifications.slice(0, 3).map((item) => <div className="mini-notice" key={item.title}><span className={`notice-dot ${item.color}`} /><div><b>{item.title}</b><p>{item.body}</p><small>{item.time}</small></div></div>)}</div>}
            </div>
            <div className="popover-wrap profile-wrap"><button className="profile-button" onClick={() => setProfileOpen((open) => !open)}><span className="user-avatar">SB</span><ChevronDown size={14} /></button>{profileOpen && <div className="popover profile-popover"><b>Salma Benali</b><small>salma@marketpulse.ma</small><button onClick={() => navigate('/settings')}><Settings size={15} />Paramètres</button><button onClick={() => navigate('/login')}><LogOut size={15} />Se déconnecter</button></div>}</div>
          </div>
        </header>
        <main className="page-content">
          <Routes>
            <Route path="/" element={<Dashboard onModal={(type) => { if (type === 'compare') setCompareIds([]); setModal(type) }} onToast={notify} />} />
            <Route path="/products" element={<Catalogue key={search} search={search} onCompare={(ids) => { setCompareIds(ids); setModal('compare') }} onToast={notify} />} />
            <Route path="/products/:id" element={<ProductDetail onToast={notify} />} />
            <Route path="/trends" element={<Trends />} />
            <Route path="/sentiment" element={<Sentiment />} />
            <Route path="/forecasting" element={<Forecasting />} />
            <Route path="/opportunities" element={<Opportunities onToast={notify} />} />
            <Route path="/data" element={<DataManagement onToast={notify} />} />
            <Route path="/notifications" element={<NotificationsPage onToast={notify} />} />
            <Route path="/reports" element={<Reports onExport={() => setModal('export')} onToast={notify} />} />
            <Route path="/settings" element={<SettingsPage onToast={notify} />} />
            <Route path="/assistant" element={<AssistantPage />} />
            <Route path="*" element={<Dashboard onModal={setModal} onToast={notify} />} />
          </Routes>
        </main>
      </div>
      <button className="floating-assistant" onClick={() => setModal('assistant')} aria-label="Ouvrir l’assistant MarketPulse"><Sparkles size={18} /><span>Demander à l’IA</span></button>
      {modal && <Modal type={modal} compareIds={compareIds} onClose={() => setModal(null)} onToast={notify} />}
      {toast && <div className="toast"><Check size={16} />{toast}</div>}
    </div>
  )
}

function PageHeader({ eyebrow, title, description, actions }: { eyebrow?: string; title: string; description?: string; actions?: ReactNode }) {
  return <div className="page-heading"><div>{eyebrow && <div className="eyebrow">{eyebrow}</div>}<h1>{title}</h1>{description && <p>{description}</p>}</div>{actions && <div className="heading-actions">{actions}</div>}</div>
}

function Card({ children, className = '', ...props }: { children: ReactNode; className?: string } & HTMLAttributes<HTMLElement>) {
  return <section className={`card ${className}`} {...props}>{children}</section>
}

function Dashboard({ onModal, onToast }: { onModal: (type: 'assistant' | 'compare' | 'import' | 'export') => void; onToast: (message: string) => void }) {
  const topProducts = [...products].sort((a, b) => b.popularity - a.popularity).slice(0, 4)
  return <>
    <PageHeader eyebrow="JEUDI 5 NOVEMBRE 2026" title="Bonjour Salma 👋" description="Voici ce qui se passe sur le marché marocain aujourd’hui." actions={<><button className="button button-secondary" onClick={() => onToast('Période : 7 derniers jours')}><CalendarDays size={16} /> 7 derniers jours <ChevronDown size={14} /></button><button className="button button-primary" onClick={() => onModal('export')}><Download size={16} /> Exporter</button></>} />
    <div className="insight-banner"><div className="insight-icon"><Sparkles size={19} /></div><div><b>Votre marché bouge.</b><p>Les recherches pour les smartphones milieu de gamme ont augmenté de <strong>18 %</strong> cette semaine.</p></div><button onClick={() => onModal('assistant')}>Explorer l’insight <ArrowRight size={15} /></button><button className="banner-close" onClick={(event) => event.currentTarget.parentElement?.remove()} aria-label="Fermer"><X size={15} /></button></div>
    <div className="metrics-grid five-metrics">
      <Metric title="Produits suivis" value="2 846" trend="+12,8 %" icon={<Package size={18} />} tone="blue" caption="vs. mois dernier" />
      <Metric title="Prix moyen du marché" value="1 284 DH" trend="+3,2 %" icon={<Tag size={18} />} tone="violet" caption="sur tous les produits" inverse />
      <Metric title="Produits tendance" value="124" trend="+8,4 %" icon={<Zap size={18} />} tone="orange" caption="cette semaine" />
      <Metric title="Opportunités détectées" value="38" trend="+6 nouvelles" icon={<BriefcaseBusiness size={18} />} tone="green" caption="à fort potentiel" />
      <Metric title="Note moyenne clients" value="4,6 / 5" trend="+0,2" icon={<Star size={18} />} tone="blue" caption="sur les produits suivis" />
    </div>
    <div className="dashboard-grid">
      <Card className="chart-card price-card"><div className="card-heading"><div><h2>Évolution des prix</h2><p>Prix moyen observé sur les plateformes</p></div><button className="select-button" onClick={() => onToast('Affichage : 7 derniers mois')}>7 derniers mois <ChevronDown size={14} /></button></div><div className="chart-legend"><span><i className="legend-blue" /> Jumia</span><span><i className="legend-indigo" /> Avito</span></div><div className="chart-area"><ResponsiveContainer width="100%" height="100%"><AreaChart data={marketActivity} margin={{ left: 0, right: 12, top: 12, bottom: 0 }}><defs><linearGradient id="jumiaFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3563e9" stopOpacity={0.14} /><stop offset="95%" stopColor="#3563e9" stopOpacity={0} /></linearGradient><linearGradient id="avitoFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8b74e8" stopOpacity={0.12} /><stop offset="95%" stopColor="#8b74e8" stopOpacity={0} /></linearGradient></defs><CartesianGrid strokeDasharray="3 5" vertical={false} stroke="#edf0f5" /><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9299a8', fontSize: 11 }} dy={9} /><YAxis axisLine={false} tickLine={false} tick={{ fill: '#9299a8', fontSize: 11 }} tickFormatter={(value: number) => `${value} DH`} width={57} /><Tooltip formatter={(value) => [`${Number(value).toLocaleString('fr-MA')} DH`, 'Prix moyen']} contentStyle={{ border: '1px solid #e8ebf2', borderRadius: 10, fontSize: 12 }} /><Area type="monotone" dataKey="jumia" name="Jumia" stroke="#3563e9" strokeWidth={2.3} fill="url(#jumiaFill)" /><Area type="monotone" dataKey="avito" name="Avito" stroke="#8b74e8" strokeWidth={2.3} fill="url(#avitoFill)" /></AreaChart></ResponsiveContainer></div></Card>
      <Card className="category-card"><div className="card-heading"><div><h2>Répartition du marché</h2><p>Par catégorie de produits</p></div><button className="icon-button small-icon" onClick={() => onToast('Répartition actualisée')}><MoreHorizontal size={17} /></button></div><div className="donut-wrap"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={categoryShare} dataKey="value" nameKey="name" innerRadius={62} outerRadius={83} paddingAngle={4} stroke="none">{categoryShare.map((entry) => <Cell key={entry.name} fill={entry.color} />)}</Pie><Tooltip formatter={(value) => [`${value}%`, 'Part de marché']} /></PieChart></ResponsiveContainer><div className="donut-label"><b>2 846</b><small>produits</small></div></div><div className="category-legend">{categoryShare.map((category) => <div key={category.name}><span><i style={{ background: category.color }} />{category.name}</span><b>{category.value}%</b></div>)}</div></Card>
    </div>
    <div className="lower-grid">
      <Card className="table-card"><div className="card-heading"><div><h2>Produits tendance</h2><p>Les produits les plus consultés cette semaine</p></div><Link className="text-link" to="/trends">Tout voir <ArrowRight size={14} /></Link></div><div className="product-table compact-table"><div className="table-header"><span>PRODUIT</span><span>PRIX MOYEN</span><span>POPULARITÉ</span><span>ÉVOLUTION</span></div>{topProducts.map((product) => <ProductRow key={product.id} product={product} />)}</div></Card>
      <Card className="activity-card"><div className="card-heading"><div><h2>À surveiller</h2><p>Signaux détectés par MarketPulse</p></div><button className="icon-button small-icon" onClick={() => onToast('Signaux actualisés')}><MoreHorizontal size={17} /></button></div><div className="watch-list"><WatchItem icon={<TrendingDown size={16} />} tone="green" title="Baisse de prix notable" detail="Galaxy S24 Ultra · −3,8 % sur Jumia" time="Il y a 12 min" /><WatchItem icon={<TrendingUp size={16} />} tone="orange" title="Forte demande détectée" detail="Accessoires gaming · Casablanca" time="Il y a 1 h" /><WatchItem icon={<Activity size={16} />} tone="blue" title="Nouvelle tendance" detail="Sneakers rétro · +24 % de recherches" time="Il y a 3 h" /></div><Link to="/notifications" className="activity-link">Voir toutes les alertes <ArrowRight size={14} /></Link></Card>
    </div>
    <div className="lower-grid"><Card className="table-card movement-card"><div className="card-heading"><div><h2>Plus fortes variations de prix</h2><p>Les évolutions les plus marquées du catalogue</p></div><Link className="text-link" to="/products">Catalogue <ArrowRight size={14} /></Link></div>{[...products].sort((a, b) => Math.abs((b.price - b.previousPrice) / b.previousPrice) - Math.abs((a.price - a.previousPrice) / a.previousPrice)).slice(0, 4).map((product) => <MoveRow key={product.id} product={product} />)}</Card><Card className="table-card movement-card"><div className="card-heading"><div><h2>Récemment ajoutés</h2><p>Nouveaux produits suivis dans votre espace</p></div><Link className="text-link" to="/products">Tout voir <ArrowRight size={14} /></Link></div>{[...products].sort((a, b) => a.daysAgo - b.daysAgo).slice(0, 4).map((product) => <RecentRow key={product.id} product={product} />)}</Card></div>
    <div className="bottom-row"><span><ShieldCheck size={14} /> Données simulées à des fins de démonstration</span><button onClick={() => onModal('compare')}><ArrowDownUp size={14} /> Comparer des produits</button></div>
  </>
}

function Metric({ title, value, trend, icon, tone, caption, inverse = false }: { title: string; value: string; trend: string; icon: ReactNode; tone: string; caption: string; inverse?: boolean }) {
  return <Card className="metric-card"><div className="metric-top"><span>{title}</span><span className={`metric-icon ${tone}`}>{icon}</span></div><div className="metric-value">{value}</div><div className="metric-foot"><span className={`trend-pill ${inverse ? 'trend-warn' : ''}`}><TrendingUp size={12} />{trend}</span><span>{caption}</span></div></Card>
}

function WatchItem({ icon, tone, title, detail, time }: { icon: ReactNode; tone: string; title: string; detail: string; time: string }) {
  return <div className="watch-item"><span className={`watch-icon ${tone}`}>{icon}</span><div className="watch-copy"><b>{title}</b><span>{detail}</span></div><small>{time}</small></div>
}

function ProductRow({ product }: { product: Product }) {
  const change = Math.round(((product.price - product.previousPrice) / product.previousPrice) * 1000) / 10
  return <Link to={`/products/${product.id}`} className="product-row"><span className="product-identity"><img src={product.image} alt="" /><span><b>{product.name}</b><small>{product.category} · {product.platform}</small></span></span><b>{formatMAD(product.price)}</b><span className="popularity"><span className="popularity-track"><i style={{ width: `${product.popularity}%` }} /></span><small>{product.popularity}</small></span><span className={change <= 0 ? 'change positive' : 'change negative'}>{change <= 0 ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}{Math.abs(change)}%</span></Link>
}

function MoveRow({ product }: { product: Product }) {
  const change = Math.round(((product.price - product.previousPrice) / product.previousPrice) * 1000) / 10
  return <Link to={`/products/${product.id}`} className="movement-row"><span className="product-identity"><img src={product.image} alt="" /><span><b>{product.name}</b><small>{product.category} · {product.platform}</small></span></span><b>{formatMAD(product.price)}</b><span className={`change ${change <= 0 ? 'positive' : 'negative'}`}>{change <= 0 ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}{change > 0 ? '+' : ''}{change}%</span></Link>
}

function RecentRow({ product }: { product: Product }) {
  return <Link to={`/products/${product.id}`} className="movement-row"><span className="product-identity"><img src={product.image} alt="" /><span><b>{product.name}</b><small>{product.category} · {product.platform}</small></span></span><b>{formatMAD(product.price)}</b><span className="recent-days">{product.daysAgo === 1 ? 'Hier' : `Il y a ${product.daysAgo} j`}</span></Link>
}

function Catalogue({ search, onCompare, onToast }: { search: string; onCompare: (ids: number[]) => void; onToast: (message: string) => void }) {
  const [query, setQuery] = useState(search)
  const [category, setCategory] = useState('Toutes les catégories')
  const [platform, setPlatform] = useState('Toutes les plateformes')
  const [city, setCity] = useState('Toutes les villes')
  const [sort, setSort] = useState('popular')
  const [period, setPeriod] = useState('Toutes les périodes')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [minPopularity, setMinPopularity] = useState(0)
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const [view, setView] = useState<'grid' | 'table'>('grid')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<number[]>([])
  const [favoritesOnly, setFavoritesOnly] = useState(false)
  const { favorites, toggleFavorite } = usePreferences()
  const pageSize = 8
  const filtered = useMemo(() => products.filter((product) =>
    (category === 'Toutes les catégories' || product.category === category)
    && (platform === 'Toutes les plateformes' || product.platform === platform)
    && (city === 'Toutes les villes' || product.city === city)
    && (!minPrice || product.price >= Number(minPrice))
    && (!maxPrice || product.price <= Number(maxPrice))
    && product.popularity >= minPopularity
    && (period === 'Toutes les périodes' || product.daysAgo <= (period === '7 derniers jours' ? 7 : period === '30 derniers jours' ? 30 : 90))
    && (!query || product.name.toLowerCase().includes(query.toLowerCase()))
    && (!favoritesOnly || favorites.includes(product.id)),
  ).sort((a, b) => sort === 'price-low' ? a.price - b.price : sort === 'price-high' ? b.price - a.price : sort === 'rating' ? b.rating - a.rating : b.popularity - a.popularity), [category, city, favorites, favoritesOnly, maxPrice, minPopularity, minPrice, period, platform, query, sort])
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize)
  const choose = (id: number) => setSelected((items) => items.includes(id) ? items.filter((item) => item !== id) : items.length < 3 ? [...items, id] : items)
  return <>
    <PageHeader eyebrow="EXPLORATION DU MARCHÉ" title="Catalogue produits" description="Explorez, filtrez et comparez les prix des produits suivis au Maroc." actions={<><button className={`button ${favoritesOnly ? 'button-primary' : 'button-secondary'}`} onClick={() => { setFavoritesOnly((value) => !value); setPage(1) }}><Heart size={16} fill={favoritesOnly ? 'currentColor' : 'none'} /> Favoris ({favorites.length})</button><button className="button button-primary" onClick={() => onToast('Votre demande de suivi a été enregistrée')}><Package size={16} /> Suivre un produit</button></>} />
    <Card className="filters-card"><div className="filter-toolbar"><label className="catalogue-search"><Search size={16} /><input placeholder="Nom du produit, marque…" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1) }} /></label><Select value={category} onChange={(value) => { setCategory(value); setPage(1) }} options={['Toutes les catégories', ...Array.from(new Set(products.map((product) => product.category)))]} /><Select value={city} onChange={(value) => { setCity(value); setPage(1) }} options={['Toutes les villes', 'Casablanca', 'Rabat', 'Marrakech', 'Tanger', 'Fès', 'Agadir']} /><Select value={platform} onChange={(value) => { setPlatform(value); setPage(1) }} options={['Toutes les plateformes', 'Jumia', 'Avito']} /><button className="icon-button filter-button" aria-label="Filtres avancés" onClick={() => setAdvancedOpen((open) => !open)}><SlidersHorizontal size={16} /></button></div>{advancedOpen && <div className="advanced-filters"><label>Prix minimum (DH)<input type="number" min="0" value={minPrice} onChange={(event) => { setMinPrice(event.target.value); setPage(1) }} placeholder="0" /></label><label>Prix maximum (DH)<input type="number" min="0" value={maxPrice} onChange={(event) => { setMaxPrice(event.target.value); setPage(1) }} placeholder="Sans limite" /></label><Select value={period} onChange={(value) => { setPeriod(value); setPage(1) }} options={['Toutes les périodes', '7 derniers jours', '30 derniers jours', '90 derniers jours']} /><label className="popularity-filter">Popularité minimale <input type="range" min="0" max="100" step="10" value={minPopularity} onChange={(event) => { setMinPopularity(Number(event.target.value)); setPage(1) }} /><b>{minPopularity}/100</b></label><button className="text-link" onClick={() => { setMinPrice(''); setMaxPrice(''); setMinPopularity(0); setPeriod('Toutes les périodes') }}>Réinitialiser</button></div>}<div className="filter-bottom"><span><Package size={14} /> <b>{filtered.length}</b> produits trouvés</span><div className="filter-tools"><label className="sort-label"><ArrowDownUp size={14} /><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="popular">Plus populaires</option><option value="price-low">Prix croissant</option><option value="price-high">Prix décroissant</option><option value="rating">Meilleures notes</option></select></label><span className="view-switch"><button className={view === 'grid' ? 'selected' : ''} onClick={() => setView('grid')} aria-label="Vue en cartes"><LayoutDashboard size={15} /></button><button className={view === 'table' ? 'selected' : ''} onClick={() => setView('table')} aria-label="Vue en liste"><ClipboardList size={15} /></button></span>{selected.length > 0 && <button className="compare-inline" onClick={() => onCompare(selected)}><ArrowDownUp size={14} /> Comparer ({selected.length})</button>}</div></div></Card>
    {view === 'table' ? <Card className="catalog-table-card"><div className="product-table catalog-table"><div className="table-header"><span>PRODUIT</span><span>PRIX</span><span>NOTE CLIENTS</span><span>POPULARITÉ</span><span>ÉVOLUTION</span><span>FAVORI</span><span>COMPARE</span></div>{visible.map((product) => { const change = Math.round(((product.price - product.previousPrice) / product.previousPrice) * 1000) / 10; return <div key={product.id} className="catalog-table-row"><Link to={`/products/${product.id}`} className="product-identity"><img src={product.image} alt="" /><span><b>{product.name}</b><small>{product.category} · {product.platform}</small></span></Link><b>{formatMAD(product.price)}</b><span><Star size={13} fill="#f3ad3d" color="#f3ad3d" /> {product.rating} <small>({product.reviews})</small></span><span className="popularity"><span className="popularity-track"><i style={{ width: `${product.popularity}%` }} /></span><small>{product.popularity}</small></span><span className={change <= 0 ? 'change positive' : 'change negative'}>{change <= 0 ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}{Math.abs(change)}%</span><button className={`heart-button ${favorites.includes(product.id) ? 'is-favorite' : ''}`} onClick={() => toggleFavorite(product.id)} aria-label="Ajouter aux favoris"><Heart size={16} fill={favorites.includes(product.id) ? 'currentColor' : 'none'} /></button><input type="checkbox" checked={selected.includes(product.id)} onChange={() => choose(product.id)} aria-label={`Comparer ${product.name}`} /></div> })}</div></Card> : <div className="catalog-grid">{visible.map((product) => <ProductCard key={product.id} product={product} favorite={favorites.includes(product.id)} onFavorite={() => toggleFavorite(product.id)} selected={selected.includes(product.id)} onSelect={() => choose(product.id)} />)}</div>}
    {visible.length === 0 && <Card className="empty-state"><Search size={24} /><b>Aucun produit trouvé</b><p>Essayez de modifier vos filtres ou votre recherche.</p><button className="button button-secondary" onClick={() => { setCategory('Toutes les catégories'); setPlatform('Toutes les plateformes'); setCity('Toutes les villes'); setFavoritesOnly(false) }}>Réinitialiser les filtres</button></Card>}
    <div className="pagination"><span>Affichage de {filtered.length ? (page - 1) * pageSize + 1 : 0} à {Math.min(page * pageSize, filtered.length)} sur {filtered.length} produits</span><div><button disabled={page <= 1} onClick={() => setPage((value) => value - 1)} aria-label="Page précédente"><ChevronLeft size={16} /></button><b>{page}</b><span>/ {pageCount}</span><button disabled={page >= pageCount} onClick={() => setPage((value) => value + 1)} aria-label="Page suivante"><ChevronRight size={16} /></button></div></div>
  </>
}

function Select({ value, options, onChange }: { value: string; options: string[]; onChange: (value: string) => void }) {
  return <label className="select-wrap"><select value={value} onChange={(event) => onChange(event.target.value)}>{options.map((option) => <option key={option}>{option}</option>)}</select><ChevronDown size={14} /></label>
}

function ProductCard({ product, favorite, onFavorite, selected, onSelect }: { product: Product; favorite: boolean; onFavorite: () => void; selected: boolean; onSelect: () => void }) {
  const change = Math.round(((product.price - product.previousPrice) / product.previousPrice) * 1000) / 10
  return <Card className="product-card"><div className="product-photo"><Link to={`/products/${product.id}`}><img src={product.image} alt={product.name} loading="lazy" /></Link><span className="platform-label">{product.platform}</span><button className={`heart-button ${favorite ? 'is-favorite' : ''}`} onClick={onFavorite} aria-label={favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}><Heart size={17} fill={favorite ? 'currentColor' : 'none'} /></button><label className="compare-check"><input type="checkbox" checked={selected} onChange={onSelect} /> Comparer</label></div><div className="product-card-content"><Link to={`/products/${product.id}`} className="product-card-title">{product.name}</Link><span className="product-card-category">{product.category} <i /> {product.city}</span><div className="product-card-price"><b>{formatMAD(product.price)}</b><span className={change <= 0 ? 'change positive' : 'change negative'}>{change <= 0 ? <ArrowDownRight size={13} /> : <ArrowUpRight size={13} />}{Math.abs(change)}%</span></div><div className="product-card-foot"><span><Star size={13} fill="#f3ad3d" color="#f3ad3d" /> {product.rating} <small>({product.reviews})</small></span><span><TrendingUp size={13} /> {product.popularity} <small>pop.</small></span></div></div></Card>
}

function ProductDetail({ onToast }: { onToast: (message: string) => void }) {
  const { id } = useParams()
  const product = products.find((item) => item.id === Number(id)) ?? products[0]
  const { favorites, toggleFavorite } = usePreferences()
  return <>
    <Link to="/products" className="back-link"><ArrowLeft size={15} /> Retour au catalogue</Link>
    <PageHeader eyebrow={`${product.category.toUpperCase()} · ${product.platform.toUpperCase()}`} title={product.name} description={`Suivi du marché à ${product.city}, Maroc · Dernière mise à jour aujourd’hui à 09:42`} actions={<><button className="button button-secondary" onClick={() => toggleFavorite(product.id)}><Heart size={16} fill={favorites.includes(product.id) ? 'currentColor' : 'none'} />{favorites.includes(product.id) ? 'En favoris' : 'Ajouter aux favoris'}</button><button className="button button-primary" onClick={() => onToast('Alerte de prix créée')}><Bell size={16} /> Créer une alerte</button></>} />
    <div className="detail-layout"><Card className="detail-image-card"><img src={product.image} alt={product.name} /><span className="source-tag">{product.platform} · Données de démonstration</span></Card><div className="detail-summary"><Card className="detail-price-card"><span className="eyebrow">MEILLEUR PRIX OBSERVÉ</span><div className="detail-price">{formatMAD(product.price)}</div><span className="change positive"><ArrowDownRight size={14} />−{Math.abs(Math.round(((product.price - product.previousPrice) / product.previousPrice) * 1000) / 10)}% <span>sur 30 jours</span></span><div className="detail-divider" /><div className="detail-info-line"><span>Prix précédent</span><b>{formatMAD(product.previousPrice)}</b></div><div className="detail-info-line"><span>Plateforme</span><b>{product.platform}</b></div><div className="detail-info-line"><span>Note clients</span><b><Star size={14} fill="#f3ad3d" color="#f3ad3d" /> {product.rating} / 5</b></div><button className="button button-primary full-button" onClick={() => onToast('Redirection vers la source de démonstration')}>Voir l’offre <ExternalLink size={15} /></button></Card><Card className="ai-insight"><div className="ai-title"><Sparkles size={17} /> Analyse MarketPulse</div><p>{product.name} conserve une dynamique positive. Le prix moyen est inférieur de <b>4,2 %</b> à celui observé le mois dernier, tandis que l’intérêt des acheteurs reste soutenu.</p><span>Analyse générée à partir des données de démonstration</span></Card></div></div>
    <div className="dashboard-grid detail-lower"><Card className="chart-card"><div className="card-heading"><div><h2>Historique des prix</h2><p>Évolution estimée sur les 7 derniers mois</p></div><button className="select-button" onClick={() => onToast('Période : 7 mois')}>7 mois <ChevronDown size={14} /></button></div><div className="chart-area detail-chart"><ResponsiveContainer width="100%" height="100%"><RechartsLineChart data={marketActivity.map((item, index) => ({ ...item, price: Math.round(product.price * (0.92 + index * 0.013)) }))}><CartesianGrid strokeDasharray="3 5" vertical={false} stroke="#edf0f5" /><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9299a8', fontSize: 11 }} /><YAxis axisLine={false} tickLine={false} tick={{ fill: '#9299a8', fontSize: 11 }} tickFormatter={(value: number) => `${value} DH`} /><Tooltip formatter={(value) => [`${Number(value).toLocaleString('fr-MA')} DH`, 'Prix moyen']} /><Line type="monotone" dataKey="price" stroke="#3563e9" strokeWidth={2.5} dot={{ fill: '#3563e9', r: 3 }} /></RechartsLineChart></ResponsiveContainer></div></Card><Card className="sentiment-card"><div className="card-heading"><div><h2>Avis clients</h2><p>Analyse de {product.reviews} avis</p></div><Link className="text-link" to="/sentiment">Détails <ArrowRight size={14} /></Link></div><div className="rating-big"><b>{product.rating}</b><span><span>★★★★★</span><small>Note moyenne</small></span></div><div className="sentiment-bar"><i /></div><div className="sentiment-split"><span>Positifs <b>78 %</b></span><span>Neutres <b>16 %</b></span><span>Négatifs <b>6 %</b></span></div><p className="review-quote">« Très bon rapport qualité-prix, conforme à mes attentes. »</p><small className="quote-credit">Avis client · Casablanca</small></Card></div>
    <PageHeader title="Produits similaires" description="Autres produits comparables suivis sur le marché." /><div className="catalog-grid similar-grid">{products.filter((item) => item.id !== product.id && item.category === product.category).slice(0, 4).map((item) => <ProductCard key={item.id} product={item} favorite={favorites.includes(item.id)} onFavorite={() => toggleFavorite(item.id)} selected={false} onSelect={() => undefined} />)}</div>
  </>
}

function Trends() {
  const trending = [...products].sort((a, b) => b.popularity - a.popularity)
  return <>
    <PageHeader eyebrow="COMPRENDRE LE MARCHÉ" title="Tendances du marché" description="Repérez les mouvements qui façonnent la demande au Maroc." actions={<button className="button button-secondary"><CalendarDays size={16} /> 30 derniers jours <ChevronDown size={14} /></button>} />
    <div className="metrics-grid three-metrics"><Metric title="Indice de demande" value="78,4" trend="+6,8 %" icon={<Activity size={18} />} tone="blue" caption="vs. période précédente" /><Metric title="Catégories en hausse" value="8" trend="+2 nouvelles" icon={<TrendingUp size={18} />} tone="green" caption="sur 30 jours" /><Metric title="Produits émergents" value="42" trend="+14,2 %" icon={<Sparkles size={18} />} tone="violet" caption="cette semaine" /></div>
    <div className="dashboard-grid"><Card className="chart-card"><div className="card-heading"><div><h2>Activité du marché</h2><p>Indice de recherches et d’intérêt produit</p></div><button className="select-button">Cette année <ChevronDown size={14} /></button></div><div className="chart-area"><ResponsiveContainer width="100%" height="100%"><ComposedChart data={marketActivity}><CartesianGrid strokeDasharray="3 5" vertical={false} stroke="#edf0f5" /><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9299a8', fontSize: 11 }} /><YAxis axisLine={false} tickLine={false} tick={{ fill: '#9299a8', fontSize: 11 }} /><Tooltip /><Bar dataKey="activity" name="Indice de demande" fill="#dfe7ff" radius={[5, 5, 0, 0]} /><Line dataKey="activity" name="Tendance" stroke="#3563e9" strokeWidth={2.5} dot={false} /></ComposedChart></ResponsiveContainer></div></Card><Card className="city-card"><div className="card-heading"><div><h2>Demande par ville</h2><p>Indice d’intérêt observé</p></div><button className="icon-button small-icon"><MoreHorizontal size={17} /></button></div>{[['Casablanca', 86], ['Rabat', 72], ['Marrakech', 65], ['Tanger', 58], ['Fès', 51], ['Agadir', 44]].map(([city, value]) => <div className="city-progress" key={city}><span>{city}</span><div><i style={{ width: `${value}%` }} /></div><b>{value}</b></div>)}</Card></div>
    <div className="lower-grid"><Card className="table-card"><div className="card-heading"><div><h2>Les produits qui montent</h2><p>Popularité en progression cette semaine</p></div><span className="soft-badge green"><TrendingUp size={13} /> Tendances</span></div><div className="product-table compact-table"><div className="table-header"><span>PRODUIT</span><span>PRIX MOYEN</span><span>POPULARITÉ</span><span>ÉVOLUTION</span></div>{trending.slice(0, 5).map((product, index) => <Link to={`/products/${product.id}`} className="product-row" key={product.id}><span className="product-identity"><span className="rank-number">{String(index + 1).padStart(2, '0')}</span><img src={product.image} alt="" /><span><b>{product.name}</b><small>{product.category}</small></span></span><b>{formatMAD(product.price)}</b><span className="popularity"><span className="popularity-track"><i style={{ width: `${product.popularity}%` }} /></span><small>{product.popularity}</small></span><span className="change positive"><ArrowUpRight size={14} />+{index === 0 ? '24' : 12 + index * 3}%</span></Link>)}</div></Card><Card className="trend-note"><div className="ai-title"><Sparkles size={17} /> À retenir</div><h2>La tech reste en tête.</h2><p>Les accessoires et smartphones abordables concentrent la plus forte progression de la demande cette semaine.</p><div className="note-stat"><span>Catégorie en hausse</span><b>+18,6 %</b></div><div className="note-stat"><span>Ville la plus dynamique</span><b>Casablanca</b></div><Link to="/opportunities" className="text-link">Explorer les opportunités <ArrowRight size={14} /></Link></Card></div>
  </>
}

function Sentiment() {
  const sentimentData = [{ name: 'Positif', value: 72, color: '#34b889' }, { name: 'Neutre', value: 19, color: '#f2b84b' }, { name: 'Négatif', value: 9, color: '#ed6a70' }]
  const words = [['Qualité', 96], ['Prix', 78], ['Livraison', 63], ['Conforme', 58], ['Rapide', 43], ['Emballage', 34], ['Service', 29], ['Autonomie', 24]]
  return <>
    <PageHeader eyebrow="VOIX DES CLIENTS" title="Analyse des sentiments" description="Comprenez ce que vos clients pensent des produits et des marques." actions={<button className="button button-secondary"><CalendarDays size={16} /> 30 derniers jours <ChevronDown size={14} /></button>} />
    <div className="metrics-grid four-metrics"><Metric title="Avis analysés" value="12 486" trend="+1 284" icon={<MessageSquareText size={18} />} tone="blue" caption="ce mois-ci" /><Metric title="Sentiment positif" value="72 %" trend="+4,6 pts" icon={<Check size={18} />} tone="green" caption="vs. mois dernier" /><Metric title="Sentiment neutre" value="19 %" trend="−1,2 pts" icon={<Activity size={18} />} tone="orange" caption="vs. mois dernier" /><Metric title="Sentiment négatif" value="9 %" trend="−3,4 pts" icon={<TrendingDown size={18} />} tone="red" caption="vs. mois dernier" /></div>
    <div className="dashboard-grid"><Card className="chart-card"><div className="card-heading"><div><h2>Évolution du sentiment</h2><p>Répartition des avis clients dans le temps</p></div><button className="select-button">6 derniers mois <ChevronDown size={14} /></button></div><div className="chart-legend"><span><i className="legend-green" /> Positif</span><span><i className="legend-orange" /> Neutre</span><span><i className="legend-red" /> Négatif</span></div><div className="chart-area"><ResponsiveContainer width="100%" height="100%"><AreaChart data={marketActivity.map((entry, index) => ({ ...entry, positive: 65 + index * 1.4, neutral: 23 - index * 0.5, negative: 12 - index * 0.9 }))}><CartesianGrid strokeDasharray="3 5" vertical={false} stroke="#edf0f5" /><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9299a8', fontSize: 11 }} /><YAxis axisLine={false} tickLine={false} tick={{ fill: '#9299a8', fontSize: 11 }} unit="%" /><Tooltip /><Area type="monotone" dataKey="positive" name="Positif" stroke="#34b889" fill="#ddf5eb" strokeWidth={2} /><Area type="monotone" dataKey="neutral" name="Neutre" stroke="#f2b84b" fill="#fff3d4" strokeWidth={2} /><Area type="monotone" dataKey="negative" name="Négatif" stroke="#ed6a70" fill="#fde7e7" strokeWidth={2} /></AreaChart></ResponsiveContainer></div></Card><Card className="sentiment-breakdown"><div className="card-heading"><div><h2>Vue d’ensemble</h2><p>Sur l’ensemble des avis analysés</p></div></div><div className="sentiment-donut"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={sentimentData} dataKey="value" innerRadius={61} outerRadius={83} paddingAngle={4} stroke="none">{sentimentData.map((item) => <Cell key={item.name} fill={item.color} />)}</Pie><Tooltip formatter={(value) => [`${value}%`, 'Sentiment']} /></PieChart></ResponsiveContainer><div className="donut-label"><b>72%</b><small>positifs</small></div></div>{sentimentData.map((item) => <div className="sentiment-legend" key={item.name}><span><i style={{ background: item.color }} />{item.name}</span><b>{item.value}%</b></div>)}</Card></div>
    <div className="lower-grid"><Card className="keywords-card"><div className="card-heading"><div><h2>Les mots qui reviennent</h2><p>Termes les plus fréquents dans les avis</p></div><button className="select-button">Tous produits <ChevronDown size={14} /></button></div><div className="keyword-cloud">{words.map(([word, value], index) => <span className={`keyword keyword-${index % 4}`} key={word}>{word}<small>{value}</small></span>)}</div><div className="keyword-footnote">La taille du mot reflète sa fréquence dans les avis.</div></Card><Card className="reviews-card"><div className="card-heading"><div><h2>Avis récents</h2><p>Retours clients représentatifs</p></div><Link className="text-link" to="/products">Catalogue <ArrowRight size={14} /></Link></div><Review quote="Excellent rapport qualité-prix, livraison rapide et produit conforme." author="Meryem A." product="Samsung Galaxy S24 Ultra" sentiment="Positif" /><Review quote="Le produit est bien, mais l’emballage mériterait d’être amélioré." author="Youssef K." product="MacBook Air M3" sentiment="Neutre" /><Review quote="La qualité est au rendez-vous, je recommande." author="Imane B." product="Nike Air Max Pulse" sentiment="Positif" /></Card></div>
  </>
}

function Review({ quote, author, product, sentiment }: { quote: string; author: string; product: string; sentiment: string }) {
  return <div className="review-item"><div className="review-stars">★★★★★</div><p>« {quote} »</p><div><b>{author}</b><span>{product}</span><i className={sentiment === 'Positif' ? 'review-positive' : 'review-neutral'}>{sentiment}</i></div></div>
}

function Forecasting() {
  const [selected, setSelected] = useState(products[0].name)
  const selectedProduct = products.find((product) => product.name === selected) ?? products[0]
  const currentPrice = selectedProduct.price
  const predictedPrice = Math.round(currentPrice * 1.031)
  const data = marketActivity.map((item, index) => ({ ...item, historique: Math.round(currentPrice * (0.93 + index * 0.01)), futur: index >= 5 ? Math.round(currentPrice * (0.99 + (index - 5) * 0.012)) : null }))
  return <>
    <PageHeader eyebrow="ANTICIPER LES MOUVEMENTS" title="Prévisions des prix" description="Anticipez l’évolution des prix et ajustez votre stratégie au bon moment." actions={<label className="select-button product-select"><Package size={15} /><select value={selected} onChange={(event) => setSelected(event.target.value)}>{products.slice(0, 8).map((product) => <option key={product.id}>{product.name}</option>)}</select><ChevronDown size={14} /></label>} />
    <div className="forecast-callout"><span className="forecast-callout-icon"><Sparkles size={18} /></span><div><b>Analyse prédictive MarketPulse</b><p>Modèle basé sur l’historique de prix simulé et la dynamique de la demande. Les prévisions sont indicatives.</p></div><span className="confidence-pill">Confiance élevée · 87 %</span></div>
    <div className="metrics-grid three-metrics"><Metric title="Prix actuel" value={formatMAD(currentPrice)} trend="−3,8 %" icon={<Tag size={18} />} tone="blue" caption="sur les 30 derniers jours" /><Metric title="Prix estimé dans 30 j." value={formatMAD(predictedPrice)} trend="+3,1 %" icon={<TrendingUp size={18} />} tone="green" caption="projection moyenne" /><Metric title="Indice de confiance" value="87 %" trend="Élevé" icon={<ShieldCheck size={18} />} tone="violet" caption="qualité des données" /></div>
    <Card className="chart-card forecast-chart-card"><div className="card-heading"><div><h2>Historique & prévision du prix</h2><p>Projection des prix moyens · {selected}</p></div><button className="select-button">6 mois + prévision <ChevronDown size={14} /></button></div><div className="chart-legend"><span><i className="legend-blue" /> Prix observé</span><span><i className="legend-dashed" /> Prévision</span></div><div className="chart-area forecast-chart"><ResponsiveContainer width="100%" height="100%"><ComposedChart data={data}><CartesianGrid strokeDasharray="3 5" vertical={false} stroke="#edf0f5" /><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9299a8', fontSize: 11 }} /><YAxis axisLine={false} tickLine={false} tick={{ fill: '#9299a8', fontSize: 11 }} tickFormatter={(value: number) => `${value.toLocaleString('fr-MA')} DH`} width={75} /><Tooltip formatter={(value) => value == null ? ['—', ''] : [`${Number(value).toLocaleString('fr-MA')} DH`, 'Prix']} /><Area dataKey="historique" name="Prix observé" stroke="#3563e9" fill="#eaf0ff" strokeWidth={2.5} /><Line dataKey="futur" name="Prévision" stroke="#8b74e8" strokeWidth={2.5} strokeDasharray="7 5" connectNulls dot={{ fill: '#8b74e8', r: 4 }} /></ComposedChart></ResponsiveContainer></div><div className="chart-footnote"><span><i className="legend-blue" /> Historique observé</span><span><i className="legend-dashed" /> Estimation indicative · données simulées</span></div></Card>
    <div className="lower-grid"><Card className="forecast-insight"><div className="ai-title"><Sparkles size={17} /> Ce que prédit MarketPulse</div><h2>Une hausse modérée attendue.</h2><p>Le prix de {selected} pourrait progresser légèrement dans les prochaines semaines, porté par une demande stable et une offre moins abondante.</p><div className="note-stat"><span>Évolution attendue</span><b className="text-green">+3,1 %</b></div></Card><Card className="forecast-insight"><div className="ai-title"><Activity size={17} /> Prévision de la demande</div><h2>Demande soutenue</h2><p>L’intérêt des acheteurs devrait rester au-dessus de la moyenne observée sur les six derniers mois.</p><div className="note-stat"><span>Indice de demande estimé</span><b>82 / 100</b></div></Card></div>
  </>
}

function Opportunities({ onToast }: { onToast: (message: string) => void }) {
  const [sort, setSort] = useState('score')
  const opportunities = products.slice(0, 8).map((product, index) => ({ product, score: [94, 89, 86, 82, 79, 76, 72, 68][index], growth: [32, 27, 24, 21, 18, 16, 13, 11][index], potential: [78, 72, 68, 61, 58, 52, 48, 41][index] })).sort((a, b) => sort === 'potential' ? b.potential - a.potential : b.score - a.score)
  return <>
    <PageHeader eyebrow="DÉTECTER LA VALEUR" title="Opportunités commerciales" description="Des signaux de marché transformés en pistes concrètes pour votre activité." actions={<button className="button button-primary" onClick={() => onToast('Analyse des opportunités actualisée')}><Sparkles size={16} /> Actualiser l’analyse</button>} />
    <div className="opportunity-highlight"><div className="opportunity-highlight-icon"><BriefcaseBusiness size={21} /></div><div><span>OPPORTUNITÉ À SAISIR</span><h2>Les smartphones milieu de gamme accélèrent.</h2><p>Demande en forte hausse à Casablanca et Rabat, avec un écart de prix intéressant entre les plateformes.</p></div><div className="highlight-score"><b>94</b><small>SCORE</small></div></div>
    <div className="metrics-grid three-metrics"><Metric title="Opportunités actives" value="38" trend="+6 cette semaine" icon={<BriefcaseBusiness size={18} />} tone="blue" caption="sur le marché marocain" /><Metric title="Potentiel moyen" value="72 / 100" trend="+8 pts" icon={<TrendingUp size={18} />} tone="green" caption="score de rentabilité" /><Metric title="Demande en hausse" value="24 produits" trend="+12,4 %" icon={<Activity size={18} />} tone="violet" caption="sur 30 jours" /></div>
    <Card className="opportunities-card"><div className="card-heading"><div><h2>Opportunités détectées</h2><p>Classement par potentiel commercial estimé</p></div><label className="sort-label"><ListFilter size={14} /><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="score">Score d’opportunité</option><option value="potential">Potentiel commercial</option></select></label></div><div className="opportunity-table"><div className="table-header"><span>PRODUIT</span><span>DEMANDE</span><span>PRIX MOYEN</span><span>CROISSANCE</span><span>SCORE</span><span>RECOMMANDATION</span></div>{opportunities.map(({ product, score, growth, potential }) => <div className="opportunity-row" key={product.id}><Link to={`/products/${product.id}`} className="product-identity"><img src={product.image} alt="" /><span><b>{product.name}</b><small>{product.category}</small></span></Link><span className="demand-cell"><span className="demand-dots"><i /><i /><i /><i className={score < 80 ? 'muted' : ''} /></span><small>{score > 85 ? 'Forte' : 'Modérée'}</small></span><b>{formatMAD(product.price)}</b><span className="change positive"><ArrowUpRight size={14} />+{growth}%</span><span className="score-pill">{score}</span><button className="recommendation-button" onClick={() => onToast(`Analyse détaillée : potentiel estimé à ${potential}/100`)}><Sparkles size={13} /> Explorer</button></div>)}</div></Card>
    <div className="data-disclaimer"><CircleHelp size={15} /> Les scores et recommandations sont simulés à des fins de démonstration et ne constituent pas un conseil financier.</div>
  </>
}

function DataManagement({ onToast }: { onToast: (message: string) => void }) {
  const fileInput = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState('')
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [dragging, setDragging] = useState(false)
  const onFile = (file?: File) => {
    if (!file) return
    if (!file.name.toLowerCase().endsWith('.csv')) { setCsvFile(null); setFileName(''); onToast('Veuillez sélectionner un fichier CSV.'); return }
    if (file.size > 20 * 1024 * 1024) { setCsvFile(null); setFileName(''); onToast('Le fichier dépasse la limite de 20 Mo.'); return }
    setCsvFile(file)
    setFileName(file.name)
  }
  const importFile = async () => {
    if (!csvFile) { onToast('Sélectionnez un fichier CSV avant de lancer l’import.'); return }
    const rows = (await csvFile.text()).split(/\r?\n/).filter((row) => row.trim()).length - 1
    if (rows < 1) { onToast('Le CSV doit contenir une ligne d’en-tête et au moins un produit.'); return }
    onToast(`${rows} lignes détectées dans ${fileName} · import simulé`)
  }
  return <>
    <PageHeader eyebrow="QUALITÉ & SOURCES" title="Gestion des données" description="Suivez vos sources de données et gérez les imports de votre espace." actions={<button className="button button-primary" onClick={() => fileInput.current?.click()}><Upload size={16} /> Importer un fichier</button>} />
    <div className="metrics-grid four-metrics"><Metric title="Enregistrements" value="24 680" trend="+1 284" icon={<Database size={18} />} tone="blue" caption="ce mois-ci" /><Metric title="Qualité des données" value="96,4 %" trend="+1,2 pts" icon={<ShieldCheck size={18} />} tone="green" caption="toutes sources" /><Metric title="Doublons détectés" value="184" trend="−12,4 %" icon={<CopyIcon />} tone="orange" caption="à vérifier" /><Metric title="Prix manquants" value="2,1 %" trend="Stable" icon={<Tag size={18} />} tone="violet" caption="de vos données" /></div>
    <div className="dashboard-grid"><Card className="sources-card"><div className="card-heading"><div><h2>Sources de données</h2><p>État des connecteurs de collecte</p></div><span className="soft-badge green"><i /> Opérationnel</span></div><SourceRow name="Jumia Maroc" detail="Produits, prix et avis clients" initials="J" tone="orange" count="18 420 produits" status="Synchronisé il y a 14 min" /><SourceRow name="Avito Maroc" detail="Annonces et prix du marché" initials="A" tone="blue" count="6 260 produits" status="Synchronisé il y a 32 min" /><div className="data-source-note"><ShieldCheck size={15} /> Connecteurs de démonstration · aucune collecte en direct</div></Card><Card className={`upload-card ${dragging ? 'is-dragging' : ''}`} onDragOver={(event: DragEvent) => { event.preventDefault(); setDragging(true) }} onDragLeave={() => setDragging(false)} onDrop={(event: DragEvent) => { event.preventDefault(); setDragging(false); onFile(event.dataTransfer.files[0]) }}><div className="upload-icon"><CloudUpload size={22} /></div><h2>Importer vos données</h2><p>Glissez votre fichier CSV ici, ou parcourez vos fichiers.</p><button className="button button-secondary" onClick={() => fileInput.current?.click()}>Choisir un fichier</button><small>CSV uniquement · 20 Mo maximum</small>{fileName && <span className="selected-file"><Check size={14} /> {fileName}</span>}<input ref={fileInput} type="file" accept=".csv,text/csv" hidden onChange={(event) => onFile(event.target.files?.[0])} /><button className="button button-primary import-submit" onClick={importFile} disabled={!fileName}>Lancer l’import</button></Card></div>
    <Card className="import-history"><div className="card-heading"><div><h2>Historique des imports</h2><p>Dernières opérations effectuées dans votre espace</p></div><button className="select-button">Tous les imports <ChevronDown size={14} /></button></div><div className="history-table"><div className="table-header"><span>FICHIER / SOURCE</span><span>DATE</span><span>ENREGISTREMENTS</span><span>QUALITÉ</span><span>STATUT</span></div><HistoryRow file="catalogue_octobre.csv" date="Aujourd’hui, 09:42" records="1 284" quality="98,2 %" /><HistoryRow file="Jumia Maroc · sync" date="Aujourd’hui, 09:28" records="842" quality="96,8 %" /><HistoryRow file="Avito Maroc · sync" date="Aujourd’hui, 09:10" records="426" quality="94,1 %" /><HistoryRow file="import_produits_sept.csv" date="29 oct. 2026, 16:08" records="2 140" quality="97,5 %" /></div></Card>
  </>
}

function CopyIcon() { return <ClipboardList size={18} /> }
function SourceRow({ name, detail, initials, tone, count, status }: { name: string; detail: string; initials: string; tone: string; count: string; status: string }) {
  return <div className="source-row"><span className={`source-avatar ${tone}`}>{initials}</span><span className="source-meta"><b>{name}</b><small>{detail}</small></span><span className="source-count"><b>{count}</b><small>{status}</small></span><span className="source-state"><i />Actif</span><button className="icon-button small-icon" aria-label={`Options ${name}`}><MoreHorizontal size={17} /></button></div>
}
function HistoryRow({ file, date, records, quality }: { file: string; date: string; records: string; quality: string }) {
  return <div className="history-row"><span><FileBarChart size={16} /><b>{file}</b></span><span>{date}</span><b>{records}</b><span className="quality-score">{quality}</span><span className="status-complete"><Check size={13} /> Terminé</span></div>
}

function NotificationsPage({ onToast }: { onToast: (message: string) => void }) {
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [readAll, setReadAll] = useState(false)
  const [alertPreferences, setAlertPreferences] = useState({ prices: true, trends: true, opportunities: true })
  const updatePreference = (key: keyof typeof alertPreferences) => setAlertPreferences((preferences) => ({ ...preferences, [key]: !preferences[key] }))
  return <>
    <PageHeader eyebrow="RESTER INFORMÉ" title="Alertes & notifications" description="Les signaux importants du marché, réunis au même endroit." actions={<button className="button button-secondary" onClick={() => { setReadAll(true); onToast('Toutes les notifications sont marquées comme lues') }}><Check size={16} /> Tout marquer comme lu</button>} />
    <div className="notification-layout"><Card className="notification-feed"><div className="card-heading"><div><h2>Récemment</h2><p>{readAll ? 'Vous êtes à jour.' : '3 nouvelles alertes à consulter'}</p></div><button className="select-button">Toutes les alertes <ChevronDown size={14} /></button></div>{notifications.map((item, index) => <div className={`notification-item ${readAll ? 'read' : ''}`} key={item.title}><span className={`notification-type ${item.color}`}>{index === 0 ? <TrendingDown size={17} /> : index === 1 ? <BriefcaseBusiness size={17} /> : <TrendingUp size={17} />}</span><div className="notification-copy"><div><b>{item.title}</b><small>{item.time}</small></div><p>{item.body}</p><button onClick={() => onToast('Alerte ajoutée à vos éléments suivis')}>Voir le détail <ArrowRight size={13} /></button></div>{!readAll && <i className="unread-dot" />}</div>)}</Card><Card className="alert-settings"><div className="card-heading"><div><h2>Préférences d’alertes</h2><p>Choisissez les signaux à suivre</p></div></div><ToggleRow title="Alertes par e-mail" detail="Recevoir un résumé dans votre boîte mail" checked={emailAlerts} onChange={() => setEmailAlerts((value) => !value)} /><ToggleRow title="Variations de prix" detail="Quand un prix varie de plus de 5 %" checked={alertPreferences.prices} onChange={() => updatePreference('prices')} /><ToggleRow title="Nouvelles tendances" detail="Produits et catégories en hausse" checked={alertPreferences.trends} onChange={() => updatePreference('trends')} /><ToggleRow title="Opportunités commerciales" detail="Détection de pistes à fort potentiel" checked={alertPreferences.opportunities} onChange={() => updatePreference('opportunities')} /><button className="button button-primary full-button" onClick={() => onToast('Préférences enregistrées')}>Enregistrer les préférences</button></Card></div>
    <Card className="notification-history"><div className="card-heading"><div><h2>Historique des alertes</h2><p>Vos notifications des 30 derniers jours</p></div><button className="text-link" onClick={() => onToast('Historique téléchargé')}>Télécharger <Download size={14} /></button></div>{[...notifications, ...notifications].map((item, index) => <div className="history-notice" key={`${item.title}-${index}`}><span className={`notice-dot ${item.color}`} /><b>{item.title}</b><span>{item.body}</span><small>{index < 3 ? item.time : 'Hier, 14:32'}</small></div>)}</Card>
  </>
}

function ToggleRow({ title, detail, checked, onChange }: { title: string; detail: string; checked: boolean; onChange: () => void }) {
  return <div className="toggle-row"><span><b>{title}</b><small>{detail}</small></span><button className={`toggle ${checked ? 'on' : ''}`} onClick={onChange} role="switch" aria-checked={checked}><i /></button></div>
}

function Reports({ onExport, onToast }: { onExport: () => void; onToast: (message: string) => void }) {
  const reportTypes = [
    { icon: <LineChart size={18} />, title: 'Évolution des prix', description: 'Suivez les variations de prix par produit et plateforme.', color: 'blue' },
    { icon: <ArrowDownUp size={18} />, title: 'Comparaison de produits', description: 'Comparez les prix, notes et popularités du marché.', color: 'violet' },
    { icon: <MessageSquareText size={18} />, title: 'Analyse des sentiments', description: 'Synthèse des retours et avis clients par catégorie.', color: 'green' },
    { icon: <TrendingUp size={18} />, title: 'Tendances du marché', description: 'Les signaux clés et évolutions par secteur.', color: 'orange' },
  ]
  return <>
    <PageHeader eyebrow="VOS DONNÉES, EN CLAIR" title="Rapports & analyses" description="Créez des rapports utiles et partagez vos analyses de marché." actions={<button className="button button-primary" onClick={onExport}><FileDown size={16} /> Exporter en PDF</button>} />
    <div className="report-hero"><span className="report-hero-icon"><FileBarChart size={21} /></span><div><span>RAPPORT HEBDOMADAIRE</span><h2>Le marché marocain en un regard.</h2><p>Un aperçu des prix, tendances et opportunités de la semaine du 2 au 8 novembre.</p></div><button className="button button-primary" onClick={onExport}><Download size={15} /> Télécharger le rapport</button></div>
    <div className="section-title-row"><div><h2>Générer un rapport</h2><p>Choisissez une analyse à exporter</p></div></div><div className="report-grid">{reportTypes.map((report) => <Card className="report-type-card" key={report.title}><span className={`report-icon ${report.color}`}>{report.icon}</span><h3>{report.title}</h3><p>{report.description}</p><button onClick={() => { onToast(`Rapport « ${report.title} » préparé`); onExport() }}>Créer un rapport <ArrowRight size={14} /></button></Card>)}</div>
    <Card className="import-history"><div className="card-heading"><div><h2>Rapports récents</h2><p>Vos dernières analyses exportées</p></div><button className="text-link" onClick={() => onToast('Tous les rapports sont affichés')}>Tout voir <ArrowRight size={14} /></button></div><div className="history-table"><div className="table-header"><span>NOM DU RAPPORT</span><span>TYPE</span><span>CRÉÉ LE</span><span>FORMAT</span><span>ACTION</span></div>{[['Analyse prix · Smartphones', 'Évolution des prix', 'Aujourd’hui, 09:24'], ['Marché marocain · Semaine 44', 'Tendances du marché', 'Hier, 16:48'], ['Sentiment · Électronique', 'Analyse des sentiments', '30 oct. 2026']].map(([name, type, date]) => <div className="history-row" key={name}><span><FileBarChart size={16} /><b>{name}</b></span><span>{type}</span><span>{date}</span><span className="format-badge">PDF</span><button className="download-row" onClick={() => onToast(`${name} téléchargé`)}><Download size={15} /> Télécharger</button></div>)}</div></Card>
  </>
}

function SettingsPage({ onToast }: { onToast: (message: string) => void }) {
  const [tab, setTab] = useState('Profil')
  const [name, setName] = useState('Salma Benali')
  return <>
    <PageHeader eyebrow="VOTRE ESPACE DE TRAVAIL" title="Paramètres" description="Gérez votre profil, vos préférences et votre espace MarketPulse." />
    <div className="settings-layout"><div className="settings-tabs">{['Profil', 'Préférences', 'Notifications', 'Équipe', 'Facturation'].map((item) => <button className={tab === item ? 'active' : ''} key={item} onClick={() => setTab(item)}>{item}</button>)}</div><Card className="settings-card"><div className="settings-heading"><h2>{tab}</h2><p>Modifiez les informations de votre espace MarketPulse.</p></div>{tab === 'Profil' ? <><div className="profile-edit"><span className="user-avatar large-avatar">SB</span><div><b>Photo de profil</b><small>JPG ou PNG · 2 Mo maximum</small></div><button className="button button-secondary" onClick={() => onToast('Sélectionnez une image depuis votre appareil')}>Modifier</button></div><label className="form-field">Nom complet<input value={name} onChange={(event) => setName(event.target.value)} /></label><label className="form-field">Adresse e-mail<input value="salma@marketpulse.ma" readOnly /></label><label className="form-field">Nom de l’espace<input defaultValue="Équipe Atlas" /></label><div className="settings-footer"><button className="button button-primary" onClick={() => onToast('Vos paramètres ont été enregistrés')}>Enregistrer les modifications</button></div></> : tab === 'Préférences' ? <><ToggleRow title="Mode sombre" detail="Utiliser une interface sombre dans MarketPulse" checked={usePreferences.getState().darkMode} onChange={() => { usePreferences.getState().toggleTheme(); onToast('Thème mis à jour') }} /><ToggleRow title="Suggestions personnalisées" detail="Adapter les insights à votre activité" checked onChange={() => onToast('Préférence mise à jour')} /><label className="form-field">Langue de l’interface<select defaultValue="Français"><option>Français</option><option>العربية</option><option>English</option></select></label></> : <><ToggleRow title="Notifications par e-mail" detail="Recevoir les alertes importantes" checked onChange={() => onToast('Préférence mise à jour')} /><ToggleRow title="Rapport hebdomadaire" detail="Chaque lundi matin" checked onChange={() => onToast('Préférence mise à jour')} /><div className="team-placeholder"><Users size={20} /><b>{tab} de votre espace</b><p>La gestion de {tab.toLowerCase()} sera bientôt disponible.</p></div></>}</Card></div>
  </>
}

function AssistantPage() {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([])
  const [input, setInput] = useState('')
  const send = (text = input) => {
    if (!text.trim()) return
    setMessages((items) => [...items, { role: 'user', text }, { role: 'assistant', text: `D’après les données de démonstration MarketPulse, ${text.toLowerCase().includes('smartphone') ? 'les smartphones milieu de gamme affichent une demande dynamique, particulièrement à Casablanca et Rabat. Le prix moyen observé varie selon la plateforme.' : 'les signaux récents montrent une activité soutenue dans les catégories électronique et maison. Vous pouvez consulter les tendances pour explorer les données en détail.'} Ces indicateurs sont simulés et ne reflètent pas des données en temps réel.` }])
    setInput('')
  }
  return <>
    <PageHeader eyebrow="VOTRE ANALYSTE DE MARCHÉ" title="Assistant MarketPulse" description="Posez une question et explorez les signaux du marché marocain." />
    <Card className="assistant-page-card"><div className="assistant-conversation"><div className="assistant-welcome"><span><Sparkles size={22} /></span><h2>Comment puis-je vous aider ?</h2><p>Je peux vous aider à comprendre les tendances et opportunités du marché marocain.</p></div>{messages.map((message, index) => <div className={`chat-message ${message.role}`} key={index}><span>{message.role === 'assistant' ? <Sparkles size={15} /> : 'SB'}</span><p>{message.text}</p></div>)}{messages.length === 0 && <div className="suggested-questions"><button onClick={() => send('Quels sont les produits les plus populaires au Maroc ?')}>Quels sont les produits les plus populaires au Maroc ? <ArrowRight size={14} /></button><button onClick={() => send('Compare les prix des smartphones sur Jumia et Avito.')}>Compare les prix des smartphones sur Jumia et Avito. <ArrowRight size={14} /></button><button onClick={() => send('Quelles sont les meilleures opportunités commerciales ?')}>Quelles sont les meilleures opportunités commerciales ? <ArrowRight size={14} /></button></div>}</div><form className="chat-input" onSubmit={(event) => { event.preventDefault(); send() }}><input placeholder="Posez votre question sur le marché…" value={input} onChange={(event) => setInput(event.target.value)} /><button className="button button-primary" aria-label="Envoyer"><Send size={16} /></button></form><small className="assistant-disclaimer">L’assistant utilise des données simulées. Vérifiez les informations avant toute décision commerciale.</small></Card>
  </>
}

function Modal({ type, compareIds, onClose, onToast }: { type: 'assistant' | 'compare' | 'import' | 'export'; compareIds: number[]; onClose: () => void; onToast: (message: string) => void }) {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [working, setWorking] = useState(false)
  const [exportFormat, setExportFormat] = useState<'PDF' | 'CSV'>('PDF')
  const { favorites } = usePreferences()
  const selectedIds = compareIds.length > 0 ? compareIds : favorites
  const compareProducts = products.filter((product) => selectedIds.includes(product.id)).slice(0, 3)
  const title = type === 'assistant' ? 'Assistant MarketPulse' : type === 'compare' ? 'Comparer des produits' : type === 'import' ? 'Importer des données' : 'Exporter votre rapport'
  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (type === 'assistant') {
      if (!question.trim()) return
      setWorking(true)
      window.setTimeout(() => {
        setAnswer(`Les données de démonstration indiquent une dynamique intéressante sur le marché marocain. ${question.toLowerCase().includes('prix') ? 'Les prix moyens varient selon les plateformes et les villes : consultez le catalogue pour comparer les produits.' : 'Les catégories électronique et smartphones figurent parmi les plus dynamiques actuellement.'} Ces données sont simulées, et non issues d’une collecte en direct.`)
        setWorking(false)
      }, 700)
    } else if (type === 'export') {
      if (exportFormat === 'CSV') {
        const rows = ['Produit;Catégorie;Plateforme;Prix (DH);Popularité', ...products.map((product) => `${product.name};${product.category};${product.platform};${product.price};${product.popularity}`)]
        const blob = new Blob([`\uFEFF${rows.join('\n')}`], { type: 'text/csv;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = 'marketpulse-rapport.csv'
        link.click()
        URL.revokeObjectURL(url)
      } else {
        const { jsPDF } = await import('jspdf')
        const document = new jsPDF()
        document.setFontSize(20)
        document.text('MarketPulse — Rapport de marché', 18, 22)
        document.setFontSize(10)
        document.text(`Marché marocain · ${new Date().toLocaleDateString('fr-MA')}`, 18, 31)
        document.text('Données de démonstration — aucune collecte en direct.', 18, 39)
        document.setFontSize(12)
        document.text('Produits suivis', 18, 53)
        document.setFontSize(9)
        products.slice(0, 10).forEach((product, index) => {
          document.text(`${product.name} · ${product.category} · ${formatMAD(product.price)} · popularité ${product.popularity}/100`, 18, 64 + index * 10)
        })
        document.save('marketpulse-rapport.pdf')
      }
      onToast(`Rapport ${exportFormat} téléchargé`)
      onClose()
    } else {
      onToast('Sélectionnez un fichier CSV depuis la page Gestion des données.')
      onClose()
    }
  }
  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}><section className={`modal ${type === 'assistant' ? 'assistant-modal' : ''}`} role="dialog" aria-modal="true" aria-labelledby="modal-title"><div className="modal-heading"><div><span className="modal-icon">{type === 'assistant' ? <Sparkles size={17} /> : type === 'compare' ? <ArrowDownUp size={17} /> : type === 'export' ? <FileDown size={17} /> : <Upload size={17} />}</span><h2 id="modal-title">{title}</h2></div><button className="icon-button" onClick={onClose} aria-label="Fermer"><X size={17} /></button></div>{type === 'assistant' ? <><div className="modal-chat-content"><div className="assistant-modal-intro">Bonjour Salma ! Je peux vous aider à analyser les tendances du marché marocain.</div>{answer && <div className="assistant-answer"><Sparkles size={14} />{answer}</div>}{working && <div className="typing-indicator"><i /><i /><i /> Analyse en cours…</div>}</div><div className="assistant-suggestions">{['Produits populaires ?', 'Tendances smartphones ?', 'Opportunités du moment ?'].map((item) => <button key={item} onClick={() => setQuestion(item)}>{item}</button>)}</div><form className="modal-chat-form" onSubmit={submit}><input autoFocus placeholder="Posez votre question…" value={question} onChange={(event) => setQuestion(event.target.value)} /><button className="button button-primary" aria-label="Envoyer"><Send size={15} /></button></form><small className="assistant-disclaimer">Réponses simulées · données de démonstration</small></> : type === 'compare' ? <><p className="modal-description">Comparez rapidement les produits sélectionnés ou ajoutés à vos favoris.</p>{compareProducts.length >= 2 ? <div className="compare-modal-grid">{compareProducts.map((product) => <div key={product.id}><img src={product.image} alt="" /><b>{product.name}</b><span>{formatMAD(product.price)}</span><small>Popularité : {product.popularity}/100</small></div>)}</div> : <div className="modal-empty"><ArrowDownUp size={22} /><b>Sélectionnez au moins deux produits</b><p>Choisissez des produits dans le catalogue ou ajoutez-les à vos favoris pour les comparer.</p></div>}<div className="modal-actions"><button className="button button-secondary" onClick={onClose}>Fermer</button><Link to="/products" className="button button-primary" onClick={onClose}>Ouvrir le catalogue <ArrowRight size={14} /></Link></div></> : <form onSubmit={submit}><p className="modal-description">{type === 'export' ? 'Téléchargez un rapport de marché au format PDF ou CSV.' : 'Importez un fichier CSV depuis la page Gestion des données.'}</p><div className="export-options"><label><input type="radio" name="format" checked={exportFormat === 'PDF'} onChange={() => setExportFormat('PDF')} /> PDF <small>Format prêt à partager</small></label><label><input type="radio" name="format" checked={exportFormat === 'CSV'} onChange={() => setExportFormat('CSV')} /> CSV <small>Données tabulaires</small></label></div><div className="modal-actions"><button type="button" className="button button-secondary" onClick={onClose}>Annuler</button><button className="button button-primary">{type === 'export' ? <><Download size={15} /> Générer le rapport</> : <><Upload size={15} /> Voir les imports</>}</button></div></form>}</section></div>
}

const authSchema = z.object({
  name: z.string().optional(),
  email: z.string().email('Saisissez une adresse e-mail valide.'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères.').optional(),
  remember: z.boolean().optional(),
})
type AuthFields = z.infer<typeof authSchema>

function AuthPage({ mode }: { mode: 'login' | 'register' | 'forgot' }) {
  const [showPassword, setShowPassword] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const navigate = useNavigate()
  const { register, handleSubmit, setError, formState: { errors } } = useForm<AuthFields>({ resolver: zodResolver(authSchema), defaultValues: { remember: true } })
  const onSubmit = (values: AuthFields) => {
    if (mode === 'forgot') { setSubmitted(true); return }
    if (mode === 'register' && !values.name?.trim()) { setError('name', { message: 'Saisissez votre nom complet.' }); return }
    if (!values.password || values.password.length < 8) { setError('password', { message: 'Le mot de passe doit contenir au moins 8 caractères.' }); return }
    navigate('/')
  }
  const title = mode === 'login' ? 'Ravi de vous revoir.' : mode === 'register' ? 'Votre marché. Votre avance.' : 'Réinitialisez votre mot de passe.'
  return <div className="auth-page"><div className="auth-left"><Link to="/" className="brand auth-brand"><span className="brand-mark"><Activity size={19} strokeWidth={2.6} /></span><span className="brand-copy">market<span>pulse</span><small>INTELLIGENCE MAROC</small></span></Link><div className="auth-content"><div className="eyebrow">LE RADAR DU MARCHÉ MAROCAIN</div><h1>{title}</h1><p className="auth-intro">{mode === 'login' ? 'Connectez-vous pour retrouver vos analyses, vos alertes et vos opportunités.' : mode === 'register' ? 'Créez votre espace et prenez une longueur d’avance sur votre marché.' : 'Pas d’inquiétude. Nous vous enverrons un lien sécurisé pour choisir un nouveau mot de passe.'}</p>{submitted ? <div className="auth-success"><span><Check size={20} /></span><b>Consultez votre boîte e-mail</b><p>Si un compte est associé à cette adresse, vous recevrez un lien de réinitialisation.</p><Link to="/login">Retour à la connexion</Link></div> : <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>{mode === 'register' && <label className="form-field">Nom complet<input placeholder="Ex. Salma Benali" {...register('name')} />{errors.name && <small className="field-error">{errors.name.message}</small>}</label>}<label className="form-field">Adresse e-mail<input type="email" placeholder="vous@entreprise.ma" {...register('email')} />{errors.email && <small className="field-error">{errors.email.message}</small>}</label>{mode !== 'forgot' && <label className="form-field">Mot de passe<span className="password-input"><input type={showPassword ? 'text' : 'password'} placeholder="8 caractères minimum" {...register('password')} /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></span>{errors.password && <small className="field-error">{errors.password.message}</small>}</label>}{mode === 'login' && <div className="auth-options"><label><input type="checkbox" {...register('remember')} /> Se souvenir de moi</label><Link to="/forgot-password">Mot de passe oublié ?</Link></div>}<button className="button button-primary auth-submit">{mode === 'login' ? 'Se connecter' : mode === 'register' ? 'Créer mon compte' : 'Envoyer le lien'} <ArrowRight size={16} /></button></form>}<div className="auth-switch">{mode === 'login' ? <>Pas encore de compte ? <Link to="/register">Créer un compte</Link></> : mode === 'register' ? <>Déjà un compte ? <Link to="/login">Se connecter</Link></> : <Link to="/login"><ArrowLeft size={14} /> Retour à la connexion</Link>}</div><div className="auth-legal">En continuant, vous acceptez nos <span>Conditions d’utilisation</span> et notre <span>Politique de confidentialité</span>.</div></div><div className="auth-foot"><span>© 2026 MarketPulse</span><span><ShieldCheck size={14} /> Vos données restent privées et sécurisées</span></div></div><div className="auth-art"><div className="auth-art-top"><span><i /> Données du marché marocain</span><span>Casablanca · Rabat · Marrakech</span></div><div className="auth-art-content"><div className="art-kicker"><span /> VOTRE AVANTAGE COMMENCE ICI</div><h2>Le bon signal.<br />Au bon moment.</h2><p>Transformez les données du marché en décisions plus justes.</p><div className="art-widget"><div className="art-widget-head"><span>Indice de demande</span><span className="art-live"><i /> En hausse</span></div><div className="art-widget-value">78,4 <small>+12,8 %</small></div><div className="art-sparkline"><svg viewBox="0 0 360 92" preserveAspectRatio="none"><path d="M0 72 C28 64 28 75 55 58 S90 74 119 48 S152 61 181 34 S213 57 245 24 S286 38 310 16 S339 24 360 4" fill="none" stroke="#77a2ff" strokeWidth="3" /><path d="M0 72 C28 64 28 75 55 58 S90 74 119 48 S152 61 181 34 S213 57 245 24 S286 38 310 16 S339 24 360 4 V92 H0Z" fill="url(#auth-gradient)" opacity=".32" /><defs><linearGradient id="auth-gradient" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#6190ff" /><stop offset="1" stopColor="#6190ff" stopOpacity="0" /></linearGradient></defs></svg></div><div className="art-widget-foot"><span>Mai</span><span>Juin</span><span>Juil</span><span>Août</span><span>Sept</span><span>Oct</span><span>Nov</span></div></div><div className="art-insight"><span><Sparkles size={16} /></span><div><b>Nouvelle opportunité détectée</b><small>Électronique · croissance de la demande de 18 %</small></div><ArrowUpRight size={16} /></div></div><div className="auth-art-bottom"><span>MarketPulse Intelligence</span><span>Une lecture plus claire du marché.</span></div></div></div>
}

export default App
