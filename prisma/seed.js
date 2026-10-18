const fs = require("fs");
const path = require("path");
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

const KNOWN_ALIASES = {
  "State Bank": ["SB", "State Bank Terminal", "Hampankatta Terminal", "Statebank"],
  "Suratkal": ["Surathkal", "NITK", "Suratkal Junction"],
  "Surathkal": ["Suratkal", "NITK"],
  "KSRTC Bus Stand": ["KSRTC", "Bejai Bus Stand", "KSRTC Bejai"],
  "Bajpe Aerodrome": ["Mangalore Airport", "Airport", "IXE", "Bajpe Airport"],
  "Mangalore University": ["Konaje Uni", "Mangalore Uni", "MU Konaje"],
  "Kankanady": ["Kankanadi", "Pumpwell Circle"],
  "Jyothi": ["Jyoti Circle", "Ambedkar Circle", "Jyothi Circle"],
  "Car Street": ["Carstreet", "Sri Venkatramana Temple"],
  "Kulur": ["Kuloor", "Kulur Bridge"],
  "Kuloor": ["Kulur", "Kulur Bridge"],
  "Thokkottu": ["Tokkottu", "Thokottu Junction"],
  "Panambur": ["Panambur Beach", "New Mangalore Port", "NMPT"],
  "Mangaladevi": ["Mangaladevi Temple", "Bolar Mangaladevi"],
};

async function main() {
  console.log("🌱 Seeding Mangalore City Bus Routes from Namma Mangalore dataset...");

  // 1. Admin
  const adminUsername = process.env.ADMIN_USERNAME || "admin";
  const adminPassword = process.env.ADMIN_PASSWORD || "AdminPassword123!";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.admin.upsert({
    where: { username: adminUsername },
    update: { passwordHash },
    create: {
      username: adminUsername,
      passwordHash,
    },
  });
  console.log(`👤 Admin user ready: ${admin.username}`);

  // 2. Read and parse HTML
  const htmlPath = path.join(__dirname, "scraped_bus.html");
  if (!fs.existsSync(htmlPath)) {
    console.error("❌ scraped_bus.html not found.");
    process.exit(1);
  }

  const html = fs.readFileSync(htmlPath, "utf8");
  const text = html
    .replace(/<[^>]+>/g, "\n")
    .split("\n")
    .map((l) => l.replace(/\u00A0/g, " ").trim())
    .filter(Boolean);

  const startIndex = text.findIndex((l) => l === "BUS Number");
  const lines = text.slice(startIndex + 2);

  const parsedRoutes = [];
  let currentBus = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^[0-9]+[A-Za-z]?$/.test(line)) {
      currentBus = line;
    } else if (currentBus && (line.includes("–") || line.includes("-"))) {
      const rawStops = line
        .replace(/\.$/, "")
        .split(/[–-]/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      if (rawStops.length >= 2) {
        parsedRoutes.push({
          busNumber: currentBus,
          stops: rawStops,
        });
      }
      currentBus = null;
    }
  }

  // Clear existing
  console.log("🧹 Clearing old routes and stops...");
  await prisma.feedback.deleteMany({});
  await prisma.routeStop.deleteMany({});
  await prisma.route.deleteMany({});
  await prisma.stopAlias.deleteMany({});
  await prisma.stop.deleteMany({});

  const stopCache = new Map();

  for (const route of parsedRoutes) {
    for (const stopName of route.stops) {
      const cleanName = stopName.trim();
      const norm = normalizeName(cleanName);
      if (!norm || stopCache.has(norm)) continue;

      const aliases = KNOWN_ALIASES[cleanName] || [];

      const stop = await prisma.stop.create({
        data: {
          name: cleanName,
          normalizedName: norm,
          description: `Bus stop at ${cleanName}, Mangalore.`,
          isActive: true,
          aliases: {
            create: aliases.map((a) => ({
              aliasName: a,
              normalizedAlias: normalizeName(a),
            })),
          },
        },
      });

      stopCache.set(norm, stop);
    }
  }

  console.log(`🚏 Created ${stopCache.size} unique bus stops.`);

  let createdCount = 0;

  for (const r of parsedRoutes) {
    const startStopName = r.stops[0].trim();
    const destStopName = r.stops[r.stops.length - 1].trim();

    const startStop = stopCache.get(normalizeName(startStopName));
    const destStop = stopCache.get(normalizeName(destStopName));

    if (!startStop || !destStop) continue;

    const routeName = `${startStop.name} – ${destStop.name}`;
    const intermediateStops = r.stops.slice(1, -1);
    const viaText = intermediateStops.length > 0
      ? ` via ${intermediateStops.slice(0, 3).join(", ")}${intermediateStops.length > 3 ? "..." : ""}`
      : "";

    const finalStopIds = [];
    for (const sName of r.stops) {
      const s = stopCache.get(normalizeName(sName.trim()));
      if (s) {
        if (finalStopIds.length === 0 || finalStopIds[finalStopIds.length - 1] !== s.id) {
          finalStopIds.push(s.id);
        }
      }
    }

    if (finalStopIds.length < 2) continue;

    await prisma.route.create({
      data: {
        busNumber: r.busNumber,
        routeName,
        description: `Local city transit route connecting ${startStop.name} to ${destStop.name}${viaText}.`,
        startingPointId: finalStopIds[0],
        destinationId: finalStopIds[finalStopIds.length - 1],
        isActive: true,
        routeStops: {
          create: finalStopIds.map((stopId, idx) => ({
            stopId,
            stopOrder: idx + 1,
          })),
        },
      },
    });

    createdCount++;
  }

  console.log(`🚌 Created ${createdCount} Mangalore bus routes.`);

  // Sample feedback
  const firstRoute = await prisma.route.findFirst({ where: { busNumber: "1" } });
  if (firstRoute) {
    await prisma.feedback.create({
      data: {
        routeId: firstRoute.id,
        feedbackType: "INCORRECT_STOP_NAME",
        description: "Between Chilimbi and Urva Stores, locals also call the intermediate point 'Chilimbi Cross'.",
        suggestedStopName: "Chilimbi Cross",
        status: "PENDING",
      },
    });
  }

  await prisma.feedback.create({
    data: {
      feedbackType: "MISSING_STOP",
      description: "Proposed new stop near Yenepoya Hospital Deralakatte on Route 51.",
      suggestedStopName: "Yenepoya Hospital",
      suggestedStartPoint: "State Bank",
      suggestedDestination: "Konaje",
      status: "PENDING",
    },
  });

  console.log("✅ Database seed completed with full Mangalore transit routes!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
