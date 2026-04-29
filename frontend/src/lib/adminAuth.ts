export type Admin = {
  id: number;
  name: string;
  email: string;
};

export type AdminLoginResponse = {
  message: string;
  accessToken: string;
  admin: Admin;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const ADMIN_STATE_KEY = "admin_auth_state";

const parseResponseBody = async (response: Response) => {
  if (response.status === 204) return null;
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

const getBearerToken = () => {
  const session = getAdminSession();
  if (!session?.accessToken) {
    throw new Error("Admin session missing");
  }
  return session.accessToken;
};

export const loginAdmin = async (payload: { email: string; password: string }) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const body = (await response.json().catch(() => ({}))) as Partial<AdminLoginResponse> & { message?: string };
  if (!response.ok) {
    throw new Error(body.message || "Admin login failed");
  }

  return body as AdminLoginResponse;
};

export const saveAdminSession = (session: AdminLoginResponse) => {
  localStorage.setItem(ADMIN_STATE_KEY, JSON.stringify(session));
};

export const getAdminSession = (): AdminLoginResponse | null => {
  const raw = localStorage.getItem(ADMIN_STATE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AdminLoginResponse;
  } catch {
    localStorage.removeItem(ADMIN_STATE_KEY);
    return null;
  }
};

export const clearAdminSession = () => {
  localStorage.removeItem(ADMIN_STATE_KEY);
};

export const adminGet = async <T>(path: string): Promise<T> => {
  const accessToken = getBearerToken();

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const body = await parseResponseBody(response);
  if (!response.ok) {
    const message = typeof (body as any)?.message === "string" ? (body as any).message : "Request failed";
    throw new Error(message);
  }
  return body as T;
};

export const adminPost = async <T>(path: string, data: any): Promise<T> => {
  const accessToken = getBearerToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  });
  const body = await parseResponseBody(response);
  if (!response.ok) throw new Error((body as any)?.message || "Failed to post data");
  return body as T;
};

export const adminPut = async <T>(path: string, data: any): Promise<T> => {
  const accessToken = getBearerToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  });
  const body = await parseResponseBody(response);
  if (!response.ok) throw new Error((body as any)?.message || "Failed to update data");
  return body as T;
};

export const adminDelete = async <T>(path: string): Promise<T> => {
  const accessToken = getBearerToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const body = await parseResponseBody(response);
  if (!response.ok) throw new Error((body as any)?.message || "Failed to delete data");
  return body as T;
};

export const logoutAdmin = async () => {
  const accessToken = getBearerToken();
  const response = await fetch(`${API_BASE_URL}/api/auth/admin/logout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const body = await parseResponseBody(response);
  if (!response.ok) throw new Error((body as any)?.message || "Admin logout failed");
  return body as { message?: string } | null;
};
