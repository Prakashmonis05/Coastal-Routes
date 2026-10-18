const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

function normalizeName(str) {
  if (!str) return "";
  return str
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function runTests() {
  console.log("🧪 Running Core Verification Tests...");
  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
    }
  }

  // Test 1: Admin exists and password verification works
  const admin = await prisma.admin.findUnique({ where: { username: "admin" } });
  assert(!!admin, "Admin user exists in PostgreSQL");
  const isPasswordValid = await bcrypt.compare("AdminPassword123!", admin.passwordHash);
  assert(isPasswordValid, "Admin password hash matches successfully");

  // Test 2: Search by bus number
  const routes101 = await prisma.route.findMany({
    where: { isActive: true, busNumber: { contains: "101", mode: "insensitive" } },
    include: { startingPoint: true, destination: true },
  });
  assert(routes101.length >= 2, `Bus number '101' returns both 101 and 101R (found ${routes101.length})`);

  // Test 3: Search by Stop Name (City Market)
  const normStop = normalizeName("City Market");
  const stopWithRoutes = await prisma.stop.findFirst({
    where: { normalizedName: normStop },
    include: { routeStops: { include: { route: true } } },
  });
  assert(stopWithRoutes && stopWithRoutes.routeStops.length > 0, "Stop 'City Market' is linked to routes");

  // Test 4: Search by Alias (CBS -> Central Bus Stand)
  const aliasMatch = await prisma.stopAlias.findFirst({
    where: { normalizedAlias: normalizeName("cbs") },
    include: { stop: true },
  });
  assert(aliasMatch && aliasMatch.stop.name === "Central Bus Stand", "Alias 'cbs' resolves to Central Bus Stand");

  // Test 5: Start & Destination directionality check
  // On Route 101: 1: Central Bus Stand, 2: City Market, 3: Harbor Bay, 4: Coastal Beach, 5: Lighthouse Point
  // Search from Market to Lighthouse Point should match 101
  // Search from Lighthouse Point to Market should NOT match 101 (should match 101R instead)
  const route101 = await prisma.route.findFirst({
    where: { busNumber: "101" },
    include: { routeStops: { include: { stop: true }, orderBy: { stopOrder: "asc" } } },
  });

  const stops101 = route101.routeStops.map(rs => rs.stop.name);
  const marketIdx = stops101.indexOf("City Market");
  const lighthouseIdx = stops101.indexOf("Lighthouse Point");
  assert(marketIdx < lighthouseIdx, "Route 101 has City Market BEFORE Lighthouse Point");

  // Test 6: Trigram similarity query
  const fuzzyResults = await prisma.$queryRaw`
    SELECT name, similarity("normalizedName", 'mrket') AS sm
    FROM "Stop"
    WHERE similarity("normalizedName", 'mrket') > 0.2
    ORDER BY sm DESC;
  `;
  assert(fuzzyResults.length > 0 && fuzzyResults[0].name === "City Market", "pg_trgm fuzzy match handles typo 'mrket' -> 'City Market'");

  console.log(`\n🎉 Results: ${passed}/${total} tests passed!`);
  await prisma.$disconnect();
  if (passed !== total) process.exit(1);
}

runTests().catch((e) => {
  console.error(e);
  process.exit(1);
});
