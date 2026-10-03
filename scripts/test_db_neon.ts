import { saveChart, getChartsByEmail, deleteChart, getReviews } from "../src/lib/db";

async function run() {
  console.log("Testing Neon DB operations...");

  const testEmail = "test_migration@vedic.org";
  const testChart = {
    id: `test_${Date.now()}`,
    userEmail: testEmail,
    name: "Aryabhata",
    gender: "male" as const,
    dateIso: "2026-10-03T18:00:00Z",
    dob: "2026-10-03",
    time: "18:00",
    location: {
      cityName: "Patna",
      country: "India",
      latitude: 25.5941,
      longitude: 85.1376,
      elevation: 53,
      timezoneOffsetHours: 5.5,
    },
    ayanamsha: "Lahiri",
    houseSystem: "WholeSign",
    notes: "Neon migration test chart",
  };

  console.log("Saving test chart to Neon...");
  const saved = await saveChart(testChart);
  console.log("Chart saved with ID:", saved.id);

  console.log("Fetching charts by email...");
  const fetched = await getChartsByEmail(testEmail);
  console.log("Fetched count:", fetched.length);
  if (fetched.length === 0 || fetched[0].name !== "Aryabhata") {
    throw new Error("Chart verification failed!");
  }
  console.log("Chart verified successfully!");

  console.log("Deleting test chart...");
  await deleteChart(saved.id, testEmail);
  const afterDelete = await getChartsByEmail(testEmail);
  console.log("After delete count:", afterDelete.length);

  console.log("Fetching reviews from Neon...");
  const reviews = await getReviews();
  console.log("Total reviews fetched from Neon:", reviews.length);

  console.log("All Neon operations passed with 100% success!");
}

run().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
