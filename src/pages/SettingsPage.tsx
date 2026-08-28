import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatUserName, useAuth } from "@/contexts/AuthContext";

const SettingsPage = () => {
  const { user, sessionStartedAt } = useAuth();

  return (
    <div className="space-y-6 max-w-2xl">
      <header className="space-y-1">
        <h1 className="font-display text-3xl font-extrabold tracking-tight">Definições</h1>
        <p className="text-muted-foreground">Configuração geral do sistema IDF.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Sessão actual</CardTitle>
          <CardDescription>Perfil autenticado neste dispositivo.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between border-b pb-2">
            <span className="text-muted-foreground">Utilizador</span>
            <span className="font-medium">{formatUserName(user)}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-muted-foreground">Nível de acesso</span>
            <span className="font-medium">{user?.roleCode ?? "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Início da sessão</span>
            <span className="font-medium">
              {sessionStartedAt ? sessionStartedAt.toLocaleString("pt-PT") : "—"}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
