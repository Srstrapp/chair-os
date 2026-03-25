import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { api } from './services/api';

// Icons
import { 
  LayoutDashboard, 
  Scissors, 
  Users, 
  Package, 
  DollarSign, 
  Wallet, 
  Calendar, 
  Receipt, 
  Settings,
  LogOut,
  Menu,
  X,
  TrendingUp,
  AlertCircle,
  Clock,
  ChevronRight,
  Plus,
  RefreshCw
} from 'lucide-react';

// Context
const AppContext = createContext();

const useApp = () => useContext(AppContext);

// ==================== LAYOUT ====================

function Layout({ children }) {
  const { currentShop, shops, isOnline, pendingSync } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/services', icon: Scissors, label: 'Servicios' },
    { path: '/barbers', icon: Users, label: 'Barberos' },
    { path: '/wallet', icon: Wallet, label: 'Wallet' },
    { path: '/cash-box', icon: DollarSign, label: 'Caja' },
    { path: '/inventory', icon: Package, label: 'Inventario' },
    { path: '/customers', icon: Users, label: 'Clientes' },
    { path: '/appointments', icon: Calendar, label: 'Citas' },
    { path: '/settings', icon: Settings, label: 'Configuración' },
  ];

  const NavLink = ({ to, icon: Icon, label }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        onClick={() => setSidebarOpen(false)}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
          isActive 
            ? 'bg-accent/20 text-accent' 
            : 'text-gray-400 hover:text-white hover:bg-white/5'
        }`}
      >
        <Icon size={20} />
        <span className="font-medium">{label}</span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-dark flex">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-primary transform transition-transform duration-200 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center">
                  <Scissors className="text-white" size={20} />
                </div>
                <div>
                  <h1 className="font-bold text-lg">CHAIR-OS</h1>
                  <p className="text-xs text-gray-400">Sistema Operativo</p>
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Shop Selector */}
          {shops.length > 1 && (
            <div className="p-4 border-b border-white/10">
              <select 
                className="w-full text-sm"
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

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map(item => (
              <NavLink key={item.path} {...item} />
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              {!isOnline && (
                <span className="flex items-center gap-1 text-warning">
                  <span className="w-2 h-2 bg-warning rounded-full animate-pulse"></span>
                  Offline
                </span>
              )}
              {pendingSync > 0 && (
                <span className="flex items-center gap-1 text-accent">
                  <RefreshCw size={14} className="animate-spin" />
                  {pendingSync} pendientes
                </span>
              )}
            </div>
            <button className="mt-3 flex items-center gap-3 text-gray-400 hover:text-white w-full px-4 py-2 rounded-lg hover:bg-white/5 transition-colors">
              <LogOut size={20} />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed bottom-4 left-4 z-40 w-12 h-12 bg-accent rounded-full flex items-center justify-center shadow-lg"
      >
        <Menu size={24} />
      </button>

      {/* Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 min-h-screen overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}

// ==================== PAGES ====================

// Dashboard Page
function DashboardPage() {
  const { currentShop } = useApp();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentShop) {
      loadDashboard();
    }
  }, [currentShop]);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const data = await api.getDashboard(currentShop.id);
      setDashboard(data.data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <RefreshCw className="animate-spin text-accent" size={32} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-400">{currentShop?.name}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400">Tasa BCV</p>
          <p className="text-xl font-bold text-success">Bs. {dashboard?.bcv_rate?.toLocaleString()}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Servicios Hoy"
          value={dashboard?.today?.services_count || 0}
          icon={Scissors}
          color="accent"
        />
        <StatCard
          title="Ventas Hoy"
          value={`$${dashboard?.today?.total_sales_usd?.toFixed(2) || '0.00'}`}
          icon={TrendingUp}
          color="success"
        />
        <StatCard
          title="Tus Ganancias"
          value={`$${dashboard?.today?.owner_earnings?.toFixed(2) || '0.00'}`}
          icon={DollarSign}
          color="warning"
        />
        <StatCard
          title="Propinas"
          value={`$${dashboard?.today?.tips_total?.toFixed(2) || '0.00'}`}
          icon={Wallet}
          color="primary"
        />
      </div>

      {/* Barbers Performance */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Rendimiento de Barberos</h2>
        </div>
        <div className="space-y-3">
          {dashboard?.barbers?.map(barber => (
            <div key={barber.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                  <span className="text-accent font-semibold">
                    {barber.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="font-medium">{barber.name}</p>
                  <p className="text-xs text-gray-400">
                    {barber.today_services} servicios hoy
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-success">
                  ${barber.wallet_balance?.toFixed(2)}
                </p>
                <p className="text-xs text-gray-400">
                  {barber.commission_type.replace('_', '/')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Low Stock Alert */}
      {dashboard?.low_stock_items?.length > 0 && (
        <div className="card border-l-4 border-warning">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="text-warning" size={20} />
            <h2 className="text-lg font-semibold">Stock Bajo</h2>
          </div>
          <div className="space-y-2">
            {dashboard.low_stock_items.map(item => (
              <div key={item.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <span>{item.name}</span>
                <span className="text-warning font-medium">
                  {item.current_stock} / {item.min_stock} {item.unit}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Appointments */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Próximas Citas</h2>
          <Link to="/appointments" className="text-accent text-sm hover:underline">
            Ver todas
          </Link>
        </div>
        {dashboard?.upcoming_appointments?.length > 0 ? (
          <div className="space-y-3">
            {dashboard.upcoming_appointments.map(apt => (
              <div key={apt.id} className="flex items-center gap-4 p-3 bg-secondary rounded-lg">
                <div className="text-center bg-primary rounded-lg p-2 min-w-[60px]">
                  <p className="text-xs text-gray-400">{apt.date.split('-')[2]}</p>
                  <p className="text-lg font-bold">{apt.time}</p>
                </div>
                <div className="flex-1">
                  <p className="font-medium">{apt.customer_name}</p>
                  <p className="text-sm text-gray-400">
                    {apt.barber_name} • {apt.service_type}
                  </p>
                </div>
                <span className={`badge ${apt.status === 'confirmed' ? 'badge-success' : 'badge-warning'}`}>
                  {apt.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-4">No hay citas programadas</p>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }) {
  const colorMap = {
    accent: 'bg-accent/20 text-accent',
    success: 'bg-success/20 text-success',
    warning: 'bg-warning/20 text-warning',
    primary: 'bg-primary text-white',
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-400">{title}</span>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorMap[color]}`}>
          <Icon size={20} />
        </div>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

