import { useMemo, useState } from "react";
import { Plus, Trash2, ArrowUpRight, Search, Download } from "lucide-react";
import { Button } from "../../ui/Button";
import { adminDelete, adminGet, adminPost } from "../../../lib/adminAuth";

type Props = {
  isDarkMode: boolean;
  products: any[];
  setProducts: (p: any[]) => void;
  categories: any[];
  onAdd: () => void;
  onEdit: (p: any) => void;
};

/* categories reserved for future dynamic filters */

const SUBCATEGORY_FILTERS = [
  { label: "All", value: "" },
  { label: "Laptops", value: "cat:Laptops" },
  { label: "Android Phones", value: "sub:Samsung" },
  { label: "iPhones", value: "sub:iPhone" },
  { label: "Budget Phones", value: "sub:Tecno" },
  { label: "Refurbished Phones", value: "sub:Huawei" },
  { label: "Foldable Phones", value: "subfold:Samsung" },
  { label: "Accessories", value: "cat:Accessories" },
];

export default function ProductsPanel({ isDarkMode, products, setProducts, categories: _categories, onAdd, onEdit }: Props) {
  const [catFilter, setCatFilter] = useState("");
  const [brandQ, setBrandQ] = useState("");
  const [stockF, setStockF] = useState("");
  const [minP, setMinP] = useState("");
  const [maxP, setMaxP] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);

  const filtered = useMemo(() => {
    let list = [...products];
    if (catFilter.startsWith("cat:")) list = list.filter((p) => p.category?.name === catFilter.slice(4));
    else if (catFilter.startsWith("subfold:")) {
      list = list.filter(
        (p) => p.category?.name === "Phones" && p.subcategory?.name === "Samsung" && /fold|flip|z fold/i.test(p.name || ""),
      );
    } else if (catFilter.startsWith("sub:")) list = list.filter((p) => p.subcategory?.name === catFilter.slice(4));
    if (brandQ.trim()) list = list.filter((p) => p.brand?.toLowerCase().includes(brandQ.toLowerCase()));
    if (stockF === "out") list = list.filter((p) => p.stockQuantity <= 0);
    if (stockF === "low") list = list.filter((p) => p.stockQuantity > 0 && p.stockQuantity <= (p.reorderLevel ?? 5));
    if (stockF === "in") list = list.filter((p) => p.stockQuantity > (p.reorderLevel ?? 5));
    const min = Number(minP);
    const max = Number(maxP);
    if (Number.isFinite(min)) list = list.filter((p) => Number(p.price) >= min);
    if (Number.isFinite(max)) list = list.filter((p) => Number(p.price) <= max);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name?.toLowerCase().includes(q) || p.brand?.toLowerCase().includes(q));
    }
    return list;
  }, [products, catFilter, brandQ, stockF, minP, maxP, search]);

  const toggle = (id: number) => {
    const n = new Set(selected);
    if (n.has(id)) n.delete(id);
    else n.add(id);
    setSelected(n);
  };

  const statusLabel = (p: any) => {
    if (p.status === "DRAFT") return "Draft";
    if (p.stockQuantity <= 0) return "Out of Stock";
    return "Active";
  };

  const reload = async () => {
    const data = await adminGet<{ items: any[] }>("/api/admin/products?page=1&pageSize=200");
    setProducts(data.items || []);
  };

  const bulkDelete = async () => {
    if (!selected.size || !confirm(`Delete ${selected.size} products?`)) return;
    setLoading(true);
    try {
      await adminPost("/api/admin/products/bulk", { ids: [...selected], delete: true });
      setSelected(new Set());
      await reload();
    } finally {
      setLoading(false);
    }
  };

  const bulkStatus = async (status: "DRAFT" | "PUBLISHED") => {
    if (!selected.size) return;
    setLoading(true);
    try {
      await adminPost("/api/admin/products/bulk", { ids: [...selected], status });
      setSelected(new Set());
      await reload();
    } finally {
      setLoading(false);
    }
  };

  const exportCsv = () => {
    const rows = [
      ["id", "name", "category", "brand", "price", "stock", "status"].join(","),
      ...filtered.map((p) =>
        [p.id, `"${(p.name || "").replace(/"/g, '""')}"`, p.category?.name, p.brand, p.price, p.stockQuantity, p.status].join(
          ",",
        ),
      ),
    ];
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "products-export.csv";
    a.click();
  };

  const tableWrap = isDarkMode ? "bg-zinc-950 border-zinc-800" : "bg-white border-zinc-100";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className={`text-2xl font-bodoni font-bold ${isDarkMode ? "text-white" : "text-black"}`}>Products</h2>
          <p className="text-[11px] text-zinc-500 uppercase font-semibold tracking-widest">Laptops, phones & accessories</p>
        </div>
        <Button onClick={onAdd} className="!rounded-xl gap-2 !text-xs">
          <Plus className="w-4 h-4" /> Add new product
        </Button>
      </div>

      <div className={`flex flex-wrap gap-2 p-4 rounded-xl border ${tableWrap}`}>
        <select
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          className="text-[12px] font-bold rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 px-3 py-2"
        >
          {SUBCATEGORY_FILTERS.map((o) => (
            <option key={o.label} value={o.value || ""}>
              {o.label}
            </option>
          ))}
        </select>
        <input
          placeholder="Brand"
          value={brandQ}
          onChange={(e) => setBrandQ(e.target.value)}
          className="text-[12px] font-bold rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent px-3 py-2 w-32"
        />
        <select
          value={stockF}
          onChange={(e) => setStockF(e.target.value)}
          className="text-[12px] font-bold rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 px-3 py-2"
        >
          <option value="">Stock: All</option>
          <option value="in">In stock</option>
          <option value="low">Low stock</option>
          <option value="out">Out of stock</option>
        </select>
        <input
          type="number"
          placeholder="Min price"
          value={minP}
          onChange={(e) => setMinP(e.target.value)}
          className="text-[12px] font-bold rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent px-3 py-2 w-24"
        />
        <input
          type="number"
          placeholder="Max price"
          value={maxP}
          onChange={(e) => setMaxP(e.target.value)}
          className="text-[12px] font-bold rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent px-3 py-2 w-24"
        />
        <div className="relative flex-grow min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            className="w-full pl-9 pr-3 py-2 text-[12px] font-bold rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-[11px] font-bold text-zinc-400 uppercase">Bulk</span>
        <Button type="button" variant="outline" disabled={!selected.size || loading} className="!text-xs" onClick={bulkDelete}>
          Delete selected
        </Button>
        <Button type="button" variant="outline" disabled={!selected.size || loading} className="!text-xs" onClick={() => bulkStatus("PUBLISHED")}>
          Set active
        </Button>
        <Button type="button" variant="outline" disabled={!selected.size || loading} className="!text-xs" onClick={() => bulkStatus("DRAFT")}>
          Set draft
        </Button>
        <Button type="button" variant="outline" className="!text-xs gap-1" onClick={exportCsv}>
          <Download className="w-3.5 h-3.5" /> Export
        </Button>
      </div>

      <div className={`rounded-xl border overflow-hidden ${tableWrap}`}>
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className={`text-[10px] uppercase font-bold text-zinc-400 ${isDarkMode ? "bg-zinc-900" : "bg-zinc-50"}`}>
              <th className="px-3 py-3 w-10">
                <input
                  type="checkbox"
                  checked={selected.size > 0 && filtered.every((p) => selected.has(p.id))}
                  onChange={() => {
                    if (selected.size) setSelected(new Set());
                    else setSelected(new Set(filtered.map((p) => p.id)));
                  }}
                />
              </th>
              <th className="px-3 py-3">Image</th>
              <th className="px-3 py-3">Name</th>
              <th className="px-3 py-3">Category</th>
              <th className="px-3 py-3">Brand</th>
              <th className="px-3 py-3">Price</th>
              <th className="px-3 py-3">Stock</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {filtered.map((product) => (
              <tr key={product.id} className={isDarkMode ? "text-zinc-200" : ""}>
                <td className="px-3 py-2">
                  <input type="checkbox" checked={selected.has(product.id)} onChange={() => toggle(product.id)} />
                </td>
                <td className="px-3 py-2">
                  <img src={product.imageUrls?.[0]} alt="" className="w-10 h-10 object-contain rounded-lg bg-zinc-100 dark:bg-zinc-800" />
                </td>
                <td className="px-3 py-2 font-bold max-w-[200px] truncate">{product.name}</td>
                <td className="px-3 py-2 text-zinc-500">{product.subcategory?.name || product.category?.name}</td>
                <td className="px-3 py-2">{product.brand}</td>
                <td className="px-3 py-2 font-bold">KSh {Number(product.price).toLocaleString()}</td>
                <td className="px-3 py-2">{product.stockQuantity}</td>
                <td className="px-3 py-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800">{statusLabel(product)}</span>
                </td>
                <td className="px-3 py-2 text-right space-x-1">
                  <button type="button" className="p-1.5 text-zinc-400 hover:text-cta" onClick={() => onEdit(product)} title="Edit">
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    className="p-1.5 text-zinc-400 hover:text-red-600"
                    title="Delete"
                    onClick={async () => {
                      if (!confirm("Delete this product?")) return;
                      await adminDelete(`/api/admin/products/${product.id}`);
                      await reload();
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
