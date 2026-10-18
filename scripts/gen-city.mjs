// Gera app/components/city-data.json — dados estáticos das cenas (zero aleatoriedade em runtime).
import { writeFileSync } from "node:fs";
import { buildScene, buildRoomMinis } from "../app/components/city-engine.mjs";

const SECTION_SCENES = [
  ["night", 7],
  ["street", 20],
  ["clouds", 33],
  ["midnight", 46],
  ["neon", 72],
  ["sunset", 85],
];

const data = {};
for (const [variant, seed] of SECTION_SCENES) {
  data[variant] = buildScene(variant, seed);
}
data.__roomMinis = buildRoomMinis();

writeFileSync(
  new URL("../app/components/city-data.json", import.meta.url),
  JSON.stringify(data)
);
console.log("city-data.json gerado:", Object.keys(data).join(", "));
