import "dotenv/config";
import { getLineItemProperties } from "./hubspot-client";

async function main() {
  const ids = ["434866761962", "434866761965", "434866761964", "434866761963"];
  for (const id of ids) {
    const p = await getLineItemProperties(id);
    console.log(`=== ${id} (${p.name}) ===`);
    console.log(JSON.stringify(p, null, 2));
    console.log();
  }
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
