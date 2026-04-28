import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Lock, Mail } from "lucide-react";
import { loginCustomer } from "../lib/customerAuth";
import { useCustomerAuth } from "../context/CustomerAuthContext";

const CustomerLogin = () => {
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
      navigate("/");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Could not login");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-grey-light py-10 px-4">
      <div className="max-w-md mx-auto bg-white border border-grey-mid rounded-2xl p-8 md:p-10 shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="text-[28px] font-poppins font-bold text-black">Customer Login</h1>
          <p className="text-[14px] font-inter text-grey-text mt-2">Access your account to continue shopping</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-grey-text" />
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email address"
              className="w-full border border-grey-mid rounded-lg pl-10 pr-3 py-3 text-[14px] outline-none focus:border-black"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-grey-text" />
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              className="w-full border border-grey-mid rounded-lg pl-10 pr-3 py-3 text-[14px] outline-none focus:border-black"
            />
          </div>

          {error && <p className="text-[13px] text-accent-red">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full h-12 rounded-lg flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Signing in..." : "Login"}
            {!isSubmitting && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <p className="text-[13px] text-grey-text text-center mt-6">
          New here?{" "}
          <Link to="/signup" className="text-black font-semibold hover:opacity-70">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CustomerLogin;
