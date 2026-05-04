import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit3, X, Check, FolderOpen } from 'lucide-react';
import { adminGet, adminPost, adminDelete, adminPut } from '../../lib/adminAuth';
import { Button } from '../ui/Button';

const AdminCategoryManager: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [dragId, setDragId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [parentCategoryId, setParentCategoryId] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editingParentId, setEditingParentId] = useState<string>('');
  const [editingIsSubcategory, setEditingIsSubcategory] = useState(false);

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
      await adminPost('/api/admin/categories', {
        name: newCategoryName,
        ...(parentCategoryId ? { parentCategoryId: Number(parentCategoryId) } : {}),
      });
      setNewCategoryName('');
      setParentCategoryId('');
      setIsAdding(false);
      fetchCategories();
    } catch (err) {
      console.error('Failed to add category:', err);
    }
  };

  const handleDelete = async (id: string, isSubcategory = false) => {
    if (!confirm('Are you sure?')) return;
    try {
      await adminDelete(`/api/admin/categories/${id}${isSubcategory ? "?isSubcategory=true" : ""}`);
      fetchCategories();
    } catch (err) {
      console.error('Failed to delete category:', err);
    }
  };

  const handleDropOn = async (targetId: number) => {
    if (dragId == null || dragId === targetId) return;
    const idx = categories.findIndex((c) => c.id === dragId);
    const tdx = categories.findIndex((c) => c.id === targetId);
    if (idx < 0 || tdx < 0) return;
    const next = [...categories];
    const [removed] = next.splice(idx, 1);
    next.splice(tdx, 0, removed);
    const orderedIds = next.map((c) => c.id);
    try {
      await adminPost('/api/admin/categories/reorder', { orderedIds });
      await fetchCategories();
    } catch (err) {
      console.error('Reorder failed:', err);
    }
    setDragId(null);
  };

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) return;
    try {
      await adminPut(`/api/admin/categories/${id}`, {
        name: editName,
        isSubcategory: editingIsSubcategory,
        ...(editingIsSubcategory && editingParentId ? { parentCategoryId: Number(editingParentId) } : {}),
      });
      setEditingId(null);
      setEditingParentId('');
      setEditingIsSubcategory(false);
      fetchCategories();
    } catch (err) {
      console.error('Failed to update category:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-black dark:text-white tracking-tight uppercase">System Taxonomy</h3>
          <p className="text-[11px] text-zinc-400 font-bold uppercase mt-1">Drag cards to set display priority · Slug shown for URL preview</p>
        </div>
        <Button
          variant="default"
          onClick={() => setIsAdding(true)}
          className="!rounded-lg shadow-md !px-6 !py-2 text-xs"
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
              className="bg-white dark:bg-zinc-950 rounded-lg border-2 border-dashed border-zinc-200 dark:border-zinc-800 p-5 flex flex-col gap-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold text-black dark:text-white uppercase tracking-widest">New Designation</span>
                <button onClick={() => setIsAdding(false)} className="text-zinc-300 hover:text-black dark:hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <input 
                autoFocus
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Name..."
                className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-[13px] font-bold text-black dark:text-white outline-none focus:bg-white dark:focus:bg-zinc-900 transition-all"
              />
              <select
                value={parentCategoryId}
                onChange={(e) => setParentCategoryId(e.target.value)}
                className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-[12px] font-bold text-black dark:text-white outline-none"
              >
                <option value="">Create root category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    Add under {cat.name}
                  </option>
                ))}
              </select>
              <Button onClick={handleAdd} className="!rounded-lg w-full text-[11px] !py-2">Commit Asset</Button>
            </motion.div>
          )}

          {categories.map((cat) => (
            <motion.div 
              layout
              key={cat.id}
              draggable
              onDragStart={() => setDragId(cat.id)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDropOn(cat.id)}
              className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-5 group hover:shadow-md transition-all relative overflow-hidden cursor-grab active:cursor-grabbing"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-zinc-50 dark:bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-400 group-hover:text-black dark:group-hover:text-white transition-colors">
                  <FolderOpen className="w-5 h-5" />
                </div>
                
                <div className="flex-grow min-w-0">
                  {editingId === String(cat.id) ? (
                    <div className="flex items-center gap-2">
                      <input 
                        autoFocus
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2 py-1 text-xs font-bold text-black dark:text-white outline-none"
                      />
                      <button onClick={() => handleUpdate(String(cat.id))} className="text-black dark:text-white shrink-0">
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="truncate">
                      <p className="text-[14px] font-bold text-black dark:text-white leading-tight truncate">{cat.name}</p>
                      <p className="text-[10px] text-zinc-400 font-mono mt-0.5">/{cat.slug}</p>
                      <p className="text-[10px] text-zinc-400 font-bold uppercase mt-0.5">
                        {(cat as any)._count?.products ?? 0} products · {cat.subcategories?.length || 0} subcategories
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-all shrink-0">
                  <button 
                    onClick={() => { setEditingId(String(cat.id)); setEditName(cat.name); setEditingParentId(''); setEditingIsSubcategory(false); }}
                    className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-black dark:hover:text-white"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(String(cat.id))}
                    className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-black dark:hover:text-white"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              {!!cat.subcategories?.length && (
                <div className="mt-4 space-y-2">
                  {cat.subcategories.map((sub: any) => (
                    <div key={sub.id} className="flex items-center justify-between rounded-lg bg-zinc-50 dark:bg-zinc-800/50 px-3 py-2">
                      <span className="text-[11px] font-bold text-zinc-600 dark:text-zinc-300">{sub.name}</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={async () => {
                            const nextName = window.prompt("Rename subcategory", sub.name);
                            if (!nextName?.trim()) return;
                            try {
                              await adminPut(`/api/admin/categories/${sub.id}`, {
                                name: nextName,
                                isSubcategory: true,
                                parentCategoryId: Number(cat.id),
                              });
                              fetchCategories();
                            } catch (err) {
                              console.error("Failed to update subcategory:", err);
                            }
                          }}
                          className="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-black dark:hover:text-white"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDelete(String(sub.id), true)}
                          className="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-black dark:hover:text-white"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminCategoryManager;
