import { useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, ChevronDown, ChevronRight, LogOut, Map, PanelLeftClose, PanelLeftOpen, Settings, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatUserName, useAuth } from "@/contexts/AuthContext";
import { useIdf } from "@/modules/idf/context/IdfContext";
import { NAV_GROUPS } from "@/modules/idf/config/modules";
import { cn } from "@/lib/utils";

const EXTRA_ROUTES: Record<string, { group: string; label: string }> = {
  "/definicoes": { group: "Transversal", label: "Definições" },
  "/perfil": { group: "Conta", label: "Meu perfil" },
};

const initials = (value: string) =>
  value
    .split(/[\s.@]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

interface AppHeaderProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export const AppHeader = ({ sidebarOpen, onToggleSidebar }: AppHeaderProps) => {
  const { user, signOut } = useAuth();
  const { visibleAlerts, selectedConcessionLabel, selectConcession } = useIdf();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const location = useMemo(() => {
    if (EXTRA_ROUTES[pathname]) return EXTRA_ROUTES[pathname];
    let best: { group: string; label: string } | null = null;
    let bestLength = 0;
    for (const group of NAV_GROUPS) {
      for (const module of group.modules) {
        if (pathname.startsWith(module.path) && module.path.length > bestLength) {
          best = { group: group.label, label: module.label };
          bestLength = module.path.length;
        }
      }
    }
    return best ?? { group: "IDF", label: "Instituto de Desenvolvimento Florestal" };
  }, [pathname]);

  const displayName = formatUserName(user);

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth", { replace: true });
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-3 border-b bg-card/95 px-3 shadow-sm backdrop-blur-sm md:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 rounded-full"
          onClick={onToggleSidebar}
          aria-label={sidebarOpen ? "Esconder menu lateral" : "Mostrar menu lateral"}
        >
          {sidebarOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />}
        </Button>
        <div className="min-w-0">
          <nav aria-label="Localização" className="flex items-center gap-1 text-xs text-muted-foreground">
            <span className="truncate">{location.group}</span>
            <ChevronRight className="h-3 w-3 shrink-0" />
            <span className="truncate text-foreground">{location.label}</span>
          </nav>
          <p className="truncate font-display text-sm font-semibold text-foreground">{location.label}</p>
        </div>

        {selectedConcessionLabel && (
          <div className="hidden shrink-0 items-center gap-1 rounded-full border border-primary/25 bg-primary/5 py-1 pl-2.5 pr-1 text-xs font-medium text-primary sm:flex">
            <Map className="h-3.5 w-3.5" />
            <Link to="/idf/concessions" className="max-w-[10rem] truncate hover:underline" title="Concessão de trabalho — clique para alterar">
              {selectedConcessionLabel}
            </Link>
            <button
              type="button"
              onClick={() => selectConcession(null)}
              aria-label="Limpar concessão de trabalho"
              className="rounded-full p-0.5 text-primary/60 transition-colors hover:bg-primary/15 hover:text-primary"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative rounded-full" aria-label="Notificações">
              <Bell className="h-5 w-5" />
              {visibleAlerts.length > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                  {visibleAlerts.length}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 bg-popover">
            <DropdownMenuLabel>Notificações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {visibleAlerts.length === 0 ? (
              <p className="px-2 py-6 text-center text-sm text-muted-foreground">Sem notificações por agora.</p>
            ) : (
              visibleAlerts.map((alert) => (
                <DropdownMenuItem key={alert.id} className="whitespace-normal text-sm">
                  <span className={alert.level === "blocking" ? "text-destructive" : "text-foreground"}>
                    {alert.message}
                  </span>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="mx-1 hidden h-6 w-px bg-border sm:block" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className={cn(
                "flex items-center gap-2 rounded-full py-1 pl-1 pr-2 transition-colors hover:bg-muted",
                "sm:pr-2.5",
              )}
              aria-label="Menu do utilizador"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
                  {initials(displayName || "ID")}
                </AvatarFallback>
              </Avatar>
              <span className="hidden max-w-[9rem] truncate text-sm font-medium text-foreground md:inline">
                {displayName}
              </span>
              <ChevronDown className="hidden h-3.5 w-3.5 text-muted-foreground md:inline" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60 bg-popover">
            <DropdownMenuLabel className="space-y-0.5">
              <p className="text-sm font-semibold">{displayName}</p>
              <p className="truncate text-xs font-normal text-muted-foreground">{user?.email}</p>
              <p className="text-xs font-normal text-muted-foreground">{user?.roleCode}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/perfil">
                <User className="mr-2 h-4 w-4" />
                Meu perfil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/definicoes">
                <Settings className="mr-2 h-4 w-4" />
                Definições
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={handleSignOut} className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Terminar sessão
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default AppHeader;
