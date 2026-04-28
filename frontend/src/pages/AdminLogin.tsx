import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Lock, Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import { loginAdmin, saveAdminSession } from '../lib/adminAuth';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const adminSession = await loginAdmin({ email, password });
      saveAdminSession(adminSession);
      localStorage.setItem('is_admin', 'true');
      navigate('/admin/dashboard');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Invalid Credentials');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-grey-light flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white border border-grey-mid rounded-2xl p-10 md:p-12 shadow-xl space-y-10 animate-in fade-in zoom-in duration-700">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-black text-white flex items-center justify-center mx-auto rounded-xl shadow-lg">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h1 className="text-[28px] font-poppins font-bold text-black tracking-tight">Admin Terminal</h1>
            <p className="text-[14px] font-inter text-grey-text">Secure administrative access only</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[13px] font-bold text-black font-poppins">Credential ID (Email)</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-grey-text" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@delight.tech" 
                required 
                className="w-full bg-grey-light border border-grey-mid rounded-lg pl-11 pr-4 py-3 text-[14px] font-inter outline-none focus:border-black transition-all" 
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[13px] font-bold text-black font-poppins">Encryption Key (Password)</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-grey-text" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                required 
                className="w-full bg-grey-light border border-grey-mid rounded-lg pl-11 pr-4 py-3 text-[14px] font-inter outline-none focus:border-black transition-all" 
              />
            </div>
          </div>

          <div className="pt-4">
            {error && <p className="text-[13px] text-accent-red mb-3">{error}</p>}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full h-12 rounded-lg flex items-center justify-center gap-2 text-[15px] group transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Authorizing...' : 'Authorize Access'}
              {!isSubmitting && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </button>
          </div>
        </form>

        {/* Footer Link */}
        <div className="text-center">
          <button 
            onClick={() => navigate('/')} 
            className="inline-flex items-center gap-2 text-[13px] font-medium text-grey-text hover:text-black transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Public Storefront
          </button>
        </div>

        {/* Security Notice */}
        <div className="pt-6 border-t border-grey-mid">
          <p className="text-[11px] text-center text-grey-text leading-relaxed font-inter uppercase tracking-wider">
            All administrative actions are logged and encrypted. Unauthorized access attempts are reported.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

