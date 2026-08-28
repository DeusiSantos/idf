import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";

interface BrandLogoProps {
  className?: string;
  showText?: boolean;
  variant?: "default" | "inverted";
  /** Tamanho do símbolo — "md" (10 = 40px, omissão) ou "lg" (20 = 80px, destaque, ex. login). */
  size?: "md" | "lg";
}

const SIZE_CLASSES: Record<"md" | "lg", string> = {
  md: "h-10 w-10 rounded-xl",
  lg: "h-20 w-20 rounded-2xl",
};

/**
 * Marca do IDF — logótipo oficial (src/assets/logo.png) sempre à esquerda, com o nome por
 * extenso escrito ao lado (o texto embutido na imagem fica ilegível em tamanho pequeno).
 * Em fundos escuros (`variant="inverted"`), o logótipo fica sobre um chip branco para garantir
 * contraste, já que as suas cores são tons de verde próximos aos do tema escuro do sistema.
 */
export const BrandLogo = ({ className, showText = true, variant = "default", size = "md" }: BrandLogoProps) => {
  const inverted = variant === "inverted";
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span
        className={cn(
          "flex shrink-0 items-center justify-center",
          SIZE_CLASSES[size],
          inverted && "bg-white/95 p-1.5 shadow-sm",
        )}
      >
        <img src={logo} alt="IDF" className="h-full w-full object-contain" />
      </span>
      {showText && (
        <span className="leading-tight">
          <span
            className={cn(
              "block font-display text-lg font-extrabold tracking-tight",
              inverted ? "text-sidebar-foreground" : "text-foreground",
            )}
          >
            IDF
          </span>
          <span
            className={cn(
              "block text-[11px] font-medium",
              inverted ? "text-sidebar-foreground/70" : "text-muted-foreground",
            )}
          >
            Instituto de Desenvolvimento Florestal
          </span>
        </span>
      )}
    </div>
  );
};

export default BrandLogo;
