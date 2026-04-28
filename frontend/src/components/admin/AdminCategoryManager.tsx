import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit3, X, Check, FolderOpen } from 'lucide-react';
import { adminGet, adminPost, adminDelete, adminPut } from '../../lib/adminAuth';
import { Button } from '../ui/Button';

const AdminCategoryManager: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const fetchCategories = async () => {
    try {
      const data = await adminGet<any[]>('/api/admin/categories');
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = async () => {
    if (!newCategoryName.trim()) return;
    try {
      await adminPost('/api/admin/categories', { name: newCategoryName });
      setNewCategoryName('');
      setIsAdding(false);
      fetchCategories();
    } catch (err) {
      console.error('Failed to add category:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await adminDelete(`/api/admin/categories/${id}`);
      fetchCategories();
    } catch (err) {
      console.error('Failed to delete category:', err);
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) return;
    try {
      await adminPut(`/api/admin/categories/${id}`, { name: editName });
      setEditingId(null);
      fetchCategories();
    } catch (err) {
      console.error('Failed to update category:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bodoni font-bold text-stone-900 tracking-tight">System Taxonomy</h3>
          <p className="text-[11px] text-stone-400 font-medium mt-1">Organize inventory tiers</p>
        </div>
        <Button
          variant="default"
          onClick={() => setIsAdding(true)}
          className="!rounded-xl shadow-md !px-6 !py-2 text-xs"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Category
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <AnimatePresence mode="popLayout">
          {isAdding && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl border-2 border-dashed border-cta/20 p-5 flex flex-col gap-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold text-cta uppercase tracking-widest">New Designation</span>
                <button onClick={() => setIsAdding(false)} className="text-stone-300 hover:text-stone-900">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <input 
                autoFocus
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Name..."
                className="bg-stone-50 border border-stone-100 rounded-lg px-3 py-2 text-[13px] font-bold text-stone-900 outline-none focus:bg-white transition-all"
              />
              <Button onClick={handleAdd} className="!rounded-lg w-full text-[11px] !py-2">Commit Asset</Button>
            </motion.div>
          )}

          {categories.map((cat) => (
            <motion.div 
              layout
              key={cat.id}
              className="bg-white rounded-2xl border border-stone-100 p-5 group hover:shadow-md transition-all relative overflow-hidden"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-stone-50 rounded-xl flex items-center justify-center text-stone-400 group-hover:text-cta transition-colors">
                  <FolderOpen className="w-5 h-5" />
                </div>
                
                <div className="flex-grow min-w-0">
                  {editingId === cat.id ? (
                    <div className="flex items-center gap-2">
                      <input 
                        autoFocus
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-100 rounded-lg px-2 py-1 text-xs font-bold text-stone-900 outline-none"
                      />
                      <button onClick={() => handleUpdate(cat.id)} className="text-green-600 shrink-0">
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="truncate">
                      <p className="text-[14px] font-bold text-stone-900 leading-tight truncate">{cat.name}</p>
                      <p className="text-[10px] text-stone-400 font-medium mt-0.5">{cat.subcategories?.length || 0} Sub-tiers</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-all shrink-0">
                  <button 
                    onClick={() => { setEditingId(cat.id); setEditName(cat.name); }}
                    className="w-7 h-7 flex items-center justify-center text-stone-400 hover:text-stone-900"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(cat.id)}
                    className="w-7 h-7 flex items-center justify-center text-stone-400 hover:text-red-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminCategoryManager;
