import { Flame, Hexagon, PawPrint, Trees } from "lucide-react";
import { PageHeader } from "@/components/idf/PageHeader";
import { LicensingCampaignHeader } from "@/components/idf/LicensingCampaignHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ExploitationLicenseTab from "@/modules/idf/pages/licensing/ExploitationLicenseTab";
import FirewoodLicenseTab from "@/modules/idf/pages/licensing/FirewoodLicenseTab";
import FaunaLicenseTab from "@/modules/idf/pages/licensing/FaunaLicenseTab";
import BeekeepingLicenseTab from "@/modules/idf/pages/licensing/BeekeepingLicenseTab";

const TABS = [
  { value: "exploitation", label: "Exploração Florestal", icon: Trees },
  { value: "firewood", label: "Lenha, Carvão e PFNL", icon: Flame },
  { value: "fauna", label: "Recursos Faunísticos", icon: PawPrint },
  { value: "beekeeping", label: "Apicultura", icon: Hexagon },
] as const;

/**
 * Licenciamento standalone — via independente, sem concessão prévia (diferente da Licença Anual
 * de Corte real em `/idf/licenses`). 4 abas mock, cada uma com o seu ciclo de estados — ver
 * `modules/idf/mock/licensing.ts` para a nota sobre a máquina de estados ser proposta pelo
 * protótipo, não definida na SIGAFLO/DRF-02.
 */
const LicensingPage = () => (
  <div className="space-y-6">
    <PageHeader
      title="Licenciamento"
      description="Exploração florestal, lenha/carvão/PFNL, recursos faunísticos e apicultura — sem concessão prévia."
      crumbs={[{ label: "Exploração" }, { label: "Licenciamento" }]}
    />

    <LicensingCampaignHeader />

    <Tabs defaultValue="exploitation">
      <TabsList className="grid h-auto w-full grid-cols-2 gap-2 rounded-xl bg-transparent p-0 sm:grid-cols-4">
        {TABS.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="flex flex-col items-center gap-1.5 rounded-xl border border-border/70 bg-card px-3 py-3 text-xs font-semibold text-muted-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md data-[state=active]:border-primary data-[state=active]:bg-primary/5 data-[state=active]:text-primary data-[state=active]:shadow-md"
          >
            <tab.icon className="h-5 w-5" />
            <span className="text-center leading-tight">{tab.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value="exploitation" className="mt-4">
        <ExploitationLicenseTab />
      </TabsContent>
      <TabsContent value="firewood" className="mt-4">
        <FirewoodLicenseTab />
      </TabsContent>
      <TabsContent value="fauna" className="mt-4">
        <FaunaLicenseTab />
      </TabsContent>
      <TabsContent value="beekeeping" className="mt-4">
        <BeekeepingLicenseTab />
      </TabsContent>
    </Tabs>
  </div>
);

export default LicensingPage;
