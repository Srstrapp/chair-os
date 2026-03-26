import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { api } from './services/api';

// Context
const AppContext = createContext();
const useApp = () => useContext(AppContext);

// ==================== APP STYLES ====================
const s = {
  card: 'bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl',
  btn: {
    primary: 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-lg shadow-violet-500/25',
    secondary: 'bg-white/10 hover:bg-white/20 border border-white/10 text-white',
    ghost: 'hover:bg-white/5 text-slate-400 hover:text-white',
  },
  input: 'bg-white/5 border border-white/10 focus:border-violet-500/50 focus:bg-white/10 transition-all duration-300 placeholder:text-slate-500',
};

// ==================== LAYOUT ====================
function Layout({ children }) {
  const { currentShop, shops, setCurrentShop, user, isOnline, pendingSync, logout } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = window.location.pathname;
  const navigate = useNavigate();
  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', emoji: '◉' },
    { id: 'services', label: 'Servicios', emoji: '✂' },
    { id: 'barbers', label: 'Barberos', emoji: '◉' },
    { id: 'wallet', label: 'Wallet', emoji: '◎' },
    { id: 'cash-box', label: 'Caja', emoji: '◆' },
    { id: 'inventory', label: 'Inventario', emoji: '◇' },
    { id: 'customers', label: 'Clientes', emoji: '○' },
    { id: 'appointments', label: 'Citas', emoji: '◇' },
    { id: 'settings', label: 'Ajustes', emoji: '⚙' },
  ];

  const isActive = (id) => location === `/${id}` || (location === '/' && id === 'dashboard');

  const handleNavigate = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-slate-900/80 backdrop-blur-2xl border-r border-white/10 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-8 border-b border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-xl shadow-violet-500/30">
                <span className="text-white text-2xl">✂</span>
              </div>
              <div>
                <h1 className="font-bold text-2xl tracking-tight">CHAIR<span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">OS</span></h1>
                <p className="text-xs text-slate-500">Sistema Operativo</p>
              </div>
            </div>
          </div>

          {/* Shop Selector */}
          {shops.length > 1 && (
            <div className="p-5 border-b border-white/10">
              <select 
                className={`w-full ${s.input} rounded-xl py-3 text-sm`}
                value={currentShop?.id || ''}
                onChange={(e) => {
                  const shop = shops.find(s => s.id === e.target.value);
                  if (shop) setCurrentShop(shop);
                }}
              >
                {shops.map(shop => (
                  <option key={shop.id} value={shop.id}>{shop.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Current Shop */}
          {currentShop && (
            <div className="px-6 py-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/20 flex items-center justify-center">
                  <span className="text-violet-400">✂</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{currentShop.name}</p>
                  <p className="text-xs text-slate-500 truncate">{currentShop.address}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavigate(`/${item.id === 'dashboard' ? '' : item.id}`)}
                className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-200 ${
                  isActive(item.id)
                    ? 'bg-gradient-to-r from-violet-600/20 to-purple-600/20 text-white border border-violet-500/30 shadow-lg shadow-violet-500/10'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="text-lg">{item.emoji}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Status & User */}
          <div className="p-6 border-t border-white/10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="text-xs text-slate-500">{isOnline ? 'En línea' : 'Sin conexión'}</span>
              {pendingSync > 0 && (
                <span className="ml-auto text-xs text-violet-400">{pendingSync} pendientes</span>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{user?.name || 'Usuario'}</p>
                <p className="text-xs text-slate-500 truncate">Administrador</p>
              </div>
              <button onClick={logout} className={`p-3 rounded-xl ${s.btn.ghost}`}>
                <span className="text-lg">⏻</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed bottom-8 left-8 z-40 w-16 h-16 bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-violet-500/40 active:scale-95 transition-transform"
      >
        <span className="text-white text-2xl">☰</span>
      </button>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <main className="flex-1 min-h-screen overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}

// ==================== LOGIN PAGE ====================
function LoginPage() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('owner@barbershop.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const success = await login(email, password);
      if (success) navigate('/dashboard');
    } catch (err) {
      setError('Credenciales inválidas. Intenta de nuevo.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-violet-500/20 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[150px]"></div>
      </div>
      
      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-16">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-violet-500/50">
            <span className="text-white text-5xl">✂</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tight mb-3">
            CHAIR<span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">OS</span>
          </h1>
          <p className="text-slate-500 text-lg">Sistema Operativo para Barberías</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className={`${s.card} p-10 space-y-6`}>
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-red-400 text-sm text-center">
              {error}
            </div>
          )}
          
          <div className="space-y-3">
            <label className="text-sm text-slate-400 ml-1">Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full ${s.input} rounded-2xl py-5 text-lg`}
              placeholder="tu@email.com"
              required
            />
          </div>
          
          <div className="space-y-3">
            <label className="text-sm text-slate-400 ml-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full ${s.input} rounded-2xl py-5 text-lg`}
              placeholder="••••••••"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full ${s.btn.primary} rounded-2xl py-5 text-lg font-semibold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-4`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Iniciando sesión...
              </span>
            ) : 'Iniciar Sesión'}
          </button>
        </form>

        {/* Demo */}
        <div className={`${s.card} rounded-2xl p-5 mt-6 text-center`}>
          <p className="text-xs text-slate-500 mb-2">Credenciales de demostración</p>
          <p className="text-sm text-slate-400">owner@barbershop.com / password123</p>
        </div>
      </div>
    </div>
  );
}

// ==================== DASHBOARD PAGE ====================
function DashboardPage() {
  const { currentShop } = useApp();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentShop) loadDashboard();
  }, [currentShop]);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const data = await api.getDashboard(currentShop.id);
      setDashboard(data.data);
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="p-10 flex items-center justify-center h-96">
        <div className="w-14 h-14 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Buenos días</h1>
          <p className="text-slate-400 mt-2 text-lg">{currentShop?.name} • {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        </div>
        <div className={`${s.card} rounded-2xl px-8 py-5 text-right`}>
          <p className="text-xs text-slate-500 uppercase tracking-wider">Tasa BCV</p>
          <p className="text-3xl font-bold text-emerald-400">Bs. {dashboard?.bcv_rate?.toLocaleString()}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'Servicios Hoy', value: dashboard?.today?.services_count || 0, icon: '✂', color: 'violet' },
          { label: 'Ventas Hoy', value: `$${(dashboard?.today?.total_sales_usd || 0).toFixed(2)}`, icon: '◆', color: 'emerald' },
          { label: 'Tus Ganancias', value: `$${(dashboard?.today?.owner_earnings || 0).toFixed(2)}`, icon: '◎', color: 'amber' },
          { label: 'Propinas', value: `$${(dashboard?.today?.tips_total || 0).toFixed(2)}`, icon: '◉', color: 'rose' },
        ].map((stat, i) => (
          <div key={i} className={`${s.card} rounded-3xl p-7 hover:bg-white/10 transition-all duration-300 cursor-pointer group`}>
            <div className="flex items-center justify-between mb-5">
              <span className="text-slate-400 text-sm">{stat.label}</span>
              <span className="text-3xl group-hover:scale-110 transition-transform">{stat.icon}</span>
            </div>
            <p className={`text-4xl font-bold ${stat.color === 'violet' ? 'bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent' : stat.color === 'emerald' ? 'text-emerald-400' : stat.color === 'amber' ? 'text-amber-400' : 'text-rose-400'}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Two Column */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Barbers */}
        <div className={`${s.card} rounded-3xl p-8`}>
          <h2 className="text-xl font-semibold mb-8">Rendimiento de Hoy</h2>
          <div className="space-y-4">
            {dashboard?.barbers?.map(barber => (
              <div key={barber.id} className="flex items-center gap-5 p-5 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/20 flex items-center justify-center">
                  <span className="text-violet-400 font-bold text-lg">{barber.name.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-lg truncate">{barber.name}</p>
                  <p className="text-sm text-slate-500">{barber.today_services} servicios • {barber.commission_type.replace('_', '/')}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-xl text-emerald-400">${barber.wallet_balance?.toFixed(2)}</p>
                  <p className="text-xs text-slate-500">wallet</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock */}
        <div className={`${s.card} rounded-3xl p-8`}>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center">
              <span className="text-2xl">⚠</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold">Stock Bajo</h2>
              <p className="text-sm text-slate-500">Productos que necesitan reposición</p>
            </div>
          </div>
          {dashboard?.low_stock_items?.length > 0 ? (
            <div className="space-y-3">
              {dashboard.low_stock_items.map(item => (
                <div key={item.id} className="flex items-center justify-between p-5 rounded-2xl bg-amber-500/5 border border-amber-500/10">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-amber-400 font-bold">{item.current_stock} / {item.min_stock}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
              <span className="text-5xl">✓</span>
              <p className="mt-4">Inventario en óptimas condiciones</p>
            </div>
          )}
        </div>
      </div>

      {/* Appointments */}
      <div className={`${s.card} rounded-3xl p-8`}>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-semibold">Próximas Citas</h2>
          <button onClick={() => navigate('/appointments')} className="text-sm text-violet-400 hover:text-violet-300 transition-colors">Ver todas →</button>
        </div>
        {dashboard?.upcoming_appointments?.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-4">
            {dashboard.upcoming_appointments.map(apt => (
              <div key={apt.id} className="p-5 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-center bg-violet-500/10 rounded-xl px-4 py-3">
                    <p className="text-xs text-slate-500">{apt.date.split('-')[2]}</p>
                    <p className="text-2xl font-bold">{apt.time}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{apt.customer_name}</p>
                    <p className="text-sm text-slate-500">{apt.barber_name}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">{apt.service_type}</span>
                  <span className={`text-xs px-3 py-1 rounded-full ${apt.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                    {apt.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500">
            <span className="text-5xl">📅</span>
            <p className="mt-4">No hay citas programadas</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ==================== SERVICES PAGE ====================
function ServicesPage() {
  const { currentShop } = useApp();
  const [services, setServices] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    barber_id: '',
    customer_name: '',
    customer_phone: '',
    service_type: 'Corte Fade',
    amount_total: 15,
    payment_method: 'CASH_USD',
    tip_amount: 0,
  });

  useEffect(() => { loadData(); }, [currentShop]);

  const loadData = async () => {
    if (!currentShop) return;
    setLoading(true);
    try {
      const [servicesRes, barbersRes] = await Promise.all([
        api.getServices(currentShop.id),
        api.getBarbers(currentShop.id),
      ]);
      setServices(servicesRes.data);
      setBarbers(barbersRes.data);
      if (barbersRes.data.length > 0 && !formData.barber_id) {
        setFormData(prev => ({ ...prev, barber_id: barbersRes.data[0].id }));
      }
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createService(currentShop.id, formData);
      setShowForm(false);
      setFormData({ ...formData, customer_name: '', customer_phone: '', amount_total: 15, tip_amount: 0 });
      loadData();
    } catch (error) {
      alert(error.message);
    }
  };

  const paymentMethods = {
    CASH_USD: 'Efectivo USD',
    CASH_BS: 'Efectivo Bs',
    ZELLE: 'Zelle',
    PAYMOBILE: 'Pago Móvil',
    CRYPTO: 'Crypto',
  };

  if (loading) {
    return (
      <div className="p-10 flex items-center justify-center h-96">
        <div className="w-14 h-14 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-10 space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Servicios</h1>
          <p className="text-slate-400 mt-2 text-lg">{services.length} servicios registrados</p>
        </div>
        <button onClick={() => setShowForm(true)} className={`${s.btn.primary} rounded-2xl px-8 py-5 font-semibold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]`}>
          <span className="flex items-center gap-3 text-lg">
            <span className="text-xl">+</span>
            Nuevo Servicio
          </span>
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowForm(false)}>
          <div className={`${s.card} rounded-3xl p-10 w-full max-w-lg`} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-2xl font-bold">Nuevo Servicio</h2>
                <p className="text-slate-500 text-sm mt-1">Registra un nuevo corte o servicio</p>
              </div>
              <button onClick={() => setShowForm(false)} className={`p-4 rounded-xl ${s.btn.ghost}`}>
                <span className="text-xl">✕</span>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm text-slate-400 ml-1">Barbero</label>
                <select value={formData.barber_id} onChange={(e) => setFormData({...formData, barber_id: e.target.value})} className={`w-full ${s.input} rounded-2xl py-4`} required>
                  {barbers.map(b => (
                    <option key={b.id} value={b.id}>{b.name} ({b.commission_type.replace('_', '/')})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-slate-400 ml-1">Cliente</label>
                  <input type="text" placeholder="Nombre" value={formData.customer_name} onChange={(e) => setFormData({...formData, customer_name: e.target.value})} className={`w-full ${s.input} rounded-2xl py-4`} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-400 ml-1">Teléfono</label>
                  <input type="text" placeholder="+58412..." value={formData.customer_phone} onChange={(e) => setFormData({...formData, customer_phone: e.target.value})} className={`w-full ${s.input} rounded-2xl py-4`} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-slate-400 ml-1">Servicio</label>
                  <select value={formData.service_type} onChange={(e) => setFormData({...formData, service_type: e.target.value})} className={`w-full ${s.input} rounded-2xl py-4`}>
                    <option value="Corte">Corte</option>
                    <option value="Corte Fade">Corte Fade</option>
                    <option value="Barba">Barba</option>
                    <option value="Corte + Barba">Corte + Barba</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-400 ml-1">Monto ($)</label>
                  <input type="number" step="0.01" value={formData.amount_total} onChange={(e) => setFormData({...formData, amount_total: parseFloat(e.target.value)})} className={`w-full ${s.input} rounded-2xl py-4`} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-slate-400 ml-1">Método de Pago</label>
                  <select value={formData.payment_method} onChange={(e) => setFormData({...formData, payment_method: e.target.value})} className={`w-full ${s.input} rounded-2xl py-4`}>
                    {Object.entries(paymentMethods).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-400 ml-1">Propina ($)</label>
                  <input type="number" step="0.01" value={formData.tip_amount} onChange={(e) => setFormData({...formData, tip_amount: parseFloat(e.target.value) || 0})} className={`w-full ${s.input} rounded-2xl py-4`} />
                </div>
              </div>
              <button type="submit" className={`w-full ${s.btn.primary} rounded-2xl py-5 font-semibold mt-6`}>
                Registrar Servicio
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Services List */}
      <div className="space-y-3">
        {services.map(service => (
          <div key={service.id} className={`${s.card} p-6 hover:bg-white/10 transition-all duration-300 cursor-pointer`}>
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-violet-500/10 flex items-center justify-center">
                <span className="text-violet-400 text-2xl">✂</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-xl">{service.service_type}</p>
                <p className="text-slate-400">{service.barber_name} • {service.customer_name} • {new Date(service.created_at).toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-3xl text-emerald-400">${service.amount_total.toFixed(2)}</p>
                <p className="text-sm text-slate-500">{paymentMethods[service.payment_method]}</p>
              </div>
              {service.tip_amount > 0 && (
                <div className="text-center bg-amber-500/10 rounded-2xl px-5 py-3">
                  <p className="text-xs text-slate-500">Propina</p>
                  <p className="font-bold text-amber-400">+${service.tip_amount}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== BARBERS PAGE ====================
function BarbersPage() {
  const { currentShop } = useApp();
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadBarbers(); }, [currentShop]);

  const loadBarbers = async () => {
    if (!currentShop) return;
    setLoading(true);
    try {
      const res = await api.getBarbers(currentShop.id);
      setBarbers(res.data);
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  const commissionLabels = {
    '50_50': { label: '50/50', desc: 'Barbero pone productos', color: 'emerald' },
    '60_40': { label: '60/40', desc: 'Local provee productos', color: 'violet' },
    'salary': { label: 'Asalariado', desc: 'Sueldo fijo', color: 'amber' },
  };

  if (loading) {
    return (
      <div className="p-10 flex items-center justify-center h-96">
        <div className="w-14 h-14 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-10 space-y-10">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Barberos</h1>
        <p className="text-slate-400 mt-2 text-lg">{barbers.length} barberos activos</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {barbers.map(barber => {
          const c = commissionLabels[barber.commission_type];
          return (
            <div key={barber.id} className={`${s.card} p-8 hover:bg-white/10 transition-all duration-300`}>
              <div className="flex items-center gap-5 mb-8">
                <div className="w-18 h-18 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-xl shadow-violet-500/30">
                  {barber.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-bold text-xl">{barber.name}</p>
                  <p className="text-slate-400">{barber.phone}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-4 border-t border-white/10">
                  <span className="text-slate-400">Comisión</span>
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    c.color === 'emerald' ? 'bg-emerald-500/20 text-emerald-400' :
                    c.color === 'violet' ? 'bg-violet-500/20 text-violet-400' :
                    'bg-amber-500/20 text-amber-400'
                  }`}>
                    {c.label}
                  </span>
                </div>
                <div className="flex items-center justify-between py-4 border-t border-white/10">
                  <span className="text-slate-400">Wallet Actual</span>
                  <span className="font-bold text-3xl text-emerald-400">${barber.wallet_balance?.toFixed(2)}</span>
                </div>
                <p className="text-xs text-slate-500 text-center pt-3">{c.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==================== WALLET PAGE ====================
function WalletPage() {
  const { currentShop } = useApp();
  const [barbers, setBarbers] = useState([]);
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadBarbers(); }, [currentShop]);
  useEffect(() => { if (selectedBarber) loadWallet(); }, [selectedBarber]);

  const loadBarbers = async () => {
    if (!currentShop) return;
    setLoading(true);
    try {
      const res = await api.getBarbers(currentShop.id);
      setBarbers(res.data);
      if (res.data.length > 0) setSelectedBarber(res.data[0]);
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  const loadWallet = async () => {
    try {
      const [walletRes, logsRes] = await Promise.all([
        api.getBarberWallet(selectedBarber.id),
        api.getBarberWalletLogs(selectedBarber.id),
      ]);
      setWallet(walletRes.data);
      setLogs(logsRes.data.logs || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-10 flex items-center justify-center h-96">
        <div className="w-14 h-14 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-10 space-y-10">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Wallet</h1>
        <p className="text-slate-400 mt-2 text-lg">Gestión de ganancias de barberos</p>
      </div>

      <div className={`${s.card} rounded-3xl p-6`}>
        <label className="text-sm text-slate-400 mb-4 block">Seleccionar Barbero</label>
        <select value={selectedBarber?.id || ''} onChange={(e) => setSelectedBarber(barbers.find(b => b.id === e.target.value))} className={`w-full ${s.input} rounded-2xl py-5`}>
          {barbers.map(b => (
            <option key={b.id} value={b.id}>{b.name} - {b.commission_type.replace('_', '/')}</option>
          ))}
        </select>
      </div>

      {wallet && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className={`${s.card} rounded-3xl p-10 relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl"></div>
            <p className="text-sm text-slate-400 mb-3 relative">Balance USD</p>
            <p className="text-6xl font-bold text-emerald-400 relative">${wallet.balance_usd?.toFixed(2)}</p>
          </div>
          <div className={`${s.card} rounded-3xl p-10 relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-40 h-40 bg-violet-500/20 rounded-full blur-3xl"></div>
            <p className="text-sm text-slate-400 mb-3 relative">Balance Bs</p>
            <p className="text-6xl font-bold text-violet-400 relative">Bs. {(wallet.balance_bs || 0).toLocaleString()}</p>
          </div>
        </div>
      )}

      <div className={`${s.card} rounded-3xl p-8`}>
        <h2 className="text-xl font-semibold mb-8">Historial de Movimientos</h2>
        <div className="space-y-3">
          {logs.map(log => (
            <div key={log.id} className="flex items-center gap-5 p-5 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                log.type === 'credit' ? 'bg-emerald-500/20 text-emerald-400' :
                log.type === 'debit' ? 'bg-rose-500/20 text-rose-400' :
                'bg-amber-500/20 text-amber-400'
              }`}>
                {log.type === 'credit' ? '↑' : log.type === 'debit' ? '↓' : '◆'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{log.description}</p>
                <p className="text-xs text-slate-500">{new Date(log.created_at).toLocaleString('es-VE')}</p>
              </div>
              <span className={`font-bold text-xl ${log.type === 'credit' || log.type === 'tip' ? 'text-emerald-400' : 'text-rose-400'}`}>
                {log.type === 'credit' || log.type === 'tip' ? '+' : '-'}${Math.abs(log.amount).toFixed(2)}
              </span>
            </div>
          ))}
          {logs.length === 0 && (
            <div className="text-center py-12 text-slate-500">No hay movimientos registrados</div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==================== INVENTORY PAGE ====================
function InventoryPage() {
  const { currentShop } = useApp();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadInventory(); }, [currentShop]);

  const loadInventory = async () => {
    if (!currentShop) return;
    setLoading(true);
    try {
      const res = await api.getInventory(currentShop.id);
      setInventory(res.data);
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="p-10 flex items-center justify-center h-96">
        <div className="w-14 h-14 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-10 space-y-10">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Inventario</h1>
        <p className="text-slate-400 mt-2 text-lg">{inventory.length} productos</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {inventory.map(item => (
          <div key={item.id} className={`${s.card} ${item.needs_alert ? 'border-amber-500/30' : ''} p-8 hover:bg-white/10 transition-all duration-300`}>
            {item.needs_alert && (
              <div className="flex items-center gap-2 text-amber-400 text-sm mb-5">
                <span>⚠</span>
                <span>Stock Bajo</span>
              </div>
            )}
            <h3 className="font-bold text-2xl mb-8">{item.name}</h3>
            <div className="space-y-5">
              <div className="flex justify-between">
                <span className="text-slate-400">Stock</span>
                <span className={`font-bold ${item.needs_alert ? 'text-amber-400' : ''}`}>{item.current_stock} {item.unit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Mínimo</span>
                <span>{item.min_stock} {item.unit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Costo Unit.</span>
                <span className="text-emerald-400 font-semibold">${item.cost_per_unit.toFixed(2)}</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden mt-6">
                <div className={`h-full transition-all ${item.needs_alert ? 'bg-amber-500' : 'bg-gradient-to-r from-violet-500 to-purple-500'}`}
                  style={{ width: `${Math.min((item.current_stock / item.min_stock) * 50, 100)}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== CASH BOX PAGE ====================
function CashBoxPage() {
  const { currentShop } = useApp();
  const [cashBox, setCashBox] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadCashBox(); }, [currentShop]);

  const loadCashBox = async () => {
    if (!currentShop) return;
    setLoading(true);
    try {
      const res = await api.openCashBox(currentShop.id);
      setCashBox(res.data);
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  const handleIncome = async (method) => {
    const amount = prompt(`Monto en ${method}:`);
    if (!amount) return;
    try {
      const res = await api.updateCashBox(currentShop.id, cashBox.id, {
        type: 'income',
        amount: parseFloat(amount),
        currency: 'USD',
        payment_method: method,
      });
      setCashBox(res.data);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleExpense = async () => {
    const amount = prompt('Monto del gasto (en Bs):');
    if (!amount) return;
    try {
      const res = await api.updateCashBox(currentShop.id, cashBox.id, {
        type: 'expense',
        amount: parseFloat(amount),
        currency: 'BS',
        category: 'other',
        description: prompt('Descripción del gasto:'),
      });
      setCashBox(res.data);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleClose = async () => {
    if (!confirm('¿Cerrar caja?')) return;
    try {
      const res = await api.closeCashBox(currentShop.id, cashBox.id);
      setCashBox(res.data);
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) {
    return (
      <div className="p-10 flex items-center justify-center h-96">
        <div className="w-14 h-14 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-10 space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Caja</h1>
          <p className="text-slate-400 mt-2 flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${cashBox?.status === 'OPEN' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`}></span>
            {cashBox?.status === 'OPEN' ? 'Caja Abierta' : 'Caja Cerrada'} • {cashBox?.date}
          </p>
        </div>
        {cashBox?.status === 'OPEN' && (
          <button onClick={handleClose} className={`${s.btn.primary} rounded-2xl px-8 py-5 font-semibold`}>
            Cerrar Caja
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {[
          { label: 'Efectivo USD', value: `$${(cashBox?.total_usd || 0).toFixed(2)}`, icon: '$' },
          { label: 'Efectivo Bs', value: `Bs. ${((cashBox?.total_bs || 0)).toLocaleString()}`, icon: 'B' },
          { label: 'Zelle', value: `$${(cashBox?.total_zelle || 0).toFixed(2)}`, icon: 'Z' },
          { label: 'Egresos', value: `Bs. ${((cashBox?.total_expenses || 0)).toLocaleString()}`, icon: '↓' },
        ].map((item, i) => (
          <div key={i} className={`${s.card} rounded-2xl p-6 text-center`}>
            <p className="text-sm text-slate-400 mb-3">{item.label}</p>
            <p className="text-2xl font-bold">{item.value}</p>
          </div>
        ))}
      </div>

      {cashBox?.status === 'OPEN' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {[
            { label: 'Efectivo USD', method: 'CASH_USD', icon: '$' },
            { label: 'Zelle', method: 'ZELLE', icon: 'Z' },
            { label: 'Pago Móvil', method: 'PAYMOBILE', icon: '◎' },
            { label: 'Gasto', method: 'EXPENSE', icon: '↓' },
          ].map((item, i) => (
            <button
              key={i}
              onClick={() => item.method === 'EXPENSE' ? handleExpense() : handleIncome(item.method)}
              className={`${s.card} p-8 text-center hover:bg-white/10 transition-all duration-300 cursor-pointer`}
            >
              <span className="text-4xl mb-3 block">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ==================== SETTINGS PAGE ====================
function SettingsPage() {
  const { currentShop, setCurrentShop } = useApp();
  const [bcvRate, setBcvRate] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentShop) setBcvRate(currentShop.bcv_rate_today.toString());
  }, [currentShop]);

  const handleUpdateBcv = async () => {
    setLoading(true);
    try {
      await api.updateBcvRate(currentShop.id, parseFloat(bcvRate));
      setCurrentShop({ ...currentShop, bcv_rate_today: parseFloat(bcvRate) });
      alert('Tasa BCV actualizada');
    } catch (error) {
      alert(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="p-10 space-y-10">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Configuración</h1>
        <p className="text-slate-400 mt-2 text-lg">Parámetros de la barbería</p>
      </div>

      <div className={`${s.card} rounded-3xl p-8 max-w-lg`}>
        <h2 className="text-xl font-semibold mb-6">Tasa BCV</h2>
        <div className="space-y-5">
          <div className="space-y-3">
            <label className="text-sm text-slate-400 ml-1">Tasa del Día (Bs por $1)</label>
            <input
              type="number"
              value={bcvRate}
              onChange={(e) => setBcvRate(e.target.value)}
              className={`w-full ${s.input} rounded-2xl py-5 text-3xl font-bold`}
            />
          </div>
          <button onClick={handleUpdateBcv} disabled={loading} className={`w-full ${s.btn.primary} rounded-2xl py-5 font-semibold`}>
            {loading ? 'Actualizando...' : 'Actualizar Tasa'}
          </button>
        </div>
      </div>

      <div className={`${s.card} rounded-3xl p-8 max-w-lg`}>
        <h2 className="text-xl font-semibold mb-6">Información de la Barbería</h2>
        <div className="space-y-4">
          {[
            { label: 'Nombre', value: currentShop?.name },
            { label: 'Dirección', value: currentShop?.address },
            { label: 'Teléfono', value: currentShop?.phone },
            { label: 'Día de Pago', value: currentShop?.pay_day },
          ].map((item, i) => (
            <div key={i} className="flex justify-between py-4 border-b border-white/5 last:border-0">
              <span className="text-slate-400">{item.label}</span>
              <span className="font-medium">{item.value || '-'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==================== APP ====================
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [shops, setShops] = useState([]);
  const [currentShop, setCurrentShop] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingSync, setPendingSync] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    loadInitialData();
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadInitialData = async () => {
    // NO auto-login - siempre mostrar login primero
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      // Try to login to backend
      await api.login(email, password);
      setUser({ id: 'user-1', name: 'Juan Pérez', email, role: 'OWNER' });
      setIsAuthenticated(true);
      
      // Try to get shops
      try {
        const shopsRes = await api.getBarbershops();
        setShops(shopsRes.data);
        if (shopsRes.data.length > 0) setCurrentShop(shopsRes.data[0]);
      } catch {
        // Use mock data if backend fails
        setShops([{
          id: 'shop-1',
          name: 'Barbería Central',
          address: 'Av. Libertador, Caracas',
          bcv_rate_today: 36.50,
          zelle_min: 5.00,
          pay_day: 'biweekly'
        }]);
        setCurrentShop({
          id: 'shop-1',
          name: 'Barbería Central',
          address: 'Av. Libertador, Caracas',
          bcv_rate_today: 36.50,
          zelle_min: 5.00,
          pay_day: 'biweekly'
        });
      }
      return true;
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-violet-500/50">
            <span className="text-white text-4xl">✂</span>
          </div>
          <p className="text-slate-500 text-lg">Cargando CHAIR-OS...</p>
        </div>
      </div>
    );
  }

  return (
    <AppContext.Provider value={{ user, shops, currentShop, setCurrentShop, isOnline, pendingSync, login, logout }}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
          <Route path="/*" element={isAuthenticated ? (
            <Layout>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/barbers" element={<BarbersPage />} />
                <Route path="/wallet" element={<WalletPage />} />
                <Route path="/cash-box" element={<CashBoxPage />} />
                <Route path="/inventory" element={<InventoryPage />} />
                <Route path="/customers" element={<div className="p-10"><h1 className="text-3xl font-bold">Clientes</h1><p className="text-slate-400 mt-3">Próximamente...</p></div>} />
                <Route path="/appointments" element={<div className="p-10"><h1 className="text-3xl font-bold">Citas</h1><p className="text-slate-400 mt-3">Próximamente...</p></div>} />
                <Route path="/settings" element={<SettingsPage />} />
              </Routes>
            </Layout>
          ) : <Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;
