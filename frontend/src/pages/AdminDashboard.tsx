import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  Search,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  Bell,
  Tag,
  Star,
  Shield,
  Camera,
  Key,
  BarChart3,
  Warehouse,
  FolderTree,
} from "lucide-react";
import {
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
import OverviewPanel from "../components/admin/dash/OverviewPanel";
import ProductsPanel from "../components/admin/dash/ProductsPanel";
import OrdersPanel from "../components/admin/dash/OrdersPanel";
import CustomersPanel from "../components/admin/dash/CustomersPanel";
import InventoryPanel from "../components/admin/dash/InventoryPanel";
import AnalyticsPanel from "../components/admin/dash/AnalyticsPanel";
import PromotionsPanel from "../components/admin/dash/PromotionsPanel";
import ReviewsPanel from "../components/admin/dash/ReviewsPanel";
import SettingsPanel from "../components/admin/dash/SettingsPanel";
import StaffPanel from "../components/admin/dash/StaffPanel";

type NavId =
  | "dashboard"
  | "products"
  | "categories"
  | "orders"
  | "customers"
  | "inventory"
  | "analytics"
  | "promotions"
  | "reviews"
  | "staff"
  | "settings";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<NavId>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const session = useMemo(() => getAdminSession(), []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [searchQ, setSearchQ] = useState("");
  const [searchResults, setSearchResults] = useState<any>(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [revenuePeriod, setRevenuePeriod] = useState<"today" | "week" | "month" | "all">("month");
  const [chartGranularity, setChartGranularity] = useState<"daily" | "weekly" | "monthly">("daily");
  const [analytics, setAnalytics] = useState<any>(null);
  const [orderDetailFromOverview, setOrderDetailFromOverview] = useState<number | null>(null);

  const [adminProfile, setAdminProfile] = useState(() => {
    const saved = localStorage.getItem("delight_admin_profile");
    if (saved) return JSON.parse(saved);
    return {
      name: session?.admin?.name || "Admin User",
      email: session?.admin?.email || "admin@delight-tech.com",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=delight",
      role: (session as any)?.admin?.role || "Manager",
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

  const [overview, setOverview] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  const refreshCore = useCallback(async () => {
    const [overviewData, productsData, ordersData, categoriesData, customersData, analyticsData] = await Promise.all([
      adminGet<any>("/api/admin/overview"),
      adminGet<{ items: any[] }>("/api/admin/products?page=1&pageSize=200"),
      adminGet<{ items: any[] }>("/api/admin/orders?page=1&pageSize=100"),
      adminGet<any[]>("/api/admin/categories"),
      adminGet<{ items: any[] }>("/api/admin/customers?page=1&pageSize=100"),
      adminGet<any>("/api/admin/analytics?range=30d").catch(() => null),
    ]);
    setOverview(overviewData);
    setProducts(productsData.items || []);
    setOrders(ordersData.items || []);
    setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    setCustomers(customersData.items || []);
    setAnalytics(analyticsData);
  }, []);

  useEffect(() => {
    if (!session?.accessToken) {
      navigate("/admin");
      return;
    }
    (async () => {
      setLoading(true);
      setError("");
      try {
        await refreshCore();
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Failed to load admin data");
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate, session?.accessToken, refreshCore]);

  useEffect(() => {
    const t = setTimeout(async () => {
      const q = searchQ.trim();
      if (q.length < 2) {
        setSearchResults(null);
        return;
      }
      try {
        const res = await adminGet<any>(`/api/admin/search?q=${encodeURIComponent(q)}`);
        setSearchResults(res);
      } catch {
        setSearchResults(null);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [searchQ]);

  const handleSaveProduct = async (data: any) => {
    try {
      if (editingProduct) {
        await adminPut(`/api/admin/products/${editingProduct.id}`, data);
      } else {
        await adminPost("/api/admin/products", data);
      }
      setIsProductModalOpen(false);
      setEditingProduct(null);
      await refreshCore();
    } catch (saveError) {
      console.error("Failed to save product:", saveError);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutAdmin();
    } catch {
      /* ignore */
    } finally {
      clearAdminSession();
      localStorage.removeItem("is_admin");
      navigate("/admin");
    }
  };

  const pendingOrders = overview?.orderStatus?.pending ?? 0;
  const pendingReviews = overview?.badges?.pendingReviews ?? 0;

  const navItems: { id: NavId; name: string; icon: typeof LayoutDashboard; badge?: number }[] = [
    { id: "dashboard", name: "Dashboard", icon: LayoutDashboard },
    { id: "products", name: "Products", icon: Package },
    { id: "categories", name: "Categories", icon: FolderTree },
    { id: "orders", name: "Orders", icon: ShoppingCart, badge: pendingOrders },
    { id: "customers", name: "Customers", icon: Users },
    { id: "inventory", name: "Inventory", icon: Warehouse },
    { id: "analytics", name: "Analytics", icon: BarChart3 },
    { id: "promotions", name: "Promotions", icon: Tag },
    { id: "reviews", name: "Reviews", icon: Star, badge: pendingReviews },
    { id: "staff", name: "Staff / Admins", icon: Shield },
    { id: "settings", name: "Settings", icon: Settings },
  ];

  const clearOrderJump = useCallback(() => setOrderDetailFromOverview(null), []);

  const shell = `${isDarkMode ? "bg-black text-zinc-200" : "bg-zinc-50 text-zinc-900"} min-h-screen flex font-jost transition-colors`;

  return (
    <div className={shell}>
      <AnimatePresence>
        {isProductModalOpen && (
          <AdminProductForm
            product={editingProduct}
            categories={categories}
            onClose={() => {
              setIsProductModalOpen(false);
              setEditingProduct(null);
            }}
            onSave={handleSaveProduct}
          />
        )}
      </AnimatePresence>

      <aside
        className={`${sidebarCollapsed ? "w-[72px]" : "w-64"} shrink-0 h-screen sticky top-0 flex flex-col border-r transition-all ${
          isDarkMode ? "bg-zinc-950 border-zinc-800" : "bg-white border-zinc-100"
        }`}
      >
        <div className={`flex items-center gap-2 p-4 ${sidebarCollapsed ? "justify-center" : "px-5"}`}>
          <div className="w-9 h-9 bg-black dark:bg-zinc-900 rounded-lg flex items-center justify-center shrink-0">
            <div className="w-2 h-2 bg-cta rounded-sm" />
          </div>
          {!sidebarCollapsed && (
            <h2 className={`text-lg font-bodoni font-bold tracking-tight ${isDarkMode ? "text-white" : "text-black"}`}>
              Delight<span className="text-cta"> Admin</span>
            </h2>
          )}
        </div>
        <button
          type="button"
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="mx-3 mb-2 flex items-center justify-center h-9 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-black dark:hover:text-white"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        >
          {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
        <nav className="flex flex-col gap-0.5 flex-grow overflow-y-auto px-2 pb-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              title={sidebarCollapsed ? item.name : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-bold transition-all relative ${
                activeTab === item.id
                  ? "text-white"
                  : isDarkMode
                    ? "text-zinc-500 hover:text-white"
                    : "text-zinc-500 hover:text-black"
              } ${sidebarCollapsed ? "justify-center" : ""}`}
            >
              {activeTab === item.id && (
                <motion.div layoutId="nav-pill" className="absolute inset-0 bg-black dark:bg-cta rounded-lg -z-10" />
              )}
              <item.icon className={`w-4 h-4 shrink-0 ${activeTab === item.id ? "text-white dark:text-black" : ""}`} />
              {!sidebarCollapsed && <span className="truncate">{item.name}</span>}
              {!sidebarCollapsed && item.badge != null && item.badge > 0 && (
                <span className="ml-auto text-[10px] font-bold bg-red-600 text-white rounded-full min-w-[20px] px-1.5 py-0.5">
                  {item.badge > 99 ? "99+" : item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className={`p-3 border-t ${isDarkMode ? "border-zinc-800" : "border-zinc-100"}`}>
          <button
            type="button"
            onClick={handleLogout}
            className={`w-full flex items-center gap-2 rounded-lg py-2.5 text-[13px] font-bold text-zinc-500 hover:text-red-600 ${
              sidebarCollapsed ? "justify-center" : "px-3"
            }`}
          >
            <LogOut className="w-4 h-4" />
            {!sidebarCollapsed && "Log out"}
          </button>
        </div>
      </aside>

      <main className="flex-grow flex flex-col min-h-screen min-w-0">
        <header
          className={`h-14 md:h-16 flex items-center justify-between px-4 md:px-8 shrink-0 border-b ${
            isDarkMode ? "bg-black border-zinc-800" : "bg-white border-zinc-100"
          }`}
        >
          <h1 className={`text-lg md:text-xl font-bodoni font-bold truncate ${isDarkMode ? "text-white" : "text-black"}`}>
            {navItems.find((n) => n.id === activeTab)?.name}
          </h1>
          <div className="flex items-center gap-2 md:gap-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
              <input
                type="search"
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
                placeholder="Search products, orders, customers…"
                className={`rounded-lg pl-9 pr-3 py-2 text-[12px] font-semibold outline-none w-48 lg:w-72 border ${
                  isDarkMode ? "bg-zinc-900 border-zinc-800 text-white" : "bg-zinc-50 border-zinc-200 text-black"
                }`}
              />
              {searchResults && (searchResults.products?.length || searchResults.orders?.length || searchResults.customers?.length) ? (
                <div
                  className={`absolute top-full left-0 mt-1 w-full max-h-72 overflow-y-auto rounded-xl border shadow-lg z-50 ${
                    isDarkMode ? "bg-zinc-950 border-zinc-800" : "bg-white border-zinc-200"
                  }`}
                >
                  {searchResults.products?.length > 0 && (
                    <div className="p-2 border-b border-zinc-100 dark:border-zinc-800">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase px-2">Products</p>
                      {searchResults.products.map((p: any) => (
                        <button
                          key={p.id}
                          type="button"
                          className="w-full text-left px-2 py-1.5 rounded-lg text-[12px] font-bold hover:bg-zinc-100 dark:hover:bg-zinc-900"
                          onClick={() => {
                            setActiveTab("products");
                            setSearchQ("");
                            setSearchResults(null);
                          }}
                        >
                          {p.name}
                        </button>
                      ))}
                    </div>
                  )}
                  {searchResults.orders?.length > 0 && (
                    <div className="p-2 border-b border-zinc-100 dark:border-zinc-800">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase px-2">Orders</p>
                      {searchResults.orders.map((o: any) => (
                        <button
                          key={o.id}
                          type="button"
                          className="w-full text-left px-2 py-1.5 rounded-lg text-[12px] font-bold hover:bg-zinc-100 dark:hover:bg-zinc-900"
                          onClick={() => {
                            setActiveTab("orders");
                            setOrderDetailFromOverview(o.id);
                            setSearchQ("");
                            setSearchResults(null);
                          }}
                        >
                          #{o.orderNumber} — {o.customerName}
                        </button>
                      ))}
                    </div>
                  )}
                  {searchResults.customers?.length > 0 && (
                    <div className="p-2">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase px-2">Customers</p>
                      {searchResults.customers.map((c: any) => (
                        <button
                          key={c.id}
                          type="button"
                          className="w-full text-left px-2 py-1.5 rounded-lg text-[12px] font-bold hover:bg-zinc-100 dark:hover:bg-zinc-900"
                          onClick={() => {
                            setActiveTab("customers");
                            setSearchQ("");
                            setSearchResults(null);
                          }}
                        >
                          {c.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            <button
              type="button"
              aria-label="Toggle theme"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`w-9 h-9 rounded-lg flex items-center justify-center border ${
                isDarkMode ? "border-zinc-800 bg-zinc-900 text-yellow-400" : "border-zinc-200 bg-zinc-50 text-zinc-600"
              }`}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <div className="relative">
              <button
                type="button"
                className={`w-9 h-9 rounded-lg flex items-center justify-center border relative ${
                  isDarkMode ? "border-zinc-800 bg-zinc-900" : "border-zinc-200 bg-zinc-50"
                }`}
                onClick={() => setNotifOpen(!notifOpen)}
              >
                <Bell className="w-4 h-4" />
                {(pendingOrders > 0 || (overview?.totals?.lowStockAlerts ?? 0) > 0 || pendingReviews > 0) && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>
              {notifOpen && (
                <div
                  className={`absolute right-0 mt-2 w-72 rounded-xl border shadow-xl z-50 p-3 ${
                    isDarkMode ? "bg-zinc-950 border-zinc-800" : "bg-white border-zinc-200"
                  }`}
                >
                  <p className="text-[10px] font-bold text-zinc-400 uppercase mb-2">Notifications</p>
                  <ul className="text-[12px] space-y-2 font-semibold">
                    <li>{pendingOrders} pending orders</li>
                    <li>{overview?.totals?.lowStockAlerts ?? 0} low stock SKUs</li>
                    <li>{pendingReviews} reviews awaiting moderation</li>
                  </ul>
                </div>
              )}
            </div>

            <div className="relative flex items-center gap-2 pl-2 border-l border-zinc-200 dark:border-zinc-800">
              <button type="button" className="flex items-center gap-2" onClick={() => setProfileOpen(!profileOpen)}>
                <img src={adminProfile.avatar} alt="" className="w-9 h-9 rounded-lg object-cover border border-zinc-200 dark:border-zinc-800" />
              </button>
              {profileOpen && (
                <div
                  className={`absolute right-0 top-full mt-2 w-48 rounded-xl border shadow-xl z-50 py-1 ${
                    isDarkMode ? "bg-zinc-950 border-zinc-800" : "bg-white border-zinc-200"
                  }`}
                >
                  <button
                    type="button"
                    className="w-full text-left px-4 py-2 text-[12px] font-bold hover:bg-zinc-100 dark:hover:bg-zinc-900"
                    onClick={() => {
                      setProfileOpen(false);
                      setActiveTab("settings");
                    }}
                  >
                    Profile & settings
                  </button>
                  <button
                    type="button"
                    className="w-full text-left px-4 py-2 text-[12px] font-bold hover:bg-zinc-100 dark:hover:bg-zinc-900"
                    onClick={handleLogout}
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="flex-grow overflow-y-auto px-4 md:px-8 py-6">
          {loading ? (
            <div className="flex items-center justify-center min-h-[40vh]">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 border-2 border-cta border-t-transparent rounded-full"
              />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4 text-center">
              <p className="text-red-600 font-bold">{error}</p>
              <Button onClick={() => window.location.reload()} variant="outline">
                Retry
              </Button>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="max-w-[1600px] mx-auto pb-16">
              {activeTab === "dashboard" && (
                <OverviewPanel
                  isDarkMode={isDarkMode}
                  revenuePeriod={revenuePeriod}
                  setRevenuePeriod={setRevenuePeriod}
                  chartGranularity={chartGranularity}
                  setChartGranularity={setChartGranularity}
                  overview={overview}
                  analytics={analytics}
                  orders={orders}
                  customers={customers}
                  onViewOrder={(id) => {
                    setActiveTab("orders");
                    setOrderDetailFromOverview(id);
                  }}
                />
              )}
              {activeTab === "products" && (
                <ProductsPanel
                  isDarkMode={isDarkMode}
                  products={products}
                  setProducts={setProducts}
                  categories={categories}
                  onAdd={() => {
                    setEditingProduct(null);
                    setIsProductModalOpen(true);
                  }}
                  onEdit={(p) => {
                    setEditingProduct(p);
                    setIsProductModalOpen(true);
                  }}
                />
              )}
              {activeTab === "categories" && <AdminCategoryManager />}
              {activeTab === "orders" && (
                <OrdersPanel
                  isDarkMode={isDarkMode}
                  orders={orders}
                  setOrders={setOrders}
                  initialDetailId={orderDetailFromOverview}
                  onClearInitialDetail={clearOrderJump}
                />
              )}
              {activeTab === "customers" && (
                <CustomersPanel isDarkMode={isDarkMode} customers={customers} setCustomers={setCustomers} />
              )}
              {activeTab === "inventory" && (
                <InventoryPanel isDarkMode={isDarkMode} products={products} setProducts={setProducts} />
              )}
              {activeTab === "analytics" && <AnalyticsPanel isDarkMode={isDarkMode} />}
              {activeTab === "promotions" && <PromotionsPanel isDarkMode={isDarkMode} />}
              {activeTab === "reviews" && <ReviewsPanel isDarkMode={isDarkMode} />}
              {activeTab === "staff" && <StaffPanel isDarkMode={isDarkMode} />}
              {activeTab === "settings" && (
                <div className="space-y-10">
                  <SettingsPanel isDarkMode={isDarkMode} />
                  <div className={`rounded-xl border p-8 max-w-4xl ${isDarkMode ? "bg-zinc-950 border-zinc-800" : "bg-white border-zinc-100"}`}>
                    <h3 className="text-xl font-bodoni font-bold mb-6 uppercase tracking-tight">Admin profile</h3>
                    <div className="flex flex-col md:flex-row gap-8">
                      <div className="relative">
                        <img src={adminProfile.avatar} alt="" className="w-28 h-28 rounded-xl object-cover border-4 border-zinc-100 dark:border-zinc-800" />
                        <input type="file" id="av" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                        <label
                          htmlFor="av"
                          className="absolute -bottom-1 -right-1 w-9 h-9 bg-black text-white rounded-lg flex items-center justify-center cursor-pointer"
                        >
                          <Camera className="w-4 h-4" />
                        </label>
                      </div>
                      <div className="flex-grow space-y-4 max-w-md">
                        <div>
                          <label className="text-[10px] font-bold text-zinc-400 uppercase">Name</label>
                          <input
                            className="w-full border rounded-lg px-3 py-2 font-bold mt-1"
                            value={adminProfile.name}
                            onChange={(e) => setAdminProfile({ ...adminProfile, name: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-zinc-400 uppercase">Email</label>
                          <input className="w-full border rounded-lg px-3 py-2 font-bold mt-1 opacity-60" value={adminProfile.email} disabled />
                        </div>
                        <p className="text-[12px] text-zinc-500 flex items-center gap-2">
                          <Key className="w-4 h-4" /> Password changes require backend support.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
