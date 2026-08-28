import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { KeyRound, Mail, Loader2, Shield, User, Clock, LogOut } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QueryError } from "@/components/ui/query-state";
import { formatUserName, useAuth } from "@/contexts/AuthContext";
import { getApiErrorMessage } from "@/lib/apiError";
import { getMyProfile, updateMyProfile, type GenderType } from "@/service/userProfiles";
import { toast } from "sonner";

const ProfilePage = () => {
  const { user, sessionStartedAt, changePassword, signOut } = useAuth();
  const queryClient = useQueryClient();

  const { data: profile, isLoading, error, refetch } = useQuery({
    queryKey: ["me", "profile"],
    queryFn: getMyProfile,
  });

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Preenche o formulário apenas quando o perfil chega (não sobrescrever o que o utilizador está a digitar).
  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName ?? "");
      setLastName(profile.lastName ?? "");
    }
  }, [profile]);

  const updateMutation = useMutation({
    mutationFn: () => {
      if (!profile) throw new Error("Perfil ainda não carregado.");
      return updateMyProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        birthdate: profile.birthdate,
        gender: profile.gender as GenderType | null,
        identification: profile.identification,
        contact: profile.contact,
        address: profile.address,
        roleId: profile.roleId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me", "profile"] });
      toast.success("Perfil actualizado.");
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err, "Não foi possível actualizar o perfil."));
    },
  });

  const displayName = formatUserName(user);
  const initials = (displayName || "ID")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleProfile = (event: React.FormEvent) => {
    event.preventDefault();
    if (firstName.trim().length < 2 || lastName.trim().length < 2) {
      toast.error("Preencha o nome próprio e o apelido.");
      return;
    }
    updateMutation.mutate();
  };

  const handlePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setPasswordError(null);
    if (next.length < 6) {
      setPasswordError("A nova palavra-passe deve ter pelo menos 6 caracteres.");
      return;
    }
    if (next !== confirm) {
      setPasswordError("A confirmação não coincide com a nova palavra-passe.");
      return;
    }
    setIsChangingPassword(true);
    try {
      await changePassword(current, next);
      setCurrent("");
      setNext("");
      setConfirm("");
      toast.success("Palavra-passe alterada com sucesso.");
    } catch (err) {
      setPasswordError(getApiErrorMessage(err, "Não foi possível alterar a palavra-passe."));
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header className="space-y-1">
        <h1 className="font-display text-2xl font-extrabold tracking-tight md:text-3xl">Meu perfil</h1>
        <p className="text-sm text-muted-foreground">Dados da conta, segurança de acesso e sessão activa.</p>
      </header>

      <Card className="overflow-hidden">
        <div className="h-20 bg-gradient-to-r from-primary to-primary/70" />
        <CardContent className="-mt-10 flex flex-col gap-4 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-4">
            <Avatar className="h-20 w-20 border-4 border-card">
              <AvatarFallback className="bg-primary text-xl font-bold text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="pb-1">
              <p className="font-display text-lg font-bold">{displayName}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <Badge className="w-fit gap-1.5">
            <Shield className="h-3.5 w-3.5" />
            {profile?.role?.name ?? user?.roleCode ?? "—"}
          </Badge>
        </CardContent>
      </Card>

      <Tabs defaultValue="dados">
        <TabsList>
          <TabsTrigger value="dados">Dados pessoais</TabsTrigger>
          <TabsTrigger value="seguranca">Segurança</TabsTrigger>
          <TabsTrigger value="sessao">Sessão</TabsTrigger>
        </TabsList>

        <TabsContent value="dados" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Dados da conta</CardTitle>
              <CardDescription>Actualize o nome apresentado no sistema.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-40 w-full" />
              ) : error || !profile ? (
                <QueryError error={error as Error} onRetry={() => refetch()} />
              ) : (
                <form onSubmit={handleProfile} className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nome próprio</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Apelido</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email institucional</Label>
                    <Input id="email" value={user?.email ?? ""} readOnly disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Nível de acesso</Label>
                    <Input value={profile.role?.name ?? user?.roleCode ?? ""} readOnly disabled />
                  </div>
                  <div className="sm:col-span-2">
                    <Button type="submit" disabled={updateMutation.isPending}>
                      {updateMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <User className="mr-2 h-4 w-4" />
                      )}
                      Guardar dados
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seguranca" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Alterar palavra-passe</CardTitle>
              <CardDescription>Mínimo de 6 caracteres.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePassword} className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="current">Palavra-passe actual</Label>
                  <Input
                    id="current"
                    type="password"
                    value={current}
                    onChange={(e) => setCurrent(e.target.value)}
                    disabled={isChangingPassword}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="next">Nova palavra-passe</Label>
                  <Input
                    id="next"
                    type="password"
                    value={next}
                    onChange={(e) => setNext(e.target.value)}
                    disabled={isChangingPassword}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm">Confirmar nova palavra-passe</Label>
                  <Input
                    id="confirm"
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    disabled={isChangingPassword}
                    required
                  />
                </div>
                {passwordError && <p className="text-sm text-destructive sm:col-span-2">{passwordError}</p>}
                <div className="sm:col-span-2">
                  <Button type="submit" disabled={isChangingPassword}>
                    {isChangingPassword ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <KeyRound className="mr-2 h-4 w-4" />
                    )}
                    Alterar palavra-passe
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessao" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Sessão actual</CardTitle>
              <CardDescription>Informação da sessão iniciada neste dispositivo.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-lg border p-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Início da sessão</p>
                    <p className="text-sm font-medium">
                      {sessionStartedAt?.toLocaleString("pt-PT") ?? "—"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border p-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Conta</p>
                    <p className="text-sm font-medium">{user?.email}</p>
                  </div>
                </div>
              </div>
              <Separator />
              <Button variant="destructive" onClick={signOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Terminar sessão
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
