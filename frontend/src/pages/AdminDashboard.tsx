import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  TrendingUp,
  Activity,
  Search,
  Bell,
  Sun,
  Moon,
  ChevronRight,
  Plus,
  FileText,
  CreditCard,
  Layers,
  Database,
  ArrowUpRight,
  Filter,
  Download,
  MoreHorizontal,
} from "lucide-react";
import { adminGet, adminPost, adminPut, clearAdminSession, getAdminSession } from "../lib/adminAuth";
import { Button } from "../components/ui/Button";
import AdminProductForm from "../components/admin/AdminProductForm";
import AdminCategoryManager from "../components/admin/AdminCategoryManager";
import AdminAnalytics from "../components/admin/AdminAnalytics";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const session = useMemo(() => getAdminSession(), []);
  const [loading, setLoading] = useState(true);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [overview, setOverview] = useState<{
    totals: { customers: number; orders: number; products: number; revenue: number };
    orderStatus: { pending: number; delivered: number };
  } | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (!session?.accessToken) {
      navigate("/admin");
      return;
    }

    const loadData = async () => {
      setLoading(true);
      try {
        const [overviewData, productsData, ordersData] = await Promise.all([
          adminGet<{
            totals: { customers: number; orders: number; products: number; revenue: number };
            orderStatus: { pending: number; delivered: number };
          }>("/api/admin/overview"),
          adminGet<{ items: any[] }>("/api/admin/products?page=1&pageSize=20"),
          adminGet<{ items: any[] }>("/api/admin/orders?page=1&pageSize=20"),
        ]);

        setOverview(overviewData);
        setProducts(productsData.items || []);
        setOrders(ordersData.items || []);
      } catch (loadError) {
        console.error(loadError instanceof Error ? loadError.message : "Failed to load admin data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigate, session?.accessToken]);

  const handleSaveProduct = async (data: any) => {
    try {
      if (editingProduct) {
        await adminPut(`/api/admin/products/${editingProduct.id}`, data);
      } else {
        await adminPost("/api/admin/products", data);
      }
      setIsProductModalOpen(false);
      setEditingProduct(null);
      const productsData = await adminGet<{ items: any[] }>("/api/admin/products?page=1&pageSize=20");
      setProducts(productsData.items || []);
    } catch (saveError) {
      console.error("Failed to save product:", saveError);
    }
  };

  const handleLogout = () => {
    clearAdminSession();
    localStorage.removeItem("is_admin");
    navigate("/admin");
  };

  const navItems = [
    { id: "dashboard", name: "Dashboard", icon: LayoutDashboard },
    { id: "products", name: "Products", icon: Package },
    { id: "category", name: "Category", icon: Layers },
    { id: "inventory", name: "Inventory", icon: Database },
    { id: "orders", name: "Orders", icon: ShoppingCart },
    { id: "purchases", name: "Purchases", icon: CreditCard },
    { id: "attributes", name: "Attributes", icon: Activity },
    { id: "invoices", name: "Invoices", icon: FileText },
    { id: "settings", name: "Settings", icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Revenue", value: `KSh ${overview?.totals.revenue.toLocaleString()}`, trend: "+12.5%", icon: TrendingUp, color: "text-green-500", bg: "bg-green-50" },
                { label: "Orders", value: String(overview?.totals.orders), trend: "+5.2%", icon: ShoppingCart, color: "text-blue-500", bg: "bg-blue-50" },
                { label: "Customers", value: String(overview?.totals.customers), trend: "+8.1%", icon: Users, color: "text-purple-500", bg: "bg-purple-50" },
                { label: "Products", value: String(overview?.totals.products), trend: "0.0%", icon: Package, color: "text-cta", bg: "bg-stone-50" },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-stone-100 group">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-9 h-9 ${stat.bg} rounded-xl flex items-center justify-center`}>
                      <stat.icon className={`w-4.5 h-4.5 ${stat.color}`} />
                    </div>
                    <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{stat.trend}</span>
                  </div>
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-0.5">{stat.label}</p>
                  <p className="text-xl font-bodoni font-bold text-stone-900">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <AdminAnalytics />
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bodoni font-bold text-stone-900">Recent Activity</h3>
                  <button className="text-cta text-[11px] font-bold hover:underline">View All</button>
                </div>
                <div className="space-y-5">
                  {orders.slice(0, 6).map((order) => (
                    <div key={order.id} className="flex items-center gap-3 group">
                      <div className="w-8 h-8 bg-stone-50 rounded-lg flex items-center justify-center shrink-0">
                        <ShoppingCart className="w-4 h-4 text-stone-400" />
                      </div>
                      <div className="flex-grow">
                        <p className="text-[13px] font-bold text-stone-900 leading-none">#{order.orderNumber}</p>
                        <p className="text-[10px] text-stone-400 font-medium mt-1">{order.customer?.name || "Guest"}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[13px] font-bold text-stone-900 leading-none">KSh {Number(order.totalAmount).toLocaleString()}</p>
                        <p className="text-[9px] text-green-600 font-bold uppercase tracking-widest mt-1">{order.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'products':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bodoni font-bold text-stone-900">Catalog Assets</h3>
                <p className="text-[11px] text-stone-400 font-medium">Manage and deploy product entities</p>
              </div>
              <Button onClick={() => setIsProductModalOpen(true)} variant="default" className="!rounded-xl gap-2 !px-6 !py-2.5 text-xs">
                <Plus className="w-4 h-4" /> 
                Deploy Asset
              </Button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-stone-50/50 border-b border-stone-100">
                      <th className="px-6 py-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Nomenclature</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Valuation</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Inventory</th>
                      <th className="px-6 py-4 text-right text-[10px] font-bold text-stone-400 uppercase tracking-widest">Command</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-50">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-stone-50/30 transition-colors group">
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-stone-50 rounded-xl border border-stone-100 flex items-center justify-center p-1.5 shrink-0">
                              <img src={product.imageUrls?.[0]} className="max-w-full max-h-full object-contain" />
                            </div>
                            <div>
                              <p className="text-[13px] font-bold text-stone-900">{product.name}</p>
                              <p className="text-[10px] text-stone-400 font-medium">{product.category?.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-3">
                          <p className="text-[13px] font-bold text-stone-900">KSh {Number(product.price).toLocaleString()}</p>
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${product.stockQuantity > 5 ? 'bg-green-500' : 'bg-red-500'}`} />
                            <span className="text-[12px] font-bold text-stone-700">{product.stockQuantity}</span>
                          </div>
                        </td>
                        <td className="px-6 py-3 text-right">
                          <button 
                            onClick={() => { setEditingProduct(product); setIsProductModalOpen(true); }}
                            className="w-8 h-8 bg-white border border-stone-100 rounded-lg flex items-center justify-center text-stone-400 hover:text-cta transition-all"
                          >
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'category':
        return <AdminCategoryManager />;

      case 'inventory':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bodoni font-bold text-stone-900">Warehouse Depth</h3>
                <p className="text-[11px] text-stone-400 font-medium">Real-time stock monitoring</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="!rounded-xl border-stone-100 text-stone-400 bg-white !px-4 !py-2 text-[11px]">
                  <Filter className="w-3.5 h-3.5 mr-2" /> Filter
                </Button>
                <Button variant="default" className="!rounded-xl !px-4 !py-2 text-[11px]">
                  <Download className="w-3.5 h-3.5 mr-2" /> Export
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <div key={product.id} className="bg-white p-5 rounded-2xl border border-stone-100 shadow-sm group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-stone-50 rounded-lg flex items-center justify-center p-1.5">
                      <img src={product.imageUrls?.[0]} className="max-w-full max-h-full object-contain" />
                    </div>
                    <div className={`w-2 h-2 rounded-full ${product.stockQuantity > 10 ? 'bg-green-500' : 'bg-red-500'}`} />
                  </div>
                  <h4 className="text-[13px] font-bold text-stone-900 mb-4 truncate">{product.name}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-stone-400">Level</span>
                      <span className="text-stone-900">{product.stockQuantity}</span>
                    </div>
                    <div className="w-full h-1.5 bg-stone-50 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${product.stockQuantity > 10 ? 'bg-green-500' : 'bg-red-500'}`} 
                        style={{ width: `${Math.min((product.stockQuantity / 50) * 100, 100)}%` }} 
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'orders':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bodoni font-bold text-stone-900">Fulfillment System</h3>
              <div className="flex gap-2 bg-white p-1 rounded-xl border border-stone-100">
                {['All', 'Pending', 'Delivered'].map(s => (
                  <button key={s} className="px-4 py-1.5 rounded-lg text-[10px] font-bold hover:bg-stone-50">
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-stone-50/50 border-b border-stone-100">
                    <th className="px-6 py-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Reference</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Customer</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Value</th>
                    <th className="px-6 py-4 text-right text-[10px] font-bold text-stone-400 uppercase tracking-widest">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-stone-50/30">
                      <td className="px-6 py-4">
                        <p className="text-[13px] font-bold text-stone-900 leading-none">{order.orderNumber}</p>
                        <p className="text-[9px] text-stone-400 font-bold mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-[13px] font-bold text-stone-700">{order.customer?.name || "Guest"}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-bold border ${
                          order.status === "DELIVERED" ? "bg-green-50 text-green-600 border-green-100" : "bg-cta/5 text-cta border-cta/10"
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-[13px] font-bold text-stone-900">KSh {Number(order.totalAmount).toLocaleString()}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="w-8 h-8 flex items-center justify-center text-stone-300 hover:text-stone-900">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'invoices':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bodoni font-bold text-stone-900">Financial Records</h3>
            <div className="grid grid-cols-1 gap-3">
              {orders.map((order) => (
                <div key={order.id} className="bg-white p-5 rounded-2xl border border-stone-100 flex items-center justify-between hover:shadow-sm group">
                  <div className="flex items-center gap-6">
                    <div className="w-10 h-10 bg-stone-50 rounded-xl flex items-center justify-center text-stone-400">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-0.5">Reference</p>
                      <p className="text-[14px] font-bold text-stone-900">INV-{order.orderNumber}</p>
                    </div>
                    <div className="w-px h-8 bg-stone-100" />
                    <div>
                      <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-0.5">Entity</p>
                      <p className="text-[14px] font-bold text-stone-900">{order.customer?.name || "Guest"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-0.5">Amount</p>
                      <p className="text-[14px] font-bold text-cta">KSh {Number(order.totalAmount).toLocaleString()}</p>
                    </div>
                    <button className="bg-stone-900 text-white w-9 h-9 rounded-xl flex items-center justify-center">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100">
              <h3 className="text-xl font-bodoni font-bold text-stone-900 mb-6">System Architecture</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Global Currency</label>
                  <select className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 text-xs font-bold text-stone-900 outline-none">
                    <option>KES (Kenyan Shilling)</option>
                    <option>USD (US Dollar)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Theme</label>
                  <div className="flex gap-2">
                    <button className="flex-grow flex items-center justify-center gap-2 px-4 py-3 bg-stone-900 text-white rounded-xl text-xs font-bold">
                      <Moon className="w-3.5 h-3.5" /> Dark
                    </button>
                    <button className="flex-grow flex items-center justify-center gap-2 px-4 py-3 bg-white border border-stone-200 text-stone-900 rounded-xl text-xs font-bold">
                      <Sun className="w-3.5 h-3.5" /> Light
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl border-4 border-white shadow-lg overflow-hidden bg-stone-50">
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&h=150&auto=format&fit=crop" />
              </div>
              <div className="flex-grow">
                <p className="text-lg font-bold text-stone-900">Darina Savanna</p>
                <p className="text-xs text-stone-400 font-medium">Head of Operations</p>
                <button className="text-cta text-[11px] font-bold border-b border-cta/20 pb-0.5 hover:border-cta mt-2">Change Passcode</button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7FF] flex font-jost text-stone-800 overflow-hidden">
      <AnimatePresence>
        {isProductModalOpen && (
          <AdminProductForm 
            product={editingProduct} 
            onClose={() => {
              setIsProductModalOpen(false);
              setEditingProduct(null);
            }} 
            onSave={handleSaveProduct} 
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Scaled Down */}
      <aside className="w-64 h-screen sticky top-0 shrink-0 p-6 flex flex-col gap-8 z-50 bg-white/40 backdrop-blur-xl border-r border-white/50">
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 bg-white rounded-xl shadow-lg flex items-center justify-center">
            <div className="w-5 h-5 bg-cta/10 rounded-lg flex items-center justify-center">
              <div className="w-2 h-2 bg-cta rounded-sm" />
            </div>
          </div>
          <h2 className="text-xl font-bodoni font-bold text-stone-900 tracking-tight">
            Lexron<span className="text-cta">.</span>
          </h2>
        </div>

        <div className="flex flex-col gap-1.5 flex-grow overflow-y-auto no-scrollbar pr-1">
          <p className="text-[9px] font-bold text-stone-400 uppercase tracking-[0.2em] px-4 mb-1">General</p>
          <nav className="space-y-0.5">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all relative group ${
                  activeTab === item.id 
                    ? 'text-white' 
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                {activeTab === item.id && (
                  <motion.div 
                    layoutId="active-pill"
                    className="absolute inset-0 bg-stone-900 shadow-md rounded-xl -z-10"
                  />
                )}
                <item.icon className={`w-4.5 h-4.5 ${activeTab === item.id ? 'text-white' : 'text-stone-400 group-hover:text-cta'}`} />
                <span className="tracking-tight">{item.name}</span>
                {(item.id === 'products' || item.id === 'orders') && activeTab !== item.id && (
                  <ChevronRight className="w-3.5 h-3.5 ml-auto text-stone-300" />
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="pt-4 border-t border-white/50">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-semibold text-stone-500 hover:text-red-500 transition-all group"
          >
            <LogOut className="w-4.5 h-4.5 text-stone-400 group-hover:text-red-500" />
            <span>System Exit</span>
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <main className="flex-grow flex flex-col h-screen overflow-hidden">
        {/* Header - Scaled Down */}
        <header className="h-16 flex items-center justify-between px-8 shrink-0 bg-white/40 backdrop-blur-md border-b border-white/50">
          <h1 className="text-xl font-bodoni font-bold text-stone-900">
            Welcome back!
          </h1>
          
          <div className="flex items-center gap-6">
            <div className="relative group hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
              <input 
                type="text" 
                placeholder="Search system..." 
                className="bg-white border border-stone-100 rounded-xl pl-9 pr-4 py-2 text-[12px] font-medium outline-none focus:border-cta/20 w-64 transition-all shadow-sm" 
              />
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 bg-white rounded-xl p-1 shadow-sm border border-stone-100">
                <button className="w-7 h-7 flex items-center justify-center text-stone-400 hover:text-stone-900 transition-colors">
                  <Bell className="w-4 h-4" />
                </button>
                <div className="w-px h-3 bg-stone-100 mx-0.5" />
                <button className="w-7 h-7 flex items-center justify-center bg-stone-50 text-stone-900 rounded-lg">
                  <Sun className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-3 pl-4 border-l border-stone-200">
                <div className="text-right hidden md:block">
                  <p className="text-[12px] font-bold text-stone-900 leading-tight">Darina</p>
                  <p className="text-[10px] text-stone-400 font-medium">Admin</p>
                </div>
                <div className="w-9 h-9 bg-white rounded-xl border-2 border-white shadow-lg overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&h=150&auto=format&fit=crop" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area - Scaled Down */}
        <div className="flex-grow overflow-y-auto px-8 py-6 custom-scrollbar bg-stone-50/10">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 border-2 border-cta border-t-transparent rounded-full"
              />
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="pb-8"
            >
              {renderContent()}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
