import { getIssue, listOpenIssues } from "./github.js";

async function main() {
  const issue = await getIssue(220000);
  console.log(`#${issue.number} — ${issue.title}`);
  console.log(`Labels: ${issue.labels.map((l) => l.name).join(", ")}`);

  const bugs = await listOpenIssues({ labels: ["bug"], perPage: 5 });
  console.log(`\n${bugs.length} bugs abertos mais recentes:`);
  bugs.forEach((b) => console.log(`  #${b.number} ${b.title}`));
}

main().catch(console.error);