import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Download, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { useVulnerabilities } from "@/hooks/useVulnerabilities";
import { Badge } from "@/components/ui/badge";

const LabDetail = () => {
  const { slug } = useParams();
  const { vulnerabilities } = useVulnerabilities();
  const vulnerability = vulnerabilities.find((v) => v.slug === slug);

  if (!vulnerability) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-mono text-foreground mb-4">Conteúdo não encontrado</h1>
          <Link to="/" className="text-primary hover:underline">
            Voltar ao início
          </Link>
        </div>
      </div>
    );
  }

  const handleDownload = () => {
    if (vulnerability.labZipUrl) {
      const a = document.createElement("a");
      a.href = vulnerability.labZipUrl;
      a.download = vulnerability.labFileName;
      a.click();
    }
  };

  const hasLab = !!vulnerability.labZipUrl;

  const difficultyColor =
    vulnerability.difficulty === "iniciante"
      ? "bg-primary/15 text-primary border-primary/30"
      : "bg-warning/15 text-warning border-warning/30";

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar aos conteúdos
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <span className="text-4xl">{vulnerability.icon}</span>
          <div className="flex gap-2">
            <Badge variant="outline" className={difficultyColor}>
              {vulnerability.difficulty}
            </Badge>
            <Badge variant="outline" className="bg-secondary/50 text-secondary-foreground border-border">
              {vulnerability.category}
            </Badge>
          </div>
        </div>

        <article className="mb-12">
          <MarkdownRenderer content={vulnerability.content} />
        </article>

        <div className="rounded-lg border border-primary/30 bg-primary/5 p-6 glow-primary">
          <div className="flex items-start gap-4">
            <FlaskConical className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-mono text-lg font-semibold text-foreground mb-2">
                Laboratório Prático
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Baixe o arquivo zip com o código vulnerável, extraia e siga as instruções
                para analisar e corrigir a falha no seu ambiente local.
              </p>
              <div className="flex items-center gap-3">
                <Button onClick={handleDownload} disabled={!hasLab} className="gap-2">
                  <Download className="h-4 w-4" />
                  Ir para o laboratório
                </Button>
                <span className="text-xs text-muted-foreground font-mono">
                  {vulnerability.labFileName}
                </span>
              </div>
              {!hasLab && (
                <p className="text-xs text-muted-foreground mt-3">
                  ⏳ Laboratório em breve — o arquivo zip ainda não foi adicionado.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t border-border py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          Feito com <span className="text-destructive">❤</span> por{" "}
          <span className="font-mono font-semibold text-foreground">USPCodeLab</span>
        </div>
      </footer>
    </div>
  );
};

export default LabDetail;
