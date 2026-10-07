import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import type { GithubIssue } from "./github.js";

/**
 * Envia uma issue para o modelo de IA analisar e fazer a triagem.
 * @param issue A issue do GitHub a ser analisada.
 * @returns O texto de resposta/triagem gerado pelo modelo.
 */
export async function triageIssue(issue: GithubIssue): Promise<string> {
  const prompt = `
Você é um engenheiro de triagem de software experiente.
Analise a seguinte issue do GitHub e identifique a categoria/rotulo apropriado (ex: bug, feature, documentation, enhancement, etc.) e um breve resumo do problema.

Título: ${issue.title}
Descrição:
${issue.body ?? "Sem descrição fornecida."}
`;

  const { text } = await generateText({
    model: openai("gpt-4o-mini"), // Substitua pelo modelo de preferência
    prompt,
  });

  return text;
}