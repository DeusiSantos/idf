import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  Axe,
  Boxes,
  Coins,
  FileCheck,
  Map,
  Search,
  ShieldAlert,
  Ship,
  TreePine,
  Users,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartTooltip } from "@/components/idf/ChartTooltip";
import { PageHeader } from "@/components/idf/PageHeader";
import { VolumeProgress } from "@/components/idf/VolumeProgress";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getDashboardData, type DashboardKpis } from "@/modules/idf/api/dashboard";
import { CATEGORICAL, CHART_CHROME, foldCategorical } from "@/lib/chartTheme";
import { formatDate } from "@/lib/date";
import { cn } from "@/lib/utils";

const currency = (value: number) =>
  new Intl.NumberFormat("pt-AO", { style: "currency", currency: "AOA", notation: "compact", maximumFractionDigits: 1 }).format(
    value,
  );

const number = (value: number) => value.toLocaleString("pt-AO");

const KPI: { key: keyof DashboardKpis; label: string; icon: typeof Users; to: string }[] = [
  { key: "operatorsCount", label: "Operadores", icon: Users, to: "/idf/operators" },
  { key: "concessionsCount", label: "Concessões", icon: Map, to: "/idf/concessions" },
  { key: "licensesCount", label: "Licenças", icon: FileCheck, to: "/idf/licenses" },
  { key: "activeOperationsCount", label: "Explorações activas", icon: Axe, to: "/idf/exploitation" },
  { key: "lotsCount", label: "Lotes", icon: Boxes, to: "/idf/production" },
  { key: "exportsCount", label: "Exportações", icon: Ship, to: "/idf/exports" },
  { key: "inspectionsCount", label: "Inspecções", icon: Search, to: "/idf/inspections" },
  { key: "enforcementOpenCount", label: "Processos em aberto", icon: ShieldAlert, to: "/idf/enforcement" },
];

const DashboardPage = () => {
  const { data, isLoading } = useQuery({ queryKey: ["idf", "dashboard"], queryFn: getDashboardData });
  const kpis = data?.kpis;

  const licenseStatus = data ? foldCategorical(data.licenseStatus) : [];
  const revenueBySource = data ? foldCategorical(data.revenueBySource, 6) : [];
  const maxRevenueSource = Math.max(1, ...revenueBySource.map((r) => r.value));
  const licenseTotal = licenseStatus.reduce((sum, s) => sum + s.value, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Visão geral"
        crumbs={[{ label: "Dashboard" }, { label: "Visão geral" }]}
        description="Indicadores da cadeia florestal integrada: operador → concessão → quota → licença → produção → exportação."
        actions={
          <Button asChild variant="outline">
            <Link to="/idf/map">
              <Map className="mr-2 h-4 w-4" />
              Ver mapa
            </Link>
          </Button>
        }
      />

      {/* KPIs — grelha de stat tiles clicáveis. */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {KPI.map(({ key, label, icon: Icon, to }) => (
          <Link key={key} to={to} className="rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <Card className="h-full border-border/70 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
              <CardContent className="flex items-center gap-3.5 p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-[18px] w-[18px]" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-xs text-muted-foreground">{label}</p>
                  {isLoading ? (
                    <Skeleton className="mt-1 h-6 w-12" />
                  ) : (
                    <p className="font-display text-xl font-extrabold tabular-nums leading-tight">
                      {number(kpis?.[key] ?? 0)}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Cartões em destaque: receita, volume de quota, área. */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-border/70 shadow-sm">
          <CardHeader className="pb-1">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Coins className="h-4 w-4" />
              Receita liquidada
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-16 w-full" />
            ) : (
              <>
                <p className="font-display text-3xl font-extrabold tabular-nums">{currency(kpis?.revenueTotal ?? 0)}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Pendente: {currency(kpis?.revenuePending ?? 0)}</p>
                {data && data.monthlyRevenue.length > 1 && (
                  <div className="mt-2 h-10 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data.monthlyRevenue} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
                        <defs>
                          <linearGradient id="revenueSpark" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.28} />
                            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="hsl(var(--primary))"
                          strokeWidth={2}
                          fill="url(#revenueSpark)"
                          isAnimationActive={false}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/70 shadow-sm">
          <CardHeader className="pb-1">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <TreePine className="h-4 w-4" />
              Consumo global de quotas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-16 w-full" />
            ) : (
              <VolumeProgress
                consumed={kpis?.consumedVolume ?? 0}
                authorized={kpis?.authorizedVolume ?? 0}
                label="Volume autorizado"
              />
            )}
            <p className="mt-3 text-xs text-muted-foreground">
              {number(kpis?.harvestedTreesCount ?? 0)} árvores abatidas registadas
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/70 shadow-sm">
          <CardHeader className="pb-1">
            <CardTitle className="text-sm font-medium text-muted-foreground">Área concessionada</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-16 w-32" />
            ) : (
              <>
                <p className="font-display text-3xl font-extrabold tabular-nums">{number(kpis?.areaHectares ?? 0)}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">hectares sob concessão activa</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Quotas — uma barra-meter por quota, em vez de um gráfico de barras genérico:
            é literalmente "um rácio contra um limite", repetido. */}
        <Card className="border-border/70 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Quotas: consumo por concessão</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : !data?.quotaUsage.length ? (
              <p className="py-10 text-center text-sm text-muted-foreground">Sem quotas registadas.</p>
            ) : (
              <div className="max-h-64 space-y-4 overflow-y-auto pr-1">
                {data.quotaUsage.map((q) => (
                  <VolumeProgress key={q.code} consumed={q.consumed} authorized={q.authorized} label={q.code} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Receita mensal — série única: uma linha, sem legenda (o título já diz o que é). */}
        <Card className="border-border/70 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Receita liquidada por mês</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            {isLoading ? (
              <Skeleton className="h-full w-full" />
            ) : !data?.monthlyRevenue.length ? (
              <p className="flex h-full items-center justify-center text-sm text-muted-foreground">
                Sem receita liquidada ainda.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.monthlyRevenue} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
                  <defs>
                    <linearGradient id="revenueArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.22} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="0" stroke={CHART_CHROME.grid} vertical={false} />
                  <XAxis
                    dataKey="name"
                    fontSize={11}
                    stroke={CHART_CHROME.axis}
                    tickLine={false}
                    axisLine={{ stroke: CHART_CHROME.grid }}
                  />
                  <YAxis
                    fontSize={11}
                    stroke={CHART_CHROME.axis}
                    tickLine={false}
                    axisLine={false}
                    width={44}
                    tickFormatter={(v: number) => currency(v)}
                  />
                  <Tooltip
                    cursor={{ stroke: CHART_CHROME.grid, strokeWidth: 1 }}
                    content={<ChartTooltip formatValue={(v) => currency(Number(v))} />}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    name="Receita"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fill="url(#revenueArea)"
                    dot={{ r: 3, fill: "hsl(var(--primary))", strokeWidth: 0 }}
                    activeDot={{ r: 5, strokeWidth: 2, stroke: "hsl(var(--card))" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Licenças por estado — identidade (categórica), donut com legenda. */}
        <Card className="border-border/70 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Licenças por estado</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : !licenseStatus.length ? (
              <p className="flex h-64 items-center justify-center text-sm text-muted-foreground">
                Sem licenças registadas.
              </p>
            ) : (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="relative h-48 w-48 shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={licenseStatus}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={58}
                        outerRadius={80}
                        paddingAngle={2}
                        cornerRadius={4}
                        stroke="none"
                        isAnimationActive={false}
                      >
                        {licenseStatus.map((entry, index) => (
                          <Cell key={entry.name} fill={CATEGORICAL[index % CATEGORICAL.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<ChartTooltip formatValue={(v) => `${v}`} />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-display text-2xl font-extrabold tabular-nums">{licenseTotal}</span>
                    <span className="text-[11px] text-muted-foreground">licenças</span>
                  </div>
                </div>
                <ul className="min-w-0 flex-1 space-y-1.5">
                  {licenseStatus.map((entry, index) => (
                    <li key={entry.name} className="flex items-center gap-2 text-sm">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: CATEGORICAL[index % CATEGORICAL.length] }}
                      />
                      <span className="truncate text-muted-foreground">{entry.name}</span>
                      <span className="ml-auto font-medium tabular-nums text-foreground">{entry.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Receita por origem — identidade (categórica), classificação horizontal em vez de pizza
            (até 6 fatias de estado cabem bem num donut; até 10 tipos de acto ficam mais legíveis em lista). */}
        <Card className="border-border/70 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Receita por origem</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : !revenueBySource.length ? (
              <p className="flex h-64 items-center justify-center text-sm text-muted-foreground">
                Sem receita paga ainda.
              </p>
            ) : (
              <ul className="space-y-3">
                {revenueBySource.map((entry, index) => {
                  const color = CATEGORICAL[index % CATEGORICAL.length];
                  const width = Math.max(4, (entry.value / maxRevenueSource) * 100);
                  return (
                    <li key={entry.name}>
                      <div className="mb-1 flex items-baseline justify-between gap-2 text-xs">
                        <span className="truncate text-muted-foreground">{entry.name}</span>
                        <span className="shrink-0 font-semibold tabular-nums text-foreground">{currency(entry.value)}</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full transition-[width] duration-500"
                          style={{ width: `${width}%`, backgroundColor: color }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Volume por espécie — magnitude (sequencial, um só matiz de marca), nunca categórica. */}
      <Card className="border-border/70 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Volume abatido por espécie (m3)</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          {isLoading ? (
            <Skeleton className="h-full w-full" />
          ) : !data?.speciesVolume.length ? (
            <p className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Sem árvores abatidas registadas no inventário.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.speciesVolume} layout="vertical" margin={{ left: 8, right: 24 }} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="0" stroke={CHART_CHROME.grid} horizontal={false} />
                <XAxis type="number" fontSize={11} stroke={CHART_CHROME.axis} tickLine={false} axisLine={false} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={110}
                  fontSize={11}
                  stroke={CHART_CHROME.axis}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip cursor={{ fill: "hsl(var(--muted) / 0.5)" }} content={<ChartTooltip formatValue={(v) => `${v} m³`} />} />
                <Bar dataKey="value" name="Volume" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} maxBarSize={20} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card className="border-border/70 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Actividade recente</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1.5">
          {isLoading && <Skeleton className="h-24 w-full" />}
          {!isLoading && (data?.recentActivity.length ?? 0) === 0 && (
            <p className="text-sm text-muted-foreground">Sem actividade registada.</p>
          )}
          {data?.recentActivity.map((row, index) => (
            <div
              key={`${row.type}-${row.label}-${index}`}
              className={cn(
                "flex flex-wrap items-center justify-between gap-2 rounded-xl px-3 py-2.5",
                index % 2 === 0 && "bg-muted/30",
              )}
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{row.label}</p>
                <p className="text-xs text-muted-foreground">{row.type}</p>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">{formatDate(row.date)}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
