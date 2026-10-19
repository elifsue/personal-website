/** Tools shown in the case study details cards, each with its shared icon */
export interface Tool {
  name: string;
  logo: string;
}

const ICONS = `${import.meta.env.BASE_URL}images/tools`;

export const tools = {
  antigravity: { name: "Antigravity", logo: `${ICONS}/antigravity.svg` },
  chatgpt: { name: "ChatGPT", logo: `${ICONS}/chatgpt.svg` },
  claudeCode: { name: "Claude Code", logo: `${ICONS}/claude-code.png` },
  // Codex shares the OpenAI mark with ChatGPT
  codex: { name: "Codex", logo: `${ICONS}/chatgpt.svg` },
  figma: { name: "Figma", logo: `${ICONS}/figma.png` },
  lucidchart: { name: "Lucidchart", logo: `${ICONS}/lucidchart.svg` },
  manus: { name: "Manus", logo: `${ICONS}/manus.svg` },
  notion: { name: "Notion", logo: `${ICONS}/notion.png` },
} satisfies Record<string, Tool>;
