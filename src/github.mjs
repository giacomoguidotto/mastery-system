import { execFileSync } from "node:child_process";

function runGh(args, input) {
  const output = execFileSync("gh", args, {
    encoding: "utf8",
    input,
    stdio: [input === undefined ? "ignore" : "pipe", "pipe", "pipe"]
  });
  return output.trim() ? JSON.parse(output) : null;
}

function paged(args) {
  return runGh(["api", "--paginate", "--slurp", ...args]).flat();
}

export function repositoryFromRemote() {
  const url = execFileSync("git", ["remote", "get-url", "origin"], { encoding: "utf8" }).trim();
  const match = url.match(/[/:]([^/:]+)\/([^/]+?)(?:\.git)?$/);
  if (!match) throw new Error("origin is not a GitHub repository");
  return `${match[1]}/${match[2]}`;
}

export function createGitHubClient(repository = repositoryFromRemote()) {
  const endpoint = path => `repos/${repository}${path}`;
  return {
    repository,
    async listIssues() {
      return paged([endpoint("/issues?state=all&per_page=100")]);
    },
    async listBlockedBy(number) {
      return paged([endpoint(`/issues/${number}/dependencies/blocked_by?per_page=100`)]);
    },
    async createIssue({ title, body }) {
      return runGh(["api", "--method", "POST", endpoint("/issues"), "-f", `title=${title}`, "-f", `body=${body}`]);
    },
    async updateIssue(number, fields) {
      const args = ["api", "--method", "PATCH", endpoint(`/issues/${number}`)];
      for (const [key, value] of Object.entries(fields)) args.push("-f", `${key}=${value}`);
      return runGh(args);
    },
    async addDependency(number, issueId) {
      return runGh(["api", "--method", "POST", endpoint(`/issues/${number}/dependencies/blocked_by`), "-F", `issue_id=${issueId}`]);
    },
    async removeDependency(number, issueId) {
      return runGh(["api", "--method", "DELETE", endpoint(`/issues/${number}/dependencies/blocked_by/${issueId}`)]);
    }
  };
}
