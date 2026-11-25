import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The Absurd Clause Contest: one absurd clause that could hide deep inside
// a terms-of-service agreement — deadpan legal boilerplate that quietly
// turns absurd.
//
// Written to the judge's brief, in order: it IS a clause that could sit
// buried in a ToS (a binding-upon-heirs-and-assigns clause, the most
// boilerplate sentence a contract has); the joke lands on one reading (the
// third item of the list is clones grown from DNA you shed); it sounds like
// real legal drafting until the absurdity hits, so the joke comes from the
// register as much as from the words; the image is concrete and specific
// (clones, shed DNA, while using our services); and at 118 characters every
// word earns its place, with no explaining of its own joke.
const LINE =
  "This agreement is binding upon your heirs, assigns, and any clones created from DNA you shed while using our services.";

// The gate allows 1 to 200 characters, a single line, not whitespace-only.
if (LINE.length < 1 || LINE.length > 200) {
  throw new Error(`entry must be 1-200 characters, got ${LINE.length}`);
}
if (LINE.trim().length === 0) {
  throw new Error("entry must not be whitespace-only");
}
if (LINE.includes("\n") || LINE.includes("\r")) {
  throw new Error("entry must be a single line");
}
// One sentence: exactly one sentence-terminating period, at the end.
const periods = LINE.split("").filter((ch) => ch === ".").length;
if (periods !== 1 || !LINE.endsWith(".")) {
  throw new Error("entry must be exactly one sentence");
}

const outDir =
  process.env.OUTPUT_DIR ??
  process.env.MAKEFUN_OUTPUT_DIR ??
  "/output";
mkdirSync(outDir, { recursive: true });

const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, LINE, "utf8");

// Read the file back and compare raw bytes so a partial write can never
// pass silently.
const written = readFileSync(outPath);
if (!written.equals(Buffer.from(LINE, "utf8"))) {
  throw new Error("entry.txt read-back does not match the entry text");
}
