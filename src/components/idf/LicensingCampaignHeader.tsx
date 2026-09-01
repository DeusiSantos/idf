import { useState } from "react";
import { Ban, CheckCircle2, CircleDollarSign, MapPinned, ShieldAlert, UserCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { getCampaignSettings, setCampaignSettings } from "@/modules/idf/mock/licensing";

const PREREQUISITES = [
  { icon: UserCheck, text: "Requerente activo" },
  { icon: MapPinned, text: "Área com parecer cadastral conforme (quando aplicável)" },
  { icon: CheckCircle2, text: "Saldo de quota disponível" },
  { icon: CircleDollarSign, text: "Pagamento confirmado antes da emissão" },
  { icon: Ban, text: "Licença sempre intransmissível" },
  { icon: ShieldAlert, text: "Bloqueio automático em províncias com suspensão administrativa" },
];

/**
 * Cabeçalho comum às 4 abas do Licenciamento: toggle de prorrogação geral da campanha (sem
 * duração fixa — sugestão inicial 90 dias, sempre editável) + checklist dos pré-requisitos
 * comuns pedidos no prompt.
 */
export const LicensingCampaignHeader = () => {
  const [settings, setSettings] = useState(getCampaignSettings);

  const update = (next: typeof settings) => {
    setSettings(next);
    setCampaignSettings(next);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
      <Card className="border-border/70 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Campanha</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-3 rounded-lg border bg-muted/30 px-3 py-2.5">
            <Label htmlFor="campaign-extension" className="text-sm font-medium">
              Prorrogação geral da campanha
            </Label>
            <Switch
              id="campaign-extension"
              checked={settings.extensionEnabled}
              onCheckedChange={(checked) => update({ ...settings, extensionEnabled: checked })}
            />
          </div>
          <div className="flex items-center gap-3">
            <Label htmlFor="campaign-extension-days" className="flex-1 text-sm text-muted-foreground">
              Nº de dias de prorrogação
            </Label>
            <Input
              id="campaign-extension-days"
              type="number"
              min={1}
              className="w-24"
              disabled={!settings.extensionEnabled}
              value={settings.extensionDays}
              onChange={(e) => update({ ...settings, extensionDays: Number(e.target.value) })}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-info/30 bg-info/5 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-info">Pré-requisitos comuns</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-2.5 sm:grid-cols-2">
            {PREREQUISITES.map((item) => (
              <li key={item.text} className="flex items-start gap-2 text-sm text-foreground/90">
                <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-info" />
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default LicensingCampaignHeader;
