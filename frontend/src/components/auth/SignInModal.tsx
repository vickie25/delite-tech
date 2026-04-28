import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Lock, Mail, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { loginCustomer } from "../../lib/customerAuth";
import { useCustomerAuth } from "../../context/CustomerAuthContext";
import { Button } from "../ui/Button";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignInModal = ({ isOpen, onClose }: SignInModalProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setAuthSession } = useCustomerAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const auth = await loginCustomer({ email, password });
      setAuthSession(auth);
      onClose();
      navigate("/");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Could not login");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-[101] glass-card p-8 md:p-10 rounded-[32px] border-white/40 shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute right-6 top-6 p-2 rounded-full hover:bg-black/5 transition-colors"
            >
              <X className="w-5 h-5 text-secondary" />
            </button>

            <div className="mb-10 text-center">
              <h2 className="font-bodoni text-3xl font-semibold text-primary">Welcome Back</h2>
              <p className="font-jost text-secondary mt-2">Enter your details to access your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="font-jost text-sm font-medium text-primary ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary group-focus-within:text-cta transition-colors" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-white/50 backdrop-blur-sm border border-white/30 rounded-2xl pl-12 pr-4 py-4 font-jost text-base outline-none focus:border-cta focus:ring-4 focus:ring-cta/10 transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="font-jost text-sm font-medium text-primary">Password</label>
                  <Link to="#" className="font-jost text-xs text-cta hover:underline">Forgot password?</Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary group-focus-within:text-cta transition-colors" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/50 backdrop-blur-sm border border-white/30 rounded-2xl pl-12 pr-4 py-4 font-jost text-base outline-none focus:border-cta focus:ring-4 focus:ring-cta/10 transition-all shadow-sm"
                  />
                </div>
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-sm text-red-600 font-jost text-center"
                >
                  {error}
                </motion.p>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 rounded-2xl flex items-center justify-center gap-2"
              >
                {isSubmitting ? "Authenticating..." : "Sign In"}
                {!isSubmitting && <ArrowRight className="w-5 h-5" />}
              </Button>
            </form>

            <div className="mt-10 text-center">
              <p className="font-jost text-secondary text-sm">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  onClick={onClose}
                  className="text-primary font-bold hover:text-cta transition-colors border-b border-primary hover:border-cta"
                >
                  Create one now
                </Link>
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SignInModal;
