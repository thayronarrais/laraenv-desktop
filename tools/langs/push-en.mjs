// Copies everything this repo generates for the public repo's langs/ pipeline
// into a checkout of it, for the maintainer to commit: langs/en.json,
// langs/.do-not-translate.json, and tools/langs/check.mjs. All three are
// authored here and mirrored out; every locale file travels the other way.
// No file is written from both sides, so no sync can conflict.
//
// langs/README.md is deliberately NOT copied — it has no private-repo
// counterpart and is authored directly in public.
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const target = process.argv[2];
if (!target) {
  console.error("usage: node tools/langs/push-en.mjs <path-to-laraenv-checkout>");
  process.exit(1);
}
if (!existsSync(join(target, "langs"))) {
  console.error(`no langs/ directory in ${target}`);
  process.exit(1);
}
mkdirSync(join(target, "tools", "langs"), { recursive: true });

const files = [
  ["langs", "en.json"],
  ["langs", ".do-not-translate.json"],
  ["tools/langs", "check.mjs"],
];
for (const [dir, name] of files) {
  const dest = join(target, dir, name);
  copyFileSync(join(dir, name), dest);
  console.log(`copied ${dir}/${name} → ${dest}`);
}
console.log("commit them in the public repo; translators open PRs against en.json.");
