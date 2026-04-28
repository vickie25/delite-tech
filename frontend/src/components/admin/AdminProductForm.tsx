import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, Trash2, Save, Info } from 'lucide-react';
import { Button } from '../ui/Button';

interface AdminProductFormProps {
  product?: any;
  onClose: () => void;
  onSave: (data: any) => void;
}

const AdminProductForm: React.FC<AdminProductFormProps> = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    price: product?.price || '',
    stockQuantity: product?.stockQuantity || '',
    description: product?.description || '',
    categoryId: product?.categoryId || '',
    brand: product?.brand || '',
    specifications: product?.specifications || {},
    imageUrls: product?.imageUrls || [],
  });

  const [activeTab, setActiveTab] = useState('foundation');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-900/20 backdrop-blur-sm p-4"
    >
      <motion.div 
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.98, opacity: 0 }}
        className="w-full max-w-4xl h-[85vh] bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden border border-stone-100"
      >
        {/* Header - Compact */}
        <div className="px-8 py-6 flex items-center justify-between border-b border-stone-100 bg-stone-50/30">
          <div>
            <p className="text-[10px] font-bold text-cta uppercase tracking-[0.2em] mb-1">Inventory Management</p>
            <h2 className="text-xl font-bodoni font-bold text-stone-900 tracking-tight">
              {product ? 'Edit Product Asset' : 'Deploy New Asset'}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="w-9 h-9 bg-white border border-stone-100 rounded-xl flex items-center justify-center text-stone-400 hover:text-stone-900 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Layout */}
        <div className="flex flex-grow overflow-hidden">
          {/* Navigation Sidebar - Narrower */}
          <div className="w-56 border-r border-stone-100 p-6 flex flex-col gap-2 bg-stone-50/10">
            {[
              { id: 'foundation', name: 'Information', desc: 'Basics & Details' },
              { id: 'aesthetics', name: 'Media Assets', desc: 'Images & Display' },
              { id: 'parameters', name: 'Classification', desc: 'Category & Brand' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col text-left px-5 py-3.5 rounded-xl transition-all group ${
                  activeTab === tab.id 
                    ? 'bg-stone-900 text-white shadow-lg' 
                    : 'hover:bg-stone-50 text-stone-600'
                }`}
              >
                <span className="text-[12px] font-bold">{tab.name}</span>
                <span className={`text-[9px] font-medium opacity-60 ${activeTab === tab.id ? 'text-white' : 'text-stone-400'}`}>{tab.desc}</span>
              </button>
            ))}
          </div>

          {/* Form Area - Dense */}
          <div className="flex-grow overflow-y-auto p-10 custom-scrollbar bg-white">
            <form id="product-form" onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto">
              {activeTab === 'foundation' && (
                <div className="space-y-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-1">Designation Name</label>
                    <input 
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g. MacBook Pro M3 Max"
                      className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 text-[13px] font-bold text-stone-900 outline-none focus:bg-white focus:border-cta/20 transition-all shadow-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-1">Valuation (KSh)</label>
                      <input 
                        type="number"
                        required
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 text-[13px] font-bold text-stone-900 outline-none focus:bg-white focus:border-cta/20 transition-all shadow-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-1">Stock Depth</label>
                      <input 
                        type="number"
                        required
                        value={formData.stockQuantity}
                        onChange={(e) => setFormData({...formData, stockQuantity: e.target.value})}
                        className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 text-[13px] font-bold text-stone-900 outline-none focus:bg-white focus:border-cta/20 transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-1">Technical Summary</label>
                    <textarea 
                      rows={5}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 text-[13px] font-medium text-stone-600 outline-none focus:bg-white focus:border-cta/20 transition-all shadow-sm resize-none"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'aesthetics' && (
                <div className="space-y-8">
                  <div className="border border-dashed border-stone-200 rounded-2xl p-10 text-center space-y-4 hover:border-cta/30 transition-all cursor-pointer bg-stone-50/50 group">
                    <div className="w-12 h-12 bg-white shadow-md rounded-xl flex items-center justify-center mx-auto transition-transform group-hover:scale-105">
                      <Upload className="w-5 h-5 text-cta" />
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-stone-900">Ingest Media Assets</p>
                      <p className="text-[10px] text-stone-400 font-medium mt-1">Recommended: 1:1 ratio, min 1000px</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    {formData.imageUrls.map((url: string, i: number) => (
                      <div key={i} className="aspect-square bg-stone-50 rounded-xl border border-stone-100 relative group overflow-hidden shadow-sm">
                        <img src={url} alt="" className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform" />
                        <button className="absolute top-1.5 right-1.5 w-7 h-7 bg-red-500 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'parameters' && (
                <div className="space-y-6">
                  <div className="bg-blue-50/50 rounded-2xl p-5 border border-blue-100 flex gap-4">
                    <Info className="w-5 h-5 text-blue-500 shrink-0" />
                    <p className="text-[12px] text-blue-700 leading-relaxed font-medium">
                      Accurate classification ensures optimal search performance and inventory visibility.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-1">Brand Identifier</label>
                      <input 
                        type="text"
                        value={formData.brand}
                        onChange={(e) => setFormData({...formData, brand: e.target.value})}
                        className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 text-[13px] font-bold text-stone-900 outline-none shadow-sm focus:bg-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-1">Target Category</label>
                      <select 
                        value={formData.categoryId}
                        onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                        className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 text-[13px] font-bold text-stone-900 outline-none shadow-sm focus:bg-white appearance-none"
                      >
                        <option value="">Select Category</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Footer - Compact */}
        <div className="px-8 py-5 border-t border-stone-100 bg-stone-50/30 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-[12px] font-bold text-stone-400 hover:text-stone-900 transition-colors"
          >
            Cancel
          </button>
          <Button 
            form="product-form"
            className="!rounded-xl !px-8 gap-2 !py-2.5 text-xs shadow-md"
          >
            <Save className="w-4 h-4" />
            {product ? 'Sync Asset' : 'Deploy Asset'}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminProductForm;
