import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import { useVulnerabilities } from "@/hooks/useVulnerabilities";
import type { Difficulty, Vulnerability } from "@/data/vulnerabilities";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

const ICONS = ["🔥", "💉", "🎭", "🔓", "⚡", "🐛", "🕷️", "💀", "🛡️", "⚠️"];

const Admin = () => {
  const { vulnerabilities, add, remove, isCustom } = useVulnerabilities();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("iniciante");
  const [icon, setIcon] = useState("🔥");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [labFileName, setLabFileName] = useState("");
  const [labZipUrl, setLabZipUrl] = useState("");

  const generateSlug = (t: string) =>
    t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !content) {
      toast({ title: "Preencha todos os campos obrigatórios", variant: "destructive" });
      return;
    }

    const newVuln: Vulnerability = {
      id: crypto.randomUUID(),
      title,
      slug: generateSlug(title),
      category: category || "Geral",
      difficulty,
      icon,
      description,
      content,
      labFileName: labFileName || `lab-${generateSlug(title)}.zip`,
      labZipUrl,
    };

    add(newVuln);
    toast({ title: "Aula adicionada com sucesso!" });

    setTitle("");
    setCategory("");
    setDescription("");
    setContent("");
    setLabFileName("");
    setLabZipUrl("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar ao início
        </Link>

        <h1 className="text-3xl font-bold font-mono text-foreground mb-2">
          <span className="text-primary">Admin</span> — Gerenciar Aulas
        </h1>
        <p className="text-muted-foreground mb-10">
          Adicione novas vulnerabilidades e laboratórios ao secCodeLab.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6 mb-16">
          <div className="rounded-lg border border-border bg-card p-6 space-y-5">
            <h2 className="font-mono text-lg font-semibold text-foreground flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" /> Nova Aula
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Título *</label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Cross-Site Scripting (XSS)" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Categoria</label>
                <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Ex: Injeção, Sessão, Controle de Acesso" />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Dificuldade</label>
                <Select value={difficulty} onValueChange={(v) => setDifficulty(v as Difficulty)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="iniciante">Iniciante</SelectItem>
                    <SelectItem value="intermediário">Intermediário</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Ícone</label>
                <div className="flex gap-2 flex-wrap">
                  {ICONS.map((ic) => (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => setIcon(ic)}
                      className={`text-2xl p-1.5 rounded-md transition-all ${
                        icon === ic ? "bg-primary/20 ring-2 ring-primary" : "hover:bg-secondary"
                      }`}
                    >
                      {ic}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Descrição curta *</label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Uma breve descrição que aparece no card da página principal" rows={2} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Conteúdo do artigo (Markdown) *</label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={"# Título\n\n## O que é?\n\nExplicação...\n\n```javascript\n// código exemplo\n```"}
                rows={12}
                className="font-mono text-sm"
              />
            </div>

            <div className="border-t border-border pt-5 space-y-4">
              <h3 className="font-mono text-sm font-semibold text-foreground flex items-center gap-2">
                <FlaskConical className="h-4 w-4 text-primary" /> Laboratório (arquivo .zip)
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Nome do arquivo</label>
                  <Input value={labFileName} onChange={(e) => setLabFileName(e.target.value)} placeholder="Ex: lab-xss.zip" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">URL do arquivo .zip</label>
                  <Input value={labZipUrl} onChange={(e) => setLabZipUrl(e.target.value)} placeholder="https://exemplo.com/labs/lab-xss.zip" />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full gap-2">
              <Plus className="h-4 w-4" /> Adicionar Aula
            </Button>
          </div>
        </form>

        <div className="space-y-4">
          <h2 className="font-mono text-lg font-semibold text-foreground">
            Aulas cadastradas ({vulnerabilities.length})
          </h2>

          <div className="space-y-2">
            {vulnerabilities.map((v) => (
              <div key={v.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{v.icon}</span>
                  <div>
                    <div className="font-medium text-foreground text-sm">{v.title}</div>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">{v.difficulty}</Badge>
                      <Badge variant="outline" className="text-xs">{v.category}</Badge>
                      {!v.labZipUrl && <Badge variant="outline" className="text-xs text-warning border-warning/30">Sem lab</Badge>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link to={`/lab/${v.slug}`}>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">Ver</Button>
                  </Link>
                  {isCustom(v.id) && (
                    <Button variant="ghost" size="sm" onClick={() => remove(v.id)} className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
