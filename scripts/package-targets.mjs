import { cpSync, mkdirSync, rmSync, writeFileSync } from "node:fs";

const targets = {
  "dist-local": "http://10.10.100.24/API/CSIMobile/HRD/training.asmx",
  "dist-android": "https://jjmobile.dskorea.com/LMES_API/CSIMobile/HRD/training.asmx",
  "dist-iphone": "http://jjmobile.dskorea.com/LMES_API/CSIMobile/HRD/training.asmx",
};

for (const [dir, url] of Object.entries(targets)) {
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  cpSync("dist", dir, { recursive: true });
  writeFileSync(
    `${dir}/config.js`,
    `window.__APP_CONFIG__ = {\n  API_BASE_URL: "${url}"\n};\n`
  );
  console.log(`${dir} -> ${url}`);
}
