import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { formatUserName, useAuth } from "@/contexts/AuthContext";
import { NAV_GROUPS, PERMISSION } from "@/modules/idf/config/modules";
import { usePermissions } from "@/modules/idf/hooks/usePermission";
import { cn } from "@/lib/utils";

interface IdfSidebarProps {
  className?: string;
  collapsed?: boolean;
  onNavigate?: () => void;
  /** Só faz sentido na instância fixa (desktop) — a versão dentro do Sheet mobile não recolhe. */
  onToggleCollapse?: () => void;
}

const initials = (value: string) =>
  value
    .split(/[\s.@]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

/**
 * Sidebar por categorias (secção 3.1) — fundo verde institucional (tokens --sidebar-*), accordion
 * de abertura única, grupo activo destacado a dourado, botão de recolher flutuante na borda, e
 * um rail de ícones no modo mini (mantém navegação directa mesmo recolhido).
 */
export const IdfSidebar = ({ className, collapsed = false, onNavigate, onToggleCollapse }: IdfSidebarProps) => {
  const location = useLocation();
  const { has } = usePermissions();
  const { user } = useAuth();
  const displayName = formatUserName(user);

  const groups = NAV_GROUPS.map((group) => ({
    ...group,
    modules: group.modules.filter((m) => has(m.service, PERMISSION.LIST)),
  })).filter((group) => group.modules.length > 0);

  const activeGroup = groups.find((g) => g.modules.some((m) => location.pathname.startsWith(m.path)))?.label;

  // Accordion de abertura única: abrir um grupo fecha automaticamente o que estava aberto.
  const [openGroup, setOpenGroup] = useState<string | null>(activeGroup ?? null);

  useEffect(() => {
    if (activeGroup) setOpenGroup(activeGroup);
  }, [activeGroup]);

  const toggleGroup = (label: string) => setOpenGroup((prev) => (prev === label ? null : label));

  return (
    <TooltipProvider delayDuration={100}>
      {/* z-20 (com position:relative) cria um contexto de stacking próprio, para o botão
          flutuante nunca ficar por baixo do header (que também usa z-10). */}
      <aside
        className={cn(
          "relative z-20 hidden h-full shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-300 ease-in-out md:flex",
          collapsed ? "w-16" : "w-72",
          className,
        )}
      >
        <div
          className={cn(
            "flex h-16 shrink-0 items-center border-b border-sidebar-border transition-[padding] duration-300",
            collapsed ? "justify-center px-2" : "px-5",
          )}
        >
          <BrandLogo variant="inverted" showText={!collapsed} />
        </div>

        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={collapsed ? "Expandir menu lateral" : "Recolher menu lateral"}
            aria-expanded={!collapsed}
            className="absolute -right-3 top-7 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-sidebar-border bg-sidebar text-sidebar-primary shadow-sm transition-colors duration-150 hover:border-sidebar-primary hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"
          >
            <ChevronLeft className={cn("h-3.5 w-3.5 transition-transform duration-300", collapsed && "rotate-180")} />
          </button>
        )}

        {collapsed ? (
          // Modo mini: rail de ícones directo — continua a navegar sem ter de reabrir a sidebar.
          <nav className="min-h-0 flex-1 space-y-3 overflow-y-auto px-2.5 py-5">
            {groups.map((group) =>
              group.modules.map(({ path, label, icon: Icon }) => (
                <Tooltip key={path}>
                  <TooltipTrigger asChild>
                    <NavLink
                      to={path}
                      onClick={onNavigate}
                      aria-label={label}
                      className={({ isActive }) =>
                        cn(
                          "mx-auto flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-150",
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                        )
                      }
                    >
                      <Icon className="h-[18px] w-[18px]" />
                    </NavLink>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="flex items-center gap-1.5">
                    <span className="text-xs text-muted-foreground">{group.label}</span>
                    <ChevronRight className="h-3 w-3 text-muted-foreground/60" />
                    <span>{label}</span>
                  </TooltipContent>
                </Tooltip>
              )),
            )}
          </nav>
        ) : (
          <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto px-3 py-3">
            {groups.map((group) => {
              const expanded = openGroup === group.label;
              const GroupIcon = group.modules[0].icon;

              return (
                <div key={group.label}>
                  <button
                    type="button"
                    onClick={() => toggleGroup(group.label)}
                    aria-expanded={expanded}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-2.5 py-2.5 text-left transition-colors duration-150",
                      expanded ? "bg-sidebar-accent/60" : "hover:bg-sidebar-accent/40",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors duration-150",
                        expanded
                          ? "bg-sidebar-primary text-sidebar-primary-foreground"
                          : "bg-sidebar-accent/50 text-sidebar-foreground/70",
                      )}
                    >
                      <GroupIcon className="h-4 w-4" />
                    </span>
                    <span
                      className={cn(
                        "flex-1 truncate text-[13.5px] font-semibold tracking-tight",
                        expanded ? "text-sidebar-foreground" : "text-sidebar-foreground/70",
                      )}
                    >
                      {group.label}
                    </span>
                    <span className="rounded-full bg-sidebar-accent/50 px-1.5 py-0.5 text-[10.5px] font-medium tabular-nums text-sidebar-foreground/70">
                      {group.modules.length}
                    </span>
                    <ChevronRight
                      className={cn(
                        "h-3.5 w-3.5 shrink-0 text-sidebar-foreground/50 transition-transform duration-300",
                        expanded && "rotate-90 text-sidebar-primary",
                      )}
                    />
                  </button>

                  <div
                    className={cn(
                      "grid transition-[grid-template-rows] duration-300 ease-in-out",
                      expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                    )}
                  >
                    <div className="overflow-hidden">
                      <ul className="ml-[21px] space-y-0.5 border-l border-sidebar-border py-1.5 pl-4">
                        {group.modules.map(({ path, label, icon: Icon }) => (
                          <li key={path}>
                            <NavLink
                              to={path}
                              onClick={onNavigate}
                              className={({ isActive }) =>
                                cn(
                                  "relative flex items-center gap-2 rounded-lg py-2 pl-3 pr-3 text-[13px] font-medium transition-all duration-150",
                                  "before:absolute before:-left-4 before:top-1/2 before:h-px before:w-3 before:-translate-y-1/2 before:bg-sidebar-border before:transition-colors before:duration-150",
                                  isActive
                                    ? cn(
                                        "bg-sidebar-accent font-semibold text-sidebar-accent-foreground",
                                        "before:w-3.5 before:bg-sidebar-primary",
                                        "after:absolute after:bottom-1.5 after:left-0 after:top-1.5 after:w-[2.5px] after:rounded-full after:bg-sidebar-primary",
                                      )
                                    : "text-sidebar-foreground/70 hover:translate-x-0.5 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                                )
                              }
                            >
                              <Icon className="h-3.5 w-3.5 shrink-0 opacity-70" />
                              <span className="truncate">{label}</span>
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </nav>
        )}

        <div className="border-t border-sidebar-border p-3">
          <Link
            to="/perfil"
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2.5 rounded-xl p-2 transition-colors hover:bg-sidebar-accent/50",
              collapsed && "justify-center",
            )}
          >
            <Avatar className="h-9 w-9 rounded-lg">
              <AvatarFallback className="rounded-lg bg-sidebar-primary text-xs font-bold text-sidebar-primary-foreground">
                {initials(displayName || "ID")}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <span className="min-w-0 leading-tight">
                <span className="block truncate text-[13px] font-semibold text-sidebar-foreground">{displayName}</span>
                <span className="block truncate text-[11px] text-sidebar-foreground/60">{user?.roleCode}</span>
              </span>
            )}
          </Link>
        </div>
      </aside>
    </TooltipProvider>
  );
};

export default IdfSidebar;