// Services Page
function ServicesPage() {
  const { currentShop } = useApp();
  const [services, setServices] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [customers, setCustomers] = useState([]);
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

  useEffect(() => {
    loadData();
  }, [currentShop]);

  const loadData = async () => {
    if (!currentShop) return;
    setLoading(true);
    try {
      const [servicesRes, barbersRes, customersRes] = await Promise.all([
        api.getServices(currentShop.id),
        api.getBarbers(currentShop.id),
        api.getCustomers(currentShop.id),
      ]);
      setServices(servicesRes.data);
      setBarbers(barbersRes.data);
      setCustomers(customersRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createService(currentShop.id, formData);
      setShowForm(false);
      setFormData({
        barber_id: '',
        customer_name: '',
        customer_phone: '',
        service_type: 'Corte Fade',
        amount_total: 15,
        payment_method: 'CASH_USD',
        tip_amount: 0,
      });
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

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Servicios</h1>
          <p className="text-gray-400">{services.length} servicios registrados</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary"
        >
          <Plus size={20} />
          Nuevo Servicio
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-primary rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Registrar Servicio</h2>
              <button onClick={() => setShowForm(false)}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Barbero</label>
                <select
                  value={formData.barber_id}
                  onChange={(e) => setFormData({...formData, barber_id: e.target.value})}
                  required
                >
                  <option value="">Seleccionar barbero</option>
                  {barbers.map(b => (
                    <option key={b.id} value={b.id}>{b.name} ({b.commission_type})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Cliente</label>
                  <input
                    type="text"
                    placeholder="Nombre"
                    value={formData.customer_name}
                    onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Teléfono</label>
                  <input
                    type="text"
                    placeholder="+58412..."
                    value={formData.customer_phone}
                    onChange={(e) => setFormData({...formData, customer_phone: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Servicio</label>
                  <select
                    value={formData.service_type}
                    onChange={(e) => setFormData({...formData, service_type: e.target.value})}
                  >
                    <option value="Corte">Corte</option>
                    <option value="Corte Fade">Corte Fade</option>
                    <option value="Barba">Barba</option>
                    <option value="Corte + Barba">Corte + Barba</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Monto ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount_total}
                    onChange={(e) => setFormData({...formData, amount_total: parseFloat(e.target.value)})}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Método de Pago</label>
                  <select
                    value={formData.payment_method}
                    onChange={(e) => setFormData({...formData, payment_method: e.target.value})}
                  >
                    {Object.entries(paymentMethods).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Propina ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.tip_amount}
                    onChange={(e) => setFormData({...formData, tip_amount: parseFloat(e.target.value) || 0})}
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary w-full">
                Registrar Servicio
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Services List */}
      <div className="space-y-3">
        {services.map(service => (
          <div key={service.id} className="card flex items-center gap-4">
            <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
              <Scissors className="text-accent" size={20} />
            </div>
            <div className="flex-1">
              <p className="font-medium">{service.service_type}</p>
              <p className="text-sm text-gray-400">
                {service.barber_name} • {service.customer_name}
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-success">${service.amount_total.toFixed(2)}</p>
              <p className="text-xs text-gray-400">{paymentMethods[service.payment_method]}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">
                {new Date(service.created_at).toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' })}
              </p>
              <span className={`badge ${service.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                {service.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Barbers Page
function BarbersPage() {
  const { currentShop } = useApp();
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBarbers();
  }, [currentShop]);

  const loadBarbers = async () => {
    if (!currentShop) return;
    setLoading(true);
    try {
      const res = await api.getBarbers(currentShop.id);
      setBarbers(res.data);
    } catch (error) {
      console.error('Error loading barbers:', error);
    }
    setLoading(false);
  };

  const commissionLabels = {
    '50_50': { label: '50/50', desc: 'Barbero pone productos' },
    '60_40': { label: '60/40', desc: 'Local provee productos' },
    'salary': { label: 'Asalariado', desc: 'Sueldo fijo' },
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Barberos</h1>
          <p className="text-gray-400">{barbers.length} barberos activos</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={20} />
          Agregar Barbero
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {barbers.map(barber => (
          <div key={barber.id} className="card">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-accent/20 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-accent">
                  {barber.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <p className="font-semibold text-lg">{barber.name}</p>
                <p className="text-sm text-gray-400">{barber.phone}</p>
              </div>
            </div>
            <div className="flex items-center justify-between py-3 border-t border-white/10">
              <span className="text-gray-400">Tipo</span>
              <span className={`badge ${barber.commission_type === 'salary' ? 'badge-warning' : 'badge-success'}`}>
                {commissionLabels[barber.commission_type]?.label}
              </span>
            </div>
            <div className="flex items-center justify-between py-3 border-t border-white/10">
              <span className="text-gray-400">Wallet</span>
              <span className="font-bold text-success">${barber.wallet_balance?.toFixed(2)}</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {commissionLabels[barber.commission_type]?.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Wallet Page
function WalletPage() {
  const { currentShop } = useApp();
  const [barbers, setBarbers] = useState([]);
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBarbers();
  }, [currentShop]);

  useEffect(() => {
    if (selectedBarber) {
      loadWallet();
    }
  }, [selectedBarber]);

  const loadBarbers = async () => {
    if (!currentShop) return;
    setLoading(true);
    try {
      const res = await api.getBarbers(currentShop.id);
      setBarbers(res.data);
      if (res.data.length > 0) {
        setSelectedBarber(res.data[0]);
      }
    } catch (error) {
      console.error('Error loading barbers:', error);
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
      console.error('Error loading wallet:', error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Wallet</h1>
        <p className="text-gray-400">Gestión de ganancias de barberos</p>
      </div>

      {/* Barber Selector */}
      <div className="card">
        <label className="block text-sm text-gray-400 mb-2">Seleccionar Barbero</label>
        <select
          value={selectedBarber?.id || ''}
          onChange={(e) => {
            const barber = barbers.find(b => b.id === e.target.value);
            setSelectedBarber(barber);
          }}
        >
          {barbers.map(b => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
      </div>

      {/* Wallet Balance */}
      {wallet && (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="card bg-gradient-to-br from-success/20 to-success/5 border border-success/20">
            <p className="text-sm text-gray-400 mb-1">Balance USD</p>
            <p className="text-4xl font-bold text-success">${wallet.balance_usd?.toFixed(2)}</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-400 mb-1">Balance Bs</p>
            <p className="text-4xl font-bold">Bs. {wallet.balance_bs?.toLocaleString()}</p>
          </div>
        </div>
      )}

      {/* Logs */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Historial de Movimientos</h2>
        <div className="space-y-3">
          {logs.map(log => (
            <div key={log.id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  log.type === 'credit' ? 'bg-success/20 text-success' :
                  log.type === 'debit' ? 'bg-accent/20 text-accent' :
                  log.type === 'tip' ? 'bg-warning/20 text-warning' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {log.type === 'credit' ? '+' : log.type === 'debit' ? '-' : log.type === 'tip' ? '💰' : '💸'}
                </div>
                <div>
                  <p className="font-medium">{log.description}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(log.created_at).toLocaleString('es-VE')}
                  </p>
                </div>
              </div>
              <span className={`font-bold ${
                log.type === 'credit' || log.type === 'tip' ? 'text-success' : 'text-accent'
              }`}>
                {log.type === 'credit' || log.type === 'tip' ? '+' : '-'}${Math.abs(log.amount).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Inventory Page
function InventoryPage() {
  const { currentShop } = useApp();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInventory();
  }, [currentShop]);

  const loadInventory = async () => {
    if (!currentShop) return;
    setLoading(true);
    try {
      const res = await api.getInventory(currentShop.id);
      setInventory(res.data);
    } catch (error) {
      console.error('Error loading inventory:', error);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Inventario</h1>
          <p className="text-gray-400">{inventory.length} productos</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={20} />
          Agregar Producto
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {inventory.map(item => (
          <div key={item.id} className={`card ${item.needs_alert ? 'border-l-4 border-warning' : ''}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">{item.name}</h3>
              {item.needs_alert && (
                <span className="badge badge-warning">Stock Bajo</span>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Stock Actual</span>
                <span className={`font-bold ${item.needs_alert ? 'text-warning' : 'text-white'}`}>
                  {item.current_stock} {item.unit}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Stock Mínimo</span>
                <span className="text-gray-300">{item.min_stock} {item.unit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Costo Unitario</span>
                <span className="text-success">${item.cost_per_unit.toFixed(2)}</span>
              </div>
            </div>
            {/* Progress bar */}
            <div className="mt-4 h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all ${item.needs_alert ? 'bg-warning' : 'bg-success'}`}
                style={{ width: `${Math.min((item.current_stock / item.min_stock) * 50, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Cash Box Page
function CashBoxPage() {
  const { currentShop } = useApp();
  const [cashBox, setCashBox] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCashBox();
  }, [currentShop]);

  const loadCashBox = async () => {
    if (!currentShop) return;
    setLoading(true);
    try {
      const res = await api.openCashBox(currentShop.id);
      setCashBox(res.data);
    } catch (error) {
      console.error('Error loading cash box:', error);
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
        currency: method === 'EFECTIVO' ? 'USD' : 'USD',
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
    const description = prompt('Descripción del gasto:');
    
    try {
      const res = await api.updateCashBox(currentShop.id, cashBox.id, {
        type: 'expense',
        amount: parseFloat(amount),
        currency: 'BS',
        category: 'other',
        description,
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
      <div className="p-6 flex items-center justify-center h-64">
        <RefreshCw className="animate-spin text-accent" size={32} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Caja</h1>
          <p className="text-gray-400">
            {cashBox?.status === 'OPEN' ? (
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-success rounded-full animate-pulse"></span>
                Caja Abierta • {cashBox?.date}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
                Caja Cerrada • {cashBox?.date}
              </span>
            )}
          </p>
        </div>
        {cashBox?.status === 'OPEN' && (
          <button onClick={handleClose} className="btn btn-accent">
            Cerrar Caja
          </button>
        )}
      </div>

      {/* Totals */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <p className="text-sm text-gray-400 mb-1">Efectivo USD</p>
          <p className="text-2xl font-bold">${cashBox?.total_usd?.toFixed(2) || '0.00'}</p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-gray-400 mb-1">Efectivo Bs</p>
          <p className="text-2xl font-bold">Bs. {(cashBox?.total_bs || 0).toLocaleString()}</p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-gray-400 mb-1">Zelle</p>
          <p className="text-2xl font-bold text-success">${cashBox?.total_zelle?.toFixed(2) || '0.00'}</p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-gray-400 mb-1">Egresos</p>
          <p className="text-2xl font-bold text-accent">Bs. {(cashBox?.total_expenses || 0).toLocaleString()}</p>
        </div>
      </div>

      {/* Actions */}
      {cashBox?.status === 'OPEN' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button onClick={() => handleIncome('CASH_USD')} className="btn btn-secondary">
            + Efectivo USD
          </button>
          <button onClick={() => handleIncome('ZELLE')} className="btn btn-secondary">
            + Zelle
          </button>
          <button onClick={() => handleIncome('PAYMOBILE')} className="btn btn-secondary">
            + Pago Móvil
          </button>
          <button onClick={handleExpense} className="btn btn-secondary text-accent">
            + Gasto
          </button>
        </div>
      )}
    </div>
  );
}

// Settings Page
function SettingsPage() {
  const { currentShop, setCurrentShop } = useApp();
  const [bcvRate, setBcvRate] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentShop) {
      setBcvRate(currentShop.bcv_rate_today.toString());
    }
  }, [currentShop]);

  const handleUpdateBcv = async () => {
    setLoading(true);
    try {
      const res = await api.updateBcvRate(currentShop.id, parseFloat(bcvRate));
      setCurrentShop({ ...currentShop, bcv_rate_today: parseFloat(bcvRate) });
      alert('Tasa BCV actualizada');
    } catch (error) {
      alert(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Configuración</h1>
        <p className="text-gray-400">Parámetros de la barbería</p>
      </div>

      <div className="card max-w-md">
        <h2 className="text-lg font-semibold mb-4">Tasa BCV</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Tasa del Día (Bs por $1)</label>
            <input
              type="number"
              value={bcvRate}
              onChange={(e) => setBcvRate(e.target.value)}
            />
          </div>
          <button 
            onClick={handleUpdateBcv} 
            disabled={loading}
            className="btn btn-primary w-full"
          >
            {loading ? 'Actualizando...' : 'Actualizar Tasa'}
          </button>
        </div>
      </div>

      <div className="card max-w-md">
        <h2 className="text-lg font-semibold mb-4">Información de la Barbería</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Nombre</label>
            <input type="text" value={currentShop?.name || ''} disabled />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Dirección</label>
            <input type="text" value={currentShop?.address || ''} disabled />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Teléfono</label>
            <input type="text" value={currentShop?.phone || ''} disabled />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Día de Pago</label>
            <input type="text" value={currentShop?.pay_day || ''} disabled />
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== APP ====================

function App() {
  const [shops, setShops] = useState([]);
  const [currentShop, setCurrentShop] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingSync, setPendingSync] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for online/offline
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load initial data
    loadInitialData();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadInitialData = async () => {
    try {
      const res = await api.getBarbershops();
      setShops(res.data);
      if (res.data.length > 0) {
        setCurrentShop(res.data[0]);
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Scissors className="text-white" size={32} />
          </div>
          <p className="text-gray-400">Cargando CHAIR-OS...</p>
        </div>
      </div>
    );
  }

  return (
    <AppContext.Provider value={{
      shops,
      currentShop,
      setCurrentShop,
      isOnline,
      pendingSync,
    }}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/barbers" element={<BarbersPage />} />
            <Route path="/wallet" element={<WalletPage />} />
            <Route path="/cash-box" element={<CashBoxPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/customers" element={<div className="p-6"><h1 className="text-2xl font-bold">Clientes</h1></div>} />
            <Route path="/appointments" element={<div className="p-6"><h1 className="text-2xl font-bold">Citas</h1></div>} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;
