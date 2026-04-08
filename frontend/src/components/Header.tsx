import { Shield, Terminal } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <Shield className="h-7 w-7 text-primary transition-all group-hover:scale-110" />
            <Terminal className="h-3 w-3 text-accent absolute -bottom-0.5 -right-0.5" />
          </div>
          <span className="font-mono text-lg font-bold tracking-tight">
            <span className="text-primary">sec</span>
            <span className="text-foreground">CodeLab</span>
          </span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            to="/"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Conteúdos
          </Link>
          <a
            href="https://owasp.org/www-project-top-ten/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            OWASP Top 10
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
