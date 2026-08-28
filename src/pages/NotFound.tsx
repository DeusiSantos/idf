import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background p-6 text-center">
    <h1 className="font-display text-5xl font-extrabold">404</h1>
    <p className="text-muted-foreground">Página não encontrada.</p>
    <Button asChild>
      <Link to="/">Voltar ao painel</Link>
    </Button>
  </div>
);

export default NotFound;
