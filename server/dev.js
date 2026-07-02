import { spawn } from "node:child_process";
import path from "node:path";

const rootDirectory = path.resolve(import.meta.dirname, "..");
const viteEntry = path.join(rootDirectory, "node_modules", "vite", "bin", "vite.js");

const processes = [
  spawn(process.execPath, [viteEntry], {
    cwd: rootDirectory,
    stdio: "inherit",
  }),
  spawn(process.execPath, ["--watch", path.join(rootDirectory, "backend", "server.js")], {
    cwd: rootDirectory,
    stdio: "inherit",
  }),
];

let stopping = false;

function stop(exitCode = 0) {
  if (stopping) return;
  stopping = true;
  for (const child of processes) child.kill();
  process.exitCode = exitCode;
}

for (const child of processes) {
  child.on("exit", (code) => {
    if (!stopping && code) stop(code);
  });
}

process.on("SIGINT", () => stop());
process.on("SIGTERM", () => stop());
