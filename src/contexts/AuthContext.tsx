// AuthContext.tsx
import api from "@/service/api";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";

export const apiClient = api;

// Dados do utilizador retornados por GET auth/me
export interface AuthUser {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  roleId: string;
  roleCode: string;
  isActive: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  /** Início da sessão activa neste dispositivo (aproximado — momento em que ficámos autenticados). */
  sessionStartedAt: Date | null;
  login: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
}

/** Nome apresentável do utilizador — cai para o email quando não há nome definido. */
export function formatUserName(user: Pick<AuthUser, "firstName" | "lastName" | "email"> | null | undefined): string {
  if (!user) return "";
  const name = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
  return name || user.email || "";
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionStartedAt, setSessionStartedAt] = useState<Date | null>(null);

  // Buscar usuário atual no mount (se houver cookie/sessão ativa)
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await api.get<AuthUser>("auth/me");
        setUser(response.data);
        setSessionStartedAt(new Date());
      } catch (error) {
        // Sessão não existe ou expirou
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  // Disparado pelo interceptor do axios (api.ts) quando qualquer pedido recebe 401 —
  // limpa a sessão de imediato, o ProtectedRoute trata do redireccionamento para o login.
  useEffect(() => {
    const handleUnauthorized = () => {
      setUser((prev) => {
        if (prev) {
          toast.error("A sua sessão expirou. Inicie sessão novamente.");
        }
        return null;
      });
      setSessionStartedAt(null);
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, []);

  const login = async (email: string, password: string) => {
    // Login - backend salva o cookie automaticamente
    await api.post("auth/login", { email, password });

    // Após login, buscar dados do usuário
    const response = await api.get<AuthUser>("auth/me");
    setUser(response.data);
    setSessionStartedAt(new Date());
  };

  const signOut = async () => {
    try {
      await api.post("auth/logout");
    } catch {
      // Ignorar erros de rede
    } finally {
      setUser(null);
      setSessionStartedAt(null);
    }
  };

  const refreshUser = async () => {
    try {
      const response = await api.get<AuthUser>("auth/me");
      setUser(response.data);
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
    }
  };

  const changePassword = async (oldPassword: string, newPassword: string) => {
    await api.post("auth/change-password", { oldPassword, newPassword });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        sessionStartedAt,
        login,
        signOut,
        refreshUser,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}