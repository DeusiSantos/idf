import { Children, isValidElement, type ReactNode } from "react";

interface RelatedSectionProps {
  children: ReactNode;
}

/**
 * Agrupa `RelatedEntityCard`s sob o título "Processos relacionados". Omite-se por completo quando
 * nenhum filho renderiza (ex.: todas as ligações são opcionais e estão vazias neste registo).
 */
export const RelatedSection = ({ children }: RelatedSectionProps) => {
  const items = Children.toArray(children).filter((child) => isValidElement(child) && child.props.id);
  if (items.length === 0) return null;

  return (
    <div className="space-y-3">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Processos relacionados</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </div>
  );
};

export default RelatedSection;
