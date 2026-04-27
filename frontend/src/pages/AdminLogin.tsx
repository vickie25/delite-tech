import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate admin login
    if (email === 'admin@elect.com' && password === 'admin123') {
      localStorage.setItem('is_admin', 'true');
      navigate('/admin/dashboard');
    } else {
      alert('Invalid Credentials');
    }
  };

  return (
    <div className="min-h-screen bg-accent flex items-center justify-center px-6">
      <div className="w-full max-w-sm bg-white p-12 space-y-10 shadow-2xl">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black uppercase tracking-tighter">Admin.</h1>
          <p className="text-[10px] font-bold text-black/30 uppercase tracking-[0.3em]">Restricted Access</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase tracking-widest text-black/40 ml-1">Username</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ADMIN@ELECT.COM" 
              required 
              className="w-full bg-accent border-none p-4 text-[11px] font-bold uppercase outline-none focus:ring-1 focus:ring-black" 
            />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase tracking-widest text-black/40 ml-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              required 
              className="w-full bg-accent border-none p-4 text-[11px] font-bold uppercase outline-none focus:ring-1 focus:ring-black" 
            />
          </div>
          <div className="pt-4">
            <button type="submit" className="w-full bg-black text-white py-4 text-[11px] font-black tracking-widest uppercase border border-black hover:bg-white hover:text-black transition-all">
              Authenticate
            </button>
          </div>
        </form>

        <div className="text-center">
          <button onClick={() => navigate('/')} className="text-[10px] font-black uppercase border-b border-black/10 text-black/30 hover:text-black hover:border-black transition-all">
            Back To Store
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
