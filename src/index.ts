import "dotenv/config";

import { getIssue } from "./github.js";
import { triageIssue } from "./triage.js";

async function main() {
  const issueNumber = 220000;

  console.log(`Buscando a issue #${issueNumber}...`);
  const issue = await getIssue(issueNumber);

  console.log(`\n--- Dados da Issue ---`);
  console.log(`#${issue.number} — ${issue.title}`);

  const realLabels = issue.labels.map((l) => l.name).join(", ");
  console.log(`Rótulo(s) Real(is): ${realLabels || "Nenhum rótulo atribuído"}`);

  console.log(`\nGerando triagem com IA...`);
  const aiResponse = await triageIssue(issue);

  console.log(`\n--- Resultado da Triagem (IA) ---`);
  console.log(aiResponse);
}

main().catch(console.error);