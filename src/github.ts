import "dotenv/config";

const GITHUB_API = "https://api.github.com";
const REPO = "microsoft/vscode";

export type GithubIssue = {
  number: number;
  title: string;
  body: string | null;
  state: "open" | "closed";
  labels: { name: string }[];
  html_url: string;
  created_at: string;
  pull_request?: unknown; // presente quando o item é, na verdade, um PR
};

function headers(): HeadersInit {
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    ...(process.env.GITHUB_TOKEN && {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    }),
  };
}

async function request<T>(path: string): Promise<T> {
  const res = await fetch(`${GITHUB_API}${path}`, { headers: headers() });

  if (res.status === 403 && res.headers.get("x-ratelimit-remaining") === "0") {
    const reset = Number(res.headers.get("x-ratelimit-reset")) * 1000;
    throw new Error(
      `Rate limit atingido. Reseta em ${new Date(reset).toLocaleTimeString()}`,
    );
  }

  if (!res.ok) {
    throw new Error(`GitHub API ${res.status}: ${await res.text()}`);
  }

  return res.json() as Promise<T>;
}

/** Busca uma issue específica pelo número. */
export async function getIssue(issueNumber: number): Promise<GithubIssue> {
  const issue = await request<GithubIssue>(
    `/repos/${REPO}/issues/${issueNumber}`,
  );

  if (issue.pull_request) {
    throw new Error(`#${issueNumber} é um pull request, não uma issue`);
  }

  return issue;
}

/** Lista issues abertas, já removendo os pull requests. */
export async function listOpenIssues(options?: {
  labels?: string[];
  perPage?: number;
}): Promise<GithubIssue[]> {
  const params = new URLSearchParams({
    state: "open",
    per_page: String(options?.perPage ?? 30),
    sort: "created",
    direction: "desc",
  });

  if (options?.labels?.length) {
    params.set("labels", options.labels.join(","));
  }

  const items = await request<GithubIssue[]>(
    `/repos/${REPO}/issues?${params.toString()}`,
  );

  return items.filter((item) => !item.pull_request);
}