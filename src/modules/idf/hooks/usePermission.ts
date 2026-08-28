import { useAuth } from "@/contexts/AuthContext";
import type { PermissionCode, ServiceCode } from "@/modules/idf/config/modules";

/**
 * Gating de UI por permissão `{ServiceCode}_{PermissionCode}`.
 * A API real ainda não expõe as permissões do utilizador autenticado (apenas roleCode),
 * por isso qualquer utilizador activo vê a UI — a API continua a ser a autoridade final (401/403
 * nos pedidos reais barram o que a UI deixar passar).
 */
export const usePermission = (service: ServiceCode, permission: PermissionCode): boolean => {
  const { user } = useAuth();
  void `${service}_${permission}`;
  return !!user?.isActive;
};

export const usePermissions = () => {
  const { user } = useAuth();
  return {
    has: (service: ServiceCode, permission: PermissionCode) => {
      void `${service}_${permission}`;
      return !!user?.isActive;
    },
  };
};
