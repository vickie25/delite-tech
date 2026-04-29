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
  Sun,
  Moon,
  Plus,
  FileText,
  CreditCard,
  Layers,
  Database,
  ArrowUpRight,
  Shield,
  Camera,
  Key,
} from "lucide-react";
import {
  adminDelete,
  adminGet,
  adminPost,
  adminPut,
  clearAdminSession,
  getAdminSession,
  logoutAdmin,
} from "../lib/adminAuth";
import { Button } from "../components/ui/Button";
import AdminProductForm from "../components/admin/AdminProductForm";
import AdminCategoryManager from "../components/admin/AdminCategoryManager";
import AdminAnalytics from "../components/admin/AdminAnalytics";
import AdminAttributes from "../components/admin/AdminAttributes";
import AdminInvoices from "../components/admin/AdminInvoices";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const session = useMemo(() => getAdminSession(), []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  // Admin Profile State with Persistence
  const [adminProfile, setAdminProfile] = useState(() => {
    const saved = localStorage.getItem("delight_admin_profile");
    if (saved) return JSON.parse(saved);
    return {
      name: session?.admin?.name || "Admin User",
      email: session?.admin?.email || "admin@delight-tech.com",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=delight", // Modern default
      role: "System Architect"
    };
  });

  useEffect(() => {
    localStorage.setItem("delight_admin_profile", JSON.stringify(adminProfile));
  }, [adminProfile]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAdminProfile((prev: any) => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const [overview, setOverview] = useState<{
    totals: { customers: number; orders: number; products: number; revenue: number };
    orderStatus: { pending: number; delivered: number };
  } | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    if (!session?.accessToken) {
      navigate("/admin");
      return;
    }

    const loadData = async () => {
      setLoading(true);
      setError("");
      try {
        const [overviewData, productsData, ordersData, categoriesData] = await Promise.all([
          adminGet<any>("/api/admin/overview"),
          adminGet<{ items: any[] }>("/api/admin/products?page=1&pageSize=20"),
          adminGet<{ items: any[] }>("/api/admin/orders?page=1&pageSize=20"),
          adminGet<any[]>("/api/admin/categories"),
        ]);

        setOverview(overviewData);
        setProducts(productsData.items || []);
        setOrders(ordersData.items || []);
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        // Purchases are successfully paid orders
        setPurchases((ordersData.items || []).filter((o: any) => o.status === "DELIVERED" || o.paymentStatus === "PAID"));
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Failed to load Delight Admin data");
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

  const handleDeleteProduct = async (productId: number) => {
    try {
      await adminDelete(`/api/admin/products/${productId}`);
      const productsData = await adminGet<{ items: any[] }>("/api/admin/products?page=1&pageSize=20");
      setProducts(productsData.items || []);
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Failed to delete product");
    }
  };

  const handleLogout = async () => {
    try {
      await logoutAdmin();
    } catch (_logoutError) {
      // Always clear local admin state on logout attempt.
    } finally {
      clearAdminSession();
      localStorage.removeItem("is_admin");
      navigate("/admin");
    }
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Revenue", value: `KSh ${(overview?.totals?.revenue || 0).toLocaleString()}`, trend: "+12.5%", icon: TrendingUp, color: "text-green-600", bg: "bg-zinc-50 dark:bg-zinc-800" },
                { label: "Orders", value: String(overview?.totals?.orders || 0), trend: "+5.2%", icon: ShoppingCart, color: "text-zinc-600 dark:text-zinc-400", bg: "bg-zinc-50 dark:bg-zinc-800" },
                { label: "Customers", value: String(overview?.totals?.customers || 0), trend: "+8.1%", icon: Users, color: "text-zinc-600 dark:text-zinc-400", bg: "bg-zinc-50 dark:bg-zinc-800" },
                { label: "Products", value: String(overview?.totals?.products || 0), trend: "0.0%", icon: Package, color: "text-cta", bg: "bg-zinc-50 dark:bg-zinc-800" },
              ].map((stat, i) => (
                <div key={i} className="bg-white dark:bg-zinc-900 p-5 rounded-lg border border-zinc-100 dark:border-zinc-800 group shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-9 h-9 ${stat.bg} rounded-lg flex items-center justify-center`}>
                      <stat.icon className={`w-4.5 h-4.5 ${stat.color}`} />
                    </div>
                    <span className="text-[10px] font-bold text-green-600 bg-green-50 dark:bg-green-500/10 px-2 py-0.5 rounded-lg">{stat.trend}</span>
                  </div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-0.5">{stat.label}</p>
                  <p className="text-xl font-bodoni font-bold text-black dark:text-white">{stat.value}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <AdminAnalytics darkMode={isDarkMode} />
              </div>
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-zinc-100 dark:border-zinc-800 shadow-sm">
                <h3 className="text-lg font-bodoni font-bold text-black dark:text-white mb-6 uppercase tracking-tight">System Activity</h3>
                <div className="space-y-5">
                  {orders.slice(0, 6).map((order) => (
                    <div key={order.id} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-zinc-50 dark:bg-zinc-800 rounded-lg flex items-center justify-center shrink-0">
                        <ShoppingCart className="w-4 h-4 text-zinc-400" />
                      </div>
                      <div className="flex-grow">
                        <p className="text-[13px] font-bold text-black dark:text-white leading-none">#{order.orderNumber}</p>
                        <p className="text-[10px] text-zinc-400 mt-1 uppercase font-bold">{order.customer?.name || "Guest"}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[13px] font-bold text-black dark:text-white leading-none">KSh {Number(order.totalAmount).toLocaleString()}</p>
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
                <h3 className="text-xl font-bodoni font-bold text-stone-900 dark:text-white">Catalog Assets</h3>
                <p className="text-[11px] text-stone-400">Inventory Sync Active</p>
              </div>
              <Button onClick={() => setIsProductModalOpen(true)} variant="default" className="!rounded-xl gap-2 !px-6 !py-2.5 text-xs">
                <Plus className="w-4 h-4" /> Deploy Asset
              </Button>
            </div>
            <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-800 overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-stone-50/50 dark:bg-stone-800/50 border-b border-stone-100 dark:border-stone-800">
                    <th className="px-6 py-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Nomenclature</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Valuation</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Inventory</th>
                    <th className="px-6 py-4 text-right text-[10px] font-bold text-stone-400 uppercase tracking-widest">Command</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50 dark:divide-stone-800">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-stone-50/30 dark:hover:bg-stone-800/30">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-4">
                          <img src={product.imageUrls?.[0]} className="w-10 h-10 object-contain bg-stone-50 dark:bg-stone-800 rounded-lg p-1.5" />
                          <div>
                            <p className="text-[13px] font-bold text-stone-900 dark:text-white">{product.name}</p>
                            <p className="text-[10px] text-stone-400">{product.category?.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <p className="text-[13px] font-bold text-stone-900 dark:text-white">KSh {Number(product.price).toLocaleString()}</p>
                      </td>
                      <td className="px-6 py-3">
                        <span className={`text-[12px] font-bold ${product.stockQuantity < 5 ? 'text-red-500' : 'text-stone-700 dark:text-stone-300'}`}>
                          {product.stockQuantity} Units
                        </span>
                      </td>
                      <td className="px-6 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => { setEditingProduct(product); setIsProductModalOpen(true); }} className="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-cta"><ArrowUpRight className="w-4 h-4" /></button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-red-600"
                            aria-label={`Delete ${product.name}`}
                          >
                            <LogOut className="w-4 h-4 rotate-180" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'category': return <AdminCategoryManager />;
      case 'inventory':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bodoni font-bold text-stone-900 dark:text-white">Real-time Stock Depth</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {products.map(p => (
                <div key={p.id} className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-100 dark:border-stone-800">
                   <div className="flex justify-between items-start mb-4">
                     <p className="text-[13px] font-bold text-stone-900 dark:text-white truncate pr-2">{p.name}</p>
                     <div className={`w-2 h-2 rounded-full ${p.stockQuantity > 10 ? 'bg-green-500' : 'bg-red-500'}`} />
                   </div>
                   <div className="flex justify-between text-[11px] font-bold mb-2">
                     <span className="text-stone-400">Available</span>
                     <span className="text-stone-900 dark:text-white">{p.stockQuantity}</span>
                   </div>
                   <div className="w-full h-1.5 bg-stone-50 dark:bg-stone-800 rounded-full overflow-hidden">
                     <div className={`h-full ${p.stockQuantity > 10 ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${Math.min((p.stockQuantity/50)*100, 100)}%` }} />
                   </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'orders': return (
        <div className="space-y-6">
          <h3 className="text-xl font-bodoni font-bold text-stone-900 dark:text-white">Order Manifest</h3>
          <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-800 overflow-hidden">
             <table className="w-full text-left">
                <thead>
                  <tr className="bg-stone-50/50 dark:bg-stone-800/50 border-b border-stone-100 dark:border-stone-800">
                    <th className="px-6 py-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest">ID</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Customer</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50 dark:divide-stone-800">
                  {orders.map(o => (
                    <tr key={o.id}>
                      <td className="px-6 py-4 text-[13px] font-bold dark:text-white">#{o.orderNumber}</td>
                      <td className="px-6 py-4 text-[13px] dark:text-stone-300">{o.customer?.name}</td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold border bg-cta/5 text-cta border-cta/10">{o.status}</span>
                      </td>
                      <td className="px-6 py-4 text-[13px] font-bold dark:text-white">KSh {Number(o.totalAmount).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
             </table>
          </div>
        </div>
      );

      case 'purchases': 
        const totalRevenue = purchases.reduce((acc, p) => acc + Number(p.totalAmount), 0);
        const avgTransaction = purchases.length > 0 ? totalRevenue / purchases.length : 0;

        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bodoni font-bold text-black dark:text-white uppercase tracking-tight">Revenue Ledger</h3>
                <p className="text-[11px] text-zinc-400 font-bold uppercase mt-1">Verified payment transactions</p>
              </div>
              <div className="flex gap-4">
                <div className="text-right">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Total Liquidity</p>
                  <p className="text-lg font-bold text-black dark:text-white">KSh {totalRevenue.toLocaleString()}</p>
                </div>
                <div className="w-px h-10 bg-zinc-100 dark:bg-zinc-800" />
                <div className="text-right">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Avg Ticket</p>
                  <p className="text-lg font-bold text-black dark:text-white">KSh {avgTransaction.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {purchases.length === 0 ? (
                <div className="p-20 border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-lg text-center">
                  <CreditCard className="w-10 h-10 text-zinc-200 mx-auto mb-4" />
                  <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest">No Verified Transactions Detected</p>
                </div>
              ) : (
                purchases.map(p => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={p.id} 
                    className="bg-white dark:bg-zinc-900 p-5 rounded-lg border border-zinc-100 dark:border-zinc-800 flex items-center justify-between group hover:border-black dark:hover:border-cta transition-all"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 bg-zinc-50 dark:bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-400 group-hover:text-cta transition-colors">
                        <Shield className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-[14px] font-bold text-black dark:text-white uppercase tracking-tight">Transaction #{p.orderNumber}</p>
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-green-50 dark:bg-green-500/10 text-green-600 border border-green-100 dark:border-green-500/20 uppercase tracking-widest">Verified</span>
                        </div>
                        <p className="text-[10px] text-zinc-400 font-bold uppercase mt-1">
                          {new Date(p.createdAt).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })} at {new Date(p.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-12">
                      <div className="text-right hidden md:block">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Customer Entity</p>
                        <p className="text-[12px] font-bold text-black dark:text-white">{p.customer?.name || "Anonymous Client"}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Settlement</p>
                        <p className="text-lg font-bold text-cta">KSh {Number(p.totalAmount).toLocaleString()}</p>
                      </div>
                      <button className="w-10 h-10 rounded-lg bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:bg-black hover:text-white dark:hover:bg-cta dark:hover:text-black transition-all">
                        <FileText className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        );

      case 'attributes': return <AdminAttributes darkMode={isDarkMode} />;
      case 'invoices': return <AdminInvoices darkMode={isDarkMode} orders={orders} />;

      case 'settings':
        return (
          <div className="max-w-4xl mx-auto space-y-8 pb-20">
            {/* Profile Section */}
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-lg border border-zinc-100 dark:border-zinc-800 shadow-sm">
              <h3 className="text-xl font-bodoni font-bold text-black dark:text-white mb-8 uppercase tracking-tight">Admin Profile</h3>
              <div className="flex flex-col md:flex-row items-center gap-10">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-lg border-4 border-zinc-50 dark:border-zinc-800 shadow-xl overflow-hidden bg-zinc-100">
                    <img src={adminProfile.avatar} className="w-full h-full object-cover" />
                  </div>
                  <input 
                    type="file" 
                    id="avatar-upload" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                  <label 
                    htmlFor="avatar-upload"
                    className="absolute -bottom-2 -right-2 w-10 h-10 bg-black text-white rounded-lg shadow-xl flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
                  >
                    <Camera className="w-5 h-5" />
                  </label>
                </div>
                <div className="flex-grow space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Full Designation</label>
                      <input 
                        type="text" 
                        value={adminProfile.name}
                        onChange={(e) => setAdminProfile({...adminProfile, name: e.target.value})}
                        className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 rounded-lg px-4 py-3 text-sm font-bold text-black dark:text-white outline-none focus:border-black dark:focus:border-cta" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Email Endpoint</label>
                      <input 
                        type="email" 
                        value={adminProfile.email}
                        className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 rounded-lg px-4 py-3 text-sm font-bold text-zinc-400 outline-none cursor-not-allowed" 
                        disabled
                      />
                    </div>
                  </div>
                  <Button variant="default" className="!rounded-lg !px-10">Sync Profile</Button>
                </div>
              </div>
            </div>

            {/* Security Section */}
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-lg border border-zinc-100 dark:border-zinc-800 shadow-sm">
              <h3 className="text-xl font-bodoni font-bold text-black dark:text-white mb-8 flex items-center gap-3 uppercase tracking-tight">
                <Shield className="w-6 h-6 text-black dark:text-cta" /> Security Protocols
              </h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Current Passcode</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 rounded-lg px-4 py-3 text-sm font-bold text-black dark:text-white outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">New Passcode</label>
                    <input type="password" placeholder="New passcode" className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 rounded-lg px-4 py-3 text-sm font-bold text-black dark:text-white outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Verify Passcode</label>
                    <input type="password" placeholder="Verify passcode" className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 rounded-lg px-4 py-3 text-sm font-bold text-black dark:text-white outline-none" />
                  </div>
                </div>
                <Button variant="default" className="!rounded-lg !px-10 gap-2"><Key className="w-4 h-4" /> Update Passcode</Button>
              </div>
            </div>

            {/* Global Prefs */}
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-lg border border-zinc-100 dark:border-zinc-800 shadow-sm">
              <h3 className="text-xl font-bodoni font-bold text-black dark:text-white mb-6 uppercase tracking-tight">System Appearance</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                   <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Visual Mode</p>
                   <div className="flex gap-2">
                      <button 
                        onClick={() => setIsDarkMode(true)}
                        className={`flex-grow flex items-center justify-center gap-3 px-6 py-3 rounded-lg text-sm font-bold transition-all ${isDarkMode ? 'bg-black text-white' : 'bg-zinc-100 text-zinc-400'}`}
                      >
                        <Moon className="w-4 h-4" /> Dark
                      </button>
                      <button 
                        onClick={() => setIsDarkMode(false)}
                        className={`flex-grow flex items-center justify-center gap-3 px-6 py-3 rounded-lg text-sm font-bold transition-all ${!isDarkMode ? 'bg-black text-white' : 'bg-zinc-100 text-zinc-400'}`}
                      >
                        <Sun className="w-4 h-4" /> Light
                      </button>
                   </div>
                </div>
                <div className="space-y-4">
                   <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Inventory Alerts</p>
                   <div className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-800 p-4 rounded-lg">
                      <span className="text-sm font-bold text-black dark:text-white">Low Stock Notifications</span>
                      <div className="w-10 h-5 bg-cta rounded-full relative"><div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm" /></div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        );

      default: return null;
    }
  };

  return (
    <div className={`min-h-screen flex font-jost transition-colors duration-300 ${isDarkMode ? 'bg-black text-zinc-200' : 'bg-white text-zinc-900'}`}>
      <AnimatePresence>
        {isProductModalOpen && (
          <AdminProductForm 
            product={editingProduct} 
            categories={categories}
            onClose={() => { setIsProductModalOpen(false); setEditingProduct(null); }} 
            onSave={handleSaveProduct} 
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Delight Admin */}
      <aside className={`w-64 h-screen sticky top-0 shrink-0 p-6 flex flex-col gap-8 z-50 transition-all border-r ${isDarkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-100'}`}>
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 bg-black dark:bg-zinc-900 rounded-lg shadow-xl flex items-center justify-center">
             <div className="w-5 h-5 bg-cta/10 rounded-sm flex items-center justify-center">
                <div className="w-2 h-2 bg-cta rounded-sm shadow-[0_0_10px_rgba(202,138,4,0.5)]" />
             </div>
          </div>
          <h2 className={`text-xl font-bodoni font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-black'}`}>
            Delight<span className="text-cta"> Admin</span>
          </h2>
        </div>

        <nav className="flex flex-col gap-1 flex-grow overflow-y-auto no-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-[13px] font-bold transition-all relative group ${
                activeTab === item.id ? 'text-white' : 'text-zinc-500 hover:text-black dark:hover:text-white'
              }`}
            >
              {activeTab === item.id && (
                <motion.div layoutId="active-pill" className="absolute inset-0 bg-black dark:bg-cta rounded-lg -z-10" />
              )}
              <item.icon className={`w-4.5 h-4.5 ${activeTab === item.id ? 'text-white' : 'text-zinc-400 group-hover:text-cta'}`} />
              <span>{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[13px] font-bold text-zinc-400 hover:text-red-600 transition-all"><LogOut className="w-4.5 h-4.5" /> Exit System</button>
        </div>
      </aside>

      {/* Main Container */}
      <main className="flex-grow flex flex-col h-screen overflow-hidden">
        <header className={`h-16 flex items-center justify-between px-8 shrink-0 transition-all border-b ${isDarkMode ? 'bg-black border-zinc-800' : 'bg-white border-zinc-100'}`}>
          <div className="flex items-center gap-3">
             <h1 className={`text-xl font-bodoni font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>Protocol: {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative group hidden xl:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
              <input type="text" placeholder="Search system..." className={`rounded-lg pl-9 pr-4 py-2 text-[12px] font-bold outline-none w-64 transition-all ${isDarkMode ? 'bg-zinc-900 text-white border-zinc-800' : 'bg-zinc-50 border-zinc-100'}`} />
            </div>
            
            <div className="flex items-center gap-4">
              <button onClick={() => setIsDarkMode(!isDarkMode)} className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${isDarkMode ? 'bg-zinc-900 text-yellow-400' : 'bg-zinc-100 text-zinc-400'}`}>
                {isDarkMode ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
              </button>

              <div className="flex items-center gap-3 pl-4 border-l border-zinc-100 dark:border-zinc-800">
                <div className="text-right hidden sm:block">
                  <p className={`text-[12px] font-bold leading-none ${isDarkMode ? 'text-white' : 'text-black'}`}>{adminProfile.name}</p>
                  <p className="text-[9px] text-zinc-400 font-bold uppercase mt-1">{adminProfile.role}</p>
                </div>
                <div className="w-9 h-9 rounded-lg border border-zinc-100 dark:border-zinc-800 overflow-hidden shadow-sm">
                  <img src={adminProfile.avatar} className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-grow overflow-y-auto px-8 py-8 custom-scrollbar">
          {loading ? (
             <div className="flex items-center justify-center h-full">
               <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-8 h-8 border-2 border-cta border-t-transparent rounded-full" />
             </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center text-red-500">
                <Activity className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bodoni font-bold text-black dark:text-white">Protocol Failure</h3>
                <p className="text-xs text-zinc-400 font-bold max-w-xs mx-auto">{error}</p>
              </div>
              <Button onClick={() => window.location.reload()} variant="outline" className="!rounded-lg !px-8 text-xs">Retry</Button>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="pb-20">
              {renderContent()}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
