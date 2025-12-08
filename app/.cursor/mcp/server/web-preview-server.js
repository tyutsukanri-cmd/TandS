import { spawn } from "child_process";
import { MCP } from "mcp-server";

const server = new MCP();

server.command("startPreview", async ({ port }) => {
  const p = port || 3300;

  const child = spawn("npm", ["run", "dev"], {
    shell: true,
    env: { ...process.env, PORT: p },
    cwd: process.cwd()
  });

  child.stdout.on("data", data => {
    console.log("[DEV]", data.toString());
  });

  child.stderr.on("data", data => {
    console.error("[DEV ERROR]", data.toString());
  });

  return {
    message: `Dev server started at http://localhost:${p}. Cursor WebPreview will auto-load.`
  };
});

server.start();
