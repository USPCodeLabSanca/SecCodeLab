interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
  const renderMarkdown = (md: string) => {
    const lines = md.split("\n");
    const elements: JSX.Element[] = [];
    let i = 0;
    let codeBlock = false;
    let codeContent = "";
    let codeLang = "";

    while (i < lines.length) {
      const line = lines[i];

      // Code blocks
      if (line.startsWith("```")) {
        if (!codeBlock) {
          codeBlock = true;
          codeLang = line.slice(3).trim();
          codeContent = "";
        } else {
          elements.push(
            <div key={i} className="my-4 rounded-lg border border-border overflow-hidden">
              {codeLang && (
                <div className="bg-secondary px-4 py-1.5 text-xs text-muted-foreground font-mono border-b border-border">
                  {codeLang}
                </div>
              )}
              <pre className="bg-muted p-4 overflow-x-auto">
                <code className="text-sm font-mono text-foreground">{codeContent}</code>
              </pre>
            </div>
          );
          codeBlock = false;
          codeContent = "";
          codeLang = "";
        }
        i++;
        continue;
      }

      if (codeBlock) {
        codeContent += (codeContent ? "\n" : "") + line;
        i++;
        continue;
      }

      // Skip empty lines
      if (!line.trim()) {
        i++;
        continue;
      }

      // Headers
      if (line.startsWith("### ")) {
        elements.push(
          <h3 key={i} className="text-lg font-semibold text-foreground mt-8 mb-3">
            {renderInline(line.slice(4))}
          </h3>
        );
      } else if (line.startsWith("## ")) {
        elements.push(
          <h2 key={i} className="text-xl font-bold text-foreground mt-10 mb-4 pb-2 border-b border-border">
            {renderInline(line.slice(3))}
          </h2>
        );
      } else if (line.startsWith("# ")) {
        elements.push(
          <h1 key={i} className="text-3xl font-bold text-foreground mb-6 glow-text">
            {renderInline(line.slice(2))}
          </h1>
        );
      }
      // Table
      else if (line.includes("|") && line.trim().startsWith("|")) {
        const tableLines: string[] = [];
        while (i < lines.length && lines[i].includes("|") && lines[i].trim().startsWith("|")) {
          tableLines.push(lines[i]);
          i++;
        }
        i--;
        const headerCells = tableLines[0].split("|").filter(c => c.trim()).map(c => c.trim());
        const dataRows = tableLines.slice(2);

        elements.push(
          <div key={i} className="my-4 overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-secondary">
                  {headerCells.map((cell, ci) => (
                    <th key={ci} className="px-4 py-2 text-left font-mono text-foreground">
                      {renderInline(cell)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dataRows.map((row, ri) => {
                  const cells = row.split("|").filter(c => c.trim()).map(c => c.trim());
                  return (
                    <tr key={ri} className="border-t border-border">
                      {cells.map((cell, ci) => (
                        <td key={ci} className="px-4 py-2 text-muted-foreground font-mono">
                          {renderInline(cell)}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      }
      // Unordered list
      else if (line.startsWith("- ")) {
        const listItems: string[] = [];
        while (i < lines.length && lines[i].startsWith("- ")) {
          listItems.push(lines[i].slice(2));
          i++;
        }
        i--;
        elements.push(
          <ul key={i} className="my-3 space-y-1.5 list-none">
            {listItems.map((item, li) => (
              <li key={li} className="flex items-start gap-2 text-muted-foreground">
                <span className="text-primary mt-1">›</span>
                <span>{renderInline(item)}</span>
              </li>
            ))}
          </ul>
        );
      }
      // Ordered list
      else if (/^\d+\.\s/.test(line)) {
        const listItems: string[] = [];
        while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
          listItems.push(lines[i].replace(/^\d+\.\s/, ""));
          i++;
        }
        i--;
        elements.push(
          <ol key={i} className="my-3 space-y-1.5 list-none counter-reset-custom">
            {listItems.map((item, li) => (
              <li key={li} className="flex items-start gap-3 text-muted-foreground">
                <span className="text-primary font-mono text-sm font-bold min-w-[1.25rem]">
                  {li + 1}.
                </span>
                <span>{renderInline(item)}</span>
              </li>
            ))}
          </ol>
        );
      }
      // Paragraph
      else {
        elements.push(
          <p key={i} className="text-muted-foreground leading-relaxed my-3">
            {renderInline(line)}
          </p>
        );
      }

      i++;
    }

    return elements;
  };

  const renderInline = (text: string): React.ReactNode => {
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let key = 0;

    while (remaining.length > 0) {
      // Bold
      const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
      // Inline code
      const codeMatch = remaining.match(/`(.+?)`/);

      const boldIdx = boldMatch?.index ?? Infinity;
      const codeIdx = codeMatch?.index ?? Infinity;

      if (boldIdx === Infinity && codeIdx === Infinity) {
        parts.push(<span key={key++}>{remaining}</span>);
        break;
      }

      if (boldIdx <= codeIdx && boldMatch) {
        parts.push(<span key={key++}>{remaining.slice(0, boldIdx)}</span>);
        parts.push(
          <strong key={key++} className="text-foreground font-semibold">
            {boldMatch[1]}
          </strong>
        );
        remaining = remaining.slice(boldIdx + boldMatch[0].length);
      } else if (codeMatch) {
        parts.push(<span key={key++}>{remaining.slice(0, codeIdx)}</span>);
        parts.push(
          <code
            key={key++}
            className="px-1.5 py-0.5 rounded bg-secondary text-primary font-mono text-[0.85em]"
          >
            {codeMatch[1]}
          </code>
        );
        remaining = remaining.slice(codeIdx + codeMatch[0].length);
      }
    }

    return parts;
  };

  return <div className="max-w-none">{renderMarkdown(content)}</div>;
};

export default MarkdownRenderer;
