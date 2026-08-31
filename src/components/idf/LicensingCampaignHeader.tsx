import { useState } from "react";
import { Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { getCampaignSettings, setCampaignSettings } from "@/modules/idf/mock/licensing";

/**
 * Cabeçalho comum às 4 abas do Licenciamento: toggle de prorrogação geral da campanha (sem
 * duração fixa — sugestão inicial 90 dias, sempre editável) + aviso fixo com os pré-requisitos
 * comuns pedidos no prompt.
 */
export const LicensingCampaignHeader = () => {
  const [settings, setSettings] = useState(getCampaignSettings);

  const update = (next: typeof settings) => {
    setSettings(next);
    setCampaignSettings(next);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="flex flex-wrap items-center gap-4 p-4">
          <div className="flex items-center gap-2">
            <Switch
              id="campaign-extension"
              checked={settings.extensionEnabled}
              onCheckedChange={(checked) => update({ ...settings, extensionEnabled: checked })}
            />
            <Label htmlFor="campaign-extension">Prorrogação geral da campanha</Label>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="campaign-extension-days" className="text-sm text-muted-foreground">
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

      <div className="flex items-start gap-3 rounded-lg border border-info/30 bg-info/10 px-4 py-3 text-sm text-info">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          Pré-requisitos comuns: requerente activo · área com parecer cadastral conforme (quando aplicável) · saldo de quota
          disponível · pagamento confirmado antes da emissão · licença sempre intransmissível · bloqueio automático em
          províncias com suspensão administrativa.
        </p>
      </div>
    </div>
  );
};

export default LicensingCampaignHeader;
