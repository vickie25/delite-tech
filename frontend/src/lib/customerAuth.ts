export type Customer = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
};

export type AuthResponse = {
  message: string;
  accessToken: string;
  refreshToken: string;
  token?: string;
  customer: Customer;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const AUTH_STATE_KEY = "customer_auth_state";

const request = async <T>(path: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    ...options,
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = typeof body?.message === "string" ? body.message : "Request failed";
    throw new Error(message);
  }

  return body as T;
};

export const signupCustomer = async (payload: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
}) =>
  request<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const loginCustomer = async (payload: { email: string; password: string }) =>
  request<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const saveCustomerSession = (auth: AuthResponse) => {
  localStorage.setItem(AUTH_STATE_KEY, JSON.stringify(auth));
};

export const getCustomerSession = (): AuthResponse | null => {
  const raw = localStorage.getItem(AUTH_STATE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthResponse;
  } catch {
    localStorage.removeItem(AUTH_STATE_KEY);
    return null;
  }
};

export const clearCustomerSession = () => {
  localStorage.removeItem(AUTH_STATE_KEY);
};
