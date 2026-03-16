import "dotenv/config";
import { getHubDbRows } from "./hubspot-client";

async function main() {
  // Radio Spots table — fetch a few rows to see the structure
  console.log("=== Radio Spots (714873037) — all rows (limit 3) ===");
  const rs = await getHubDbRows("714873037", {});
  console.log(JSON.stringify(rs.slice(0, 3), null, 2));

  // Filtered query matching our test item
  console.log("\n=== Radio Spots — filtered (week, night_time, energy_zürich) ===");
  const rsf = await getHubDbRows("714873037", {
    week_type: "week",
    time_category: "night_time",
    plattform: "energy_zürich",
  });
  console.log(JSON.stringify(rsf, null, 2));

  // Digital Spots table
  console.log("\n=== Digital Spots (714786038) — all rows (limit 3) ===");
  const ds = await getHubDbRows("714786038", {});
  console.log(JSON.stringify(ds.slice(0, 3), null, 2));

  // Digital Spots filtered
  console.log("\n=== Digital Spots — filtered (energy_bern, count_of_targetings=2) ===");
  const dsf = await getHubDbRows("714786038", {
    plattform: "energy_bern",
    count_of_targetings: "2",
  });
  console.log(JSON.stringify(dsf, null, 2));

  // Radio Sponsoring table
  console.log("\n=== Radio Sponsoring (714873039) — filtered (energy_zürich, 5_am_stück) ===");
  const rsp = await getHubDbRows("714873039", {
    plattform: "energy_zürich",
    rubric: "5_am_stück",
  });
  console.log(JSON.stringify(rsp, null, 2));

  // Audio Production table
  console.log("\n=== Audio Production (756822227) — all rows (limit 3) ===");
  const ap = await getHubDbRows("756822227", {});
  console.log(JSON.stringify(ap.slice(0, 3), null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
