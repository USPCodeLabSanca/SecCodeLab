import { Shield, Terminal, BookOpen, FlaskConical, Target, Code, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import VulnerabilityCard from "@/components/VulnerabilityCard";
import { useVulnerabilities } from "@/hooks/useVulnerabilities";

const Index = () => {
  const { vulnerabilities } = useVulnerabilities();
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative border-b border-border overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
              Aprenda segurança
              <br />
              <span className="text-primary glow-text">quebrando código.</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
              Estude vulnerabilidades reais, analise código vulnerável e aprenda
              a proteger aplicações — tudo de forma prática.
            </p>
          </div>

          {/* Stats */}
          <div className="flex gap-8 mt-10">
            {[
              { icon: BookOpen, label: "Artigos", value: vulnerabilities.length },
              { icon: FlaskConical, label: "Labs práticos", value: vulnerabilities.length },
              { icon: Shield, label: "Categorias", value: new Set(vulnerabilities.map(v => v.category)).size },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-3">
                <stat.icon className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-xl font-bold font-mono text-foreground">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About section */}
      <section className="border-b border-border">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-2xl font-bold font-mono text-foreground mb-4">
              Como funciona o <span className="text-primary">secCodeLab</span>?
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Acreditamos que a melhor forma de aprender segurança é colocando a mão no código.
              Cada módulo combina teoria acessível com laboratórios práticos para que você
              entenda como vulnerabilidades funcionam — e como corrigi-las.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
            {[
              {
                icon: BookOpen,
                title: "Leia o artigo",
                desc: "Cada vulnerabilidade é explicada de forma clara e didática, com exemplos de código reais e linguagem acessível.",
              },
              {
                icon: Code,
                title: "Baixe o laboratório",
                desc: "Ao final de cada artigo, baixe um arquivo .zip com código-fonte propositalmente vulnerável para analisar.",
              },
              {
                icon: Target,
                title: "Encontre e corrija",
                desc: "Execute o código no seu ambiente local, identifique a falha de segurança e implemente a correção.",
              },
            ].map((step, i) => (
              <div
                key={step.title}
                className="relative rounded-lg border border-border bg-card p-6 text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="absolute top-4 right-4 text-xs font-mono text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="font-mono font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content list */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-px flex-1 bg-border" />
          <h2 className="font-mono text-sm text-muted-foreground tracking-widest uppercase">
            Vulnerabilidades
          </h2>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {vulnerabilities.map((v) => (
            <VulnerabilityCard key={v.id} vulnerability={v} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          Feito com <span className="text-destructive">❤</span> por{" "}
          <span className="font-mono font-semibold text-foreground">USPCodeLab</span>
        </div>
      </footer>
    </div>
  );
};

export default Index;
