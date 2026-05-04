import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, Plus, Trash2, Save, Image as ImageIcon } from 'lucide-react';
import { Button } from '../ui/Button';

interface AdminProductFormProps {
  product?: any;
  categories?: any[];
  onClose: () => void;
  onSave: (data: any) => void;
}

const AdminProductForm: React.FC<AdminProductFormProps> = ({ product, categories = [], onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    price: product?.price || '',
    salePrice: product?.salePrice ?? '',
    stockQuantity: product?.stockQuantity || '',
    description: product?.description || '',
    categoryId: product?.categoryId || '',
    subcategoryId: product?.subcategoryId || '',
    brand: product?.brand || '',
    sku: product?.sku || '',
    tags: Array.isArray(product?.tags) ? product.tags.join(', ') : '',
    reorderLevel: product?.reorderLevel ?? '',
    status: product?.status === 'DRAFT' ? 'DRAFT' : 'PUBLISHED',
    variantsJson: JSON.stringify((product?.specifications as any)?.variants || [], null, 2),
    specifications: product?.specifications || {},
    imageUrls: product?.imageUrls || [],
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>(product?.imageUrls || []);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState('foundation');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setImageFiles(prev => [...prev, ...files]);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    // If it's a new file, remove from imageFiles too
    // This is a bit simplified, but works for UI
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subcategoryId) return;

    let variants: unknown[] = [];
    try {
      variants = formData.variantsJson ? JSON.parse(formData.variantsJson) : [];
      if (!Array.isArray(variants)) variants = [];
    } catch {
      variants = [];
    }
    const tags = formData.tags
      .split(',')
      .map((t: string) => t.trim())
      .filter(Boolean);

    onSave({
      name: formData.name,
      price: formData.price,
      stockQuantity: formData.stockQuantity,
      description: formData.description,
      categoryId: Number(formData.categoryId),
      subcategoryId: Number(formData.subcategoryId),
      brand: formData.brand,
      imageUrls: imagePreviews,
      salePrice: formData.salePrice === '' ? null : Number(formData.salePrice),
      sku: formData.sku || null,
      tags,
      reorderLevel: formData.reorderLevel === '' ? undefined : Number(formData.reorderLevel),
      status: formData.status,
      specifications: { ...(formData.specifications || {}), variants },
      images: imageFiles,
    });
  };

  const selectedCategory = categories.find((category) => Number(category.id) === Number(formData.categoryId));
  const availableSubcategories = selectedCategory?.subcategories || [];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    >
      <motion.div 
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.98, opacity: 0 }}
        className="w-full max-w-4xl h-[85vh] bg-white dark:bg-zinc-950 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden border border-zinc-200 dark:border-zinc-800"
      >
        {/* Header */}
        <div className="px-8 py-6 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
          <div>
            <p className="text-[10px] font-bold text-cta uppercase tracking-[0.2em] mb-1">Inventory Management</p>
            <h2 className="text-xl font-bodoni font-bold text-black dark:text-white tracking-tight">
              {product ? 'Edit Product Asset' : 'Deploy New Asset'}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="w-9 h-9 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg flex items-center justify-center text-zinc-400 hover:text-black dark:hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-grow overflow-hidden">
          {/* Navigation */}
          <div className="w-56 border-r border-zinc-100 dark:border-zinc-800 p-6 flex flex-col gap-2 bg-zinc-50/10">
            {[
              { id: 'foundation', name: 'Information', desc: 'Basics & Details' },
              { id: 'aesthetics', name: 'Media Assets', desc: 'Images & Display' },
              { id: 'parameters', name: 'Classification', desc: 'Category & Brand' },
              { id: 'variants', name: 'Variants & Tags', desc: 'SKU, tags, options' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col text-left px-5 py-3.5 rounded-lg transition-all group ${
                  activeTab === tab.id 
                    ? 'bg-black dark:bg-cta text-white shadow-lg' 
                    : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                }`}
              >
                <span className="text-[12px] font-bold">{tab.name}</span>
                <span className={`text-[9px] font-medium opacity-60 ${activeTab === tab.id ? 'text-white' : 'text-zinc-400'}`}>{tab.desc}</span>
              </button>
            ))}
          </div>

          {/* Form */}
          <div className="flex-grow overflow-y-auto p-10 custom-scrollbar bg-white dark:bg-zinc-950">
            <form id="product-form" onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto">
              {activeTab === 'foundation' && (
                <div className="space-y-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">Designation Name</label>
                    <input 
                      type="text" required value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-3 text-[13px] font-bold text-black dark:text-white outline-none focus:bg-white dark:focus:bg-zinc-900 focus:border-black dark:focus:border-cta transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">Price (KSh)</label>
                      <input type="number" required value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-3 text-[13px] font-bold text-black dark:text-white outline-none focus:border-black dark:focus:border-cta transition-all" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">Compare-at (KSh)</label>
                      <input type="number" value={formData.salePrice as any} onChange={(e) => setFormData({...formData, salePrice: e.target.value})} className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-3 text-[13px] font-bold text-black dark:text-white outline-none focus:border-black dark:focus:border-cta transition-all" placeholder="Optional" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">Stock quantity</label>
                      <input type="number" required value={formData.stockQuantity} onChange={(e) => setFormData({...formData, stockQuantity: e.target.value})} className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-3 text-[13px] font-bold text-black dark:text-white outline-none focus:border-black dark:focus:border-cta transition-all" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">Reorder level</label>
                      <input type="number" value={formData.reorderLevel as any} onChange={(e) => setFormData({...formData, reorderLevel: e.target.value})} className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-3 text-[13px] font-bold text-black dark:text-white outline-none focus:border-black dark:focus:border-cta transition-all" placeholder="Default 5" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-grow">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as 'DRAFT' | 'PUBLISHED' })}
                        className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-3 text-[13px] font-bold"
                      >
                        <option value="PUBLISHED">Active (published)</option>
                        <option value="DRAFT">Draft</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">Description (rich text / HTML)</label>
                    <textarea rows={5} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-3 text-[13px] font-medium text-zinc-600 dark:text-zinc-300 outline-none focus:bg-white dark:focus:bg-zinc-900 focus:border-black dark:focus:border-cta transition-all resize-none" />
                  </div>
                </div>
              )}

              {activeTab === 'aesthetics' && (
                <div className="space-y-8">
                  <input type="file" multiple ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg p-10 text-center space-y-4 hover:border-cta/30 transition-all cursor-pointer bg-zinc-50/50 dark:bg-zinc-900/50 group"
                  >
                    <div className="w-12 h-12 bg-white dark:bg-zinc-900 shadow-md rounded-lg flex items-center justify-center mx-auto transition-transform group-hover:scale-105">
                      <Upload className="w-5 h-5 text-cta" />
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-black dark:text-white">Ingest Media Assets</p>
                      <p className="text-[10px] text-zinc-400 font-medium mt-1 uppercase tracking-widest">Select one or more high-fidelity images</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    {imagePreviews.map((url, i) => (
                      <div key={i} className="aspect-square bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 relative group overflow-hidden shadow-sm">
                        <img src={url} alt="" className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform" />
                        <button 
                          type="button"
                          onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                          className="absolute top-1.5 right-1.5 w-7 h-7 bg-red-600 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    {imagePreviews.length === 0 && (
                      <div className="aspect-square bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center opacity-40">
                         <ImageIcon className="w-6 h-6 mb-2 text-zinc-400" />
                         <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">No Media</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'parameters' && (
                <div className="space-y-6">
                  <div className="space-y-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">Brand</label>
                      <input type="text" value={formData.brand} onChange={(e) => setFormData({...formData, brand: e.target.value})} className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-3 text-[13px] font-bold text-black dark:text-white outline-none focus:bg-white dark:focus:bg-zinc-900" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">Target Category</label>
                      <div className="relative">
                        <select
                          value={formData.categoryId}
                          onChange={(e) =>
                            setFormData({ ...formData, categoryId: e.target.value, subcategoryId: "" })
                          }
                          className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-3 text-[13px] font-bold text-black dark:text-white outline-none appearance-none focus:bg-white dark:focus:bg-zinc-900"
                        >
                          <option value="">Select Category</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                           <Plus className="w-3 h-3 text-zinc-400" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">Target Subcategory</label>
                      <select
                        value={formData.subcategoryId}
                        onChange={(e) => setFormData({ ...formData, subcategoryId: e.target.value })}
                        className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-3 text-[13px] font-bold text-black dark:text-white outline-none appearance-none focus:bg-white dark:focus:bg-zinc-900"
                        required
                      >
                        <option value="">Select Subcategory</option>
                        {availableSubcategories.map((subcategory: any) => (
                          <option key={subcategory.id} value={subcategory.id}>
                            {subcategory.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'variants' && (
                <div className="space-y-6 max-w-2xl">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">SKU / barcode</label>
                    <input type="text" value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-3 text-[13px] font-bold" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">Tags (comma-separated)</label>
                    <input type="text" value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-3 text-[13px] font-bold" placeholder="flagship, 5g, oled" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">Variants (JSON array)</label>
                    <p className="text-[11px] text-zinc-500">{`Example: [{"name":"Color","options":["Black","Silver"]},{"name":"Storage","options":["128GB","256GB"]}]`}</p>
                    <textarea
                      rows={10}
                      value={formData.variantsJson}
                      onChange={(e) => setFormData({ ...formData, variantsJson: e.target.value })}
                      className="w-full font-mono text-[12px] bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-3"
                    />
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2.5 rounded-lg text-[12px] font-bold text-zinc-400 hover:text-black dark:hover:text-white transition-colors">Cancel</button>
          <Button form="product-form" className="!rounded-lg !px-8 gap-2 !py-2.5 text-xs shadow-md">
            <Save className="w-4 h-4" /> {product ? 'Sync Asset' : 'Deploy Asset'}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminProductForm;
