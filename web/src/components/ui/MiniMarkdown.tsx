import { Fragment } from "react";

function renderInline(text: string, keyPrefix: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={`${keyPrefix}-${i}`} className="font-semibold text-slate-800 dark:text-slate-100">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <Fragment key={`${keyPrefix}-${i}`}>{part}</Fragment>
    ),
  );
}

/** Minimal markdown renderer covering the subset used by the mock AI responses:
 * bold, bullet lists, pipe tables, and paragraphs. */
export function MiniMarkdown({ content }: { content: string }) {
  const lines = content.split("\n");
  const blocks: { type: "p" | "ul" | "table"; lines: string[] }[] = [];

  for (const line of lines) {
    const isTableRow = /^\s*\|.*\|\s*$/.test(line);
    const isBullet = /^\s*[-•]\s+/.test(line);
    const last = blocks[blocks.length - 1];

    if (isTableRow) {
      if (last?.type === "table") last.lines.push(line);
      else blocks.push({ type: "table", lines: [line] });
    } else if (isBullet) {
      if (last?.type === "ul") last.lines.push(line);
      else blocks.push({ type: "ul", lines: [line] });
    } else if (line.trim() === "") {
      blocks.push({ type: "p", lines: [""] });
    } else {
      if (last?.type === "p" && last.lines[last.lines.length - 1] !== "") last.lines.push(line);
      else blocks.push({ type: "p", lines: [line] });
    }
  }

  return (
    <div className="space-y-2.5 text-[13.5px] leading-relaxed">
      {blocks.map((block, bi) => {
        if (block.type === "p") {
          const text = block.lines.filter((l) => l !== "").join(" ");
          if (!text) return null;
          return (
            <p key={bi} className="whitespace-pre-wrap">
              {renderInline(text, `p${bi}`)}
            </p>
          );
        }
        if (block.type === "ul") {
          return (
            <ul key={bi} className="list-disc space-y-1 pl-5">
              {block.lines.map((l, li) => (
                <li key={li}>{renderInline(l.replace(/^\s*[-•]\s+/, ""), `ul${bi}-${li}`)}</li>
              ))}
            </ul>
          );
        }
        // table
        const rows = block.lines
          .map((l) => l.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim()))
          .filter((cells) => !cells.every((c) => /^-+$/.test(c)));
        const [header, ...body] = rows;
        return (
          <div key={bi} className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-600">
            <table className="w-full border-collapse text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-700/60">
                <tr>
                  {header.map((h, i) => (
                    <th key={i} className="border-b border-slate-200 px-2.5 py-1.5 font-semibold text-slate-600 dark:border-slate-600 dark:text-slate-200">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {body.map((row, ri) => (
                  <tr key={ri} className="odd:bg-white even:bg-slate-50/60 dark:odd:bg-slate-800 dark:even:bg-slate-700/30">
                    {row.map((cell, ci) => (
                      <td key={ci} className="border-b border-slate-100 px-2.5 py-1.5 text-slate-600 dark:border-slate-700 dark:text-slate-300">
                        {renderInline(cell, `td${bi}-${ri}-${ci}`)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}
