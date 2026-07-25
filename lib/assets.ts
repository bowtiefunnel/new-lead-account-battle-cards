import { readFileSync } from "node:fs";
import { join } from "node:path";

// The only file-reading code in the repo. Files reach cloud deploys via
// trigger.config.ts additionalFiles; process.cwd() is the bundle root there and repo root locally.
const root = process.cwd();
const read = (p: string) => readFileSync(join(root, p), "utf8");

export const instructions = () => read("instructions.md");
export const battleCardSkill = () => read("prompts/battle-card.md");
export const messagingNetNew = () => read("prompts/messaging-net-new.md");
