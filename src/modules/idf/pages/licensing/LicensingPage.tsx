import { PageHeader } from "@/components/idf/PageHeader";
import { LicensingCampaignHeader } from "@/components/idf/LicensingCampaignHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ExploitationLicenseTab from "@/modules/idf/pages/licensing/ExploitationLicenseTab";
import FirewoodLicenseTab from "@/modules/idf/pages/licensing/FirewoodLicenseTab";
import FaunaLicenseTab from "@/modules/idf/pages/licensing/FaunaLicenseTab";
import BeekeepingLicenseTab from "@/modules/idf/pages/licensing/BeekeepingLicenseTab";

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
      <TabsList className="flex h-auto flex-wrap gap-1">
        <TabsTrigger value="exploitation">Exploração Florestal</TabsTrigger>
        <TabsTrigger value="firewood">Lenha, Carvão e PFNL</TabsTrigger>
        <TabsTrigger value="fauna">Recursos Faunísticos</TabsTrigger>
        <TabsTrigger value="beekeeping">Apicultura</TabsTrigger>
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
