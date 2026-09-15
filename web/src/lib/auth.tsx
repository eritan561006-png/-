import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { teachers } from "./mockData";
import type { Teacher } from "./types";

const SESSION_KEY = "xfjl-session";

interface AuthContextValue {
  user: Teacher | null;
  loading: boolean;
  login: (employeeNo: string, password: string) => Promise<{ ok: true } | { ok: false; message: string }>;
  logout: () => void;
  spendCredits: (amount: number) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function loadSessionUser(): Teacher | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const savedId = JSON.parse(raw).id as string;
    const found = teachers.find((t) => t.id === savedId);
    return found && found.status === "active" ? { ...found } : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Teacher | null>(loadSessionUser);
  const [loading] = useState(false);

  const login: AuthContextValue["login"] = async (employeeNo, password) => {
    await new Promise((r) => setTimeout(r, 600));
    const found = teachers.find((t) => t.employeeNo === employeeNo.trim());
    if (!found) return { ok: false, message: "账号不存在，请检查工号是否正确" };
    if (found.status === "disabled") return { ok: false, message: "该账号已被停用，请联系管理员" };
    if (found.password !== password) return { ok: false, message: "账号或密码错误" };
    setUser({ ...found });
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify({ id: found.id }));
    } catch {
      // ignore storage errors (e.g. private mode)
    }
    return { ok: true };
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch {
      // ignore
    }
  };

  const spendCredits = (amount: number) => {
    setUser((prev) => (prev ? { ...prev, creditBalance: Math.max(0, prev.creditBalance - amount) } : prev));
  };

  const value = useMemo(
    () => ({ user, loading, login, logout, spendCredits }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
