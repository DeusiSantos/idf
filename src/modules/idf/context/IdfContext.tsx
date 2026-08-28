import { createContext, useCallback, useContext, useMemo, useState, ReactNode } from "react";

export type IdfAlertLevel = "warning" | "blocking";

export interface IdfAlert {
  id: string;
  level: IdfAlertLevel;
  message: string;
}

interface IdfContextValue {
  /** Concessão seleccionada — filtra listagens downstream. */
  selectedConcessionId: string | null;
  selectedConcessionLabel: string | null;
  selectConcession: (id: string | null, label?: string | null) => void;
  alerts: IdfAlert[];
  visibleAlerts: IdfAlert[];
  setAlerts: (alerts: IdfAlert[]) => void;
  dismissAlert: (id: string) => void;
}

const CONCESSION_KEY = "idf.selectedConcession";

const IdfContext = createContext<IdfContextValue | undefined>(undefined);

export const IdfProvider = ({ children }: { children: ReactNode }) => {
  const [selected, setSelected] = useState<{ id: string; label: string | null } | null>(() => {
    try {
      const raw = window.localStorage.getItem(CONCESSION_KEY);
      return raw ? (JSON.parse(raw) as { id: string; label: string | null }) : null;
    } catch {
      return null;
    }
  });
  const [alerts, setAlerts] = useState<IdfAlert[]>([]);
  const [dismissed, setDismissed] = useState<string[]>([]);

  const selectConcession = useCallback((id: string | null, label: string | null = null) => {
    const next = id ? { id, label } : null;
    setSelected(next);
    try {
      if (next) window.localStorage.setItem(CONCESSION_KEY, JSON.stringify(next));
      else window.localStorage.removeItem(CONCESSION_KEY);
    } catch {
      // ignora
    }
  }, []);

  const dismissAlert = useCallback((id: string) => setDismissed((prev) => [...prev, id]), []);

  const value = useMemo<IdfContextValue>(
    () => ({
      selectedConcessionId: selected?.id ?? null,
      selectedConcessionLabel: selected?.label ?? null,
      selectConcession,
      alerts,
      visibleAlerts: alerts.filter((a) => !dismissed.includes(a.id)),
      setAlerts,
      dismissAlert,
    }),
    [selected, alerts, dismissed, selectConcession, dismissAlert],
  );

  return <IdfContext.Provider value={value}>{children}</IdfContext.Provider>;
};

export const useIdf = () => {
  const context = useContext(IdfContext);
  if (!context) throw new Error("useIdf must be used within an IdfProvider");
  return context;
};
