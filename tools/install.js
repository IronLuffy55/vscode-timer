const { execSync } = require("child_process");
const { name, version } = require("../package.json");
console.log("making package...");
execSync(`npm run vscode:package`, { stdio: "inherit" });
const extensionName = `${name}-${version}.vsix`;
const cmd = `code --install-extension ${extensionName}`;
console.log(`running ${cmd}...`);
execSync(cmd, { stdio: "inherit" });
