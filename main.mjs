#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import process from "node:process";
import { createGitHubClient } from "./src/github.mjs";
import { reconcileCycles, snapshotCycles } from "./src/mastery.mjs";
import { runSetup } from "./skills/public/setup-mastery-system/resources/setup.mjs";

function usage() {
  return `Usage:
  node main.mjs setup-mastery-system [check|reconcile]
  node main.mjs mastery.cycles.snapshot
  node main.mjs mastery.cycles.reconcile --input <path|->`;
}

async function readInput(args) {
  const index = args.indexOf("--input");
  if (index === -1 || !args[index + 1]) throw new Error("--input <path|-> is required");
  const text = args[index + 1] === "-"
    ? await new Promise((resolve, reject) => {
      let value = "";
      process.stdin.setEncoding("utf8");
      process.stdin.on("data", chunk => { value += chunk; });
      process.stdin.on("end", () => resolve(value));
      process.stdin.on("error", reject);
    })
    : await readFile(args[index + 1], "utf8");
  return JSON.parse(text);
}

const args = process.argv.slice(2);
try {
  let result;
  if (args[0] === "setup" || args[0] === "setup-mastery-system") {
    result = await runSetup({ mode: args[1] ?? "reconcile", root: process.cwd() });
  } else if (args[0] === "mastery.cycles.snapshot") {
    result = await snapshotCycles(createGitHubClient(), process.cwd());
  } else if (args[0] === "mastery.cycles.reconcile") {
    result = await reconcileCycles(createGitHubClient(), process.cwd(), await readInput(args));
  } else {
    throw new Error(usage());
  }
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  if (["blocked", "failed", "drifted", "incomplete"].includes(result.status)) process.exitCode = 1;
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
}
