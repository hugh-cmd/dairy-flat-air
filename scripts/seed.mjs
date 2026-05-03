import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "dairyflat";

if (!uri) {
  throw new Error("MONGODB_URI is missing. Check your .env.local file.");
}

const client = new MongoClient(uri);

const airports = [
  {
    code: "NZNE",
    name: "Dairy Flat Airport",
    city: "Dairy Flat",
    country: "New Zealand",
    timezone: "Pacific/Auckland",
    utcOffset: "+12:00",
  },
  {
    code: "YSSY",
    name: "Sydney Airport",
    city: "Sydney",
    country: "Australia",
    timezone: "Australia/Sydney",
    utcOffset: "+10:00",
  },
  {
    code: "NZRO",
    name: "Rotorua Airport",
    city: "Rotorua",
    country: "New Zealand",
    timezone: "Pacific/Auckland",
    utcOffset: "+12:00",
  },
  {
    code: "NZGB",
    name: "Claris Airport",
    city: "Great Barrier Island",
    country: "New Zealand",
    timezone: "Pacific/Auckland",
    utcOffset: "+12:00",
  },
  {
    code: "NZCI",
    name: "Tuuta Airport",
    city: "Chatham Islands",
    country: "New Zealand",
    timezone: "Pacific/Chatham",
    utcOffset: "+12:45",
  },
  {
    code: "NZTL",
    name: "Lake Tekapo Airport",
    city: "Lake Tekapo",
    country: "New Zealand",
    timezone: "Pacific/Auckland",
    utcOffset: "+12:00",
  },
];

const airportMap = Object.fromEntries(
  airports.map((airport) => [airport.code, airport])
);

// JavaScript getUTCDay():
// Sunday = 0, Monday = 1, Tuesday = 2, Wednesday = 3,
// Thursday = 4, Friday = 5, Saturday = 6
const flightTemplates = [
  {
    flightNumber: "DFA101",
    origin: "NZNE",
    destination: "YSSY",
    days: [5],
    departureLocalTime: "10:00",
    arrivalLocalTime: "12:30",
    aircraftCode: "SJ30I",
    aircraftName: "SyberJet SJ30i",
    capacity: 6,
    price: 1200,
  },
  {
    flightNumber: "DFA102",
    origin: "YSSY",
    destination: "NZNE",
    days: [0],
    departureLocalTime: "15:00",
    arrivalLocalTime: "20:30",
    aircraftCode: "SJ30I",
    aircraftName: "SyberJet SJ30i",
    capacity: 6,
    price: 1200,
  },
  {
    flightNumber: "DFA201",
    origin: "NZNE",
    destination: "NZRO",
    days: [1, 2, 3, 4, 5],
    departureLocalTime: "07:00",
    arrivalLocalTime: "07:45",
    aircraftCode: "SF50-A",
    aircraftName: "Cirrus SF50",
    capacity: 4,
    price: 220,
  },
  {
    flightNumber: "DFA202",
    origin: "NZRO",
    destination: "NZNE",
    days: [1, 2, 3, 4, 5],
    departureLocalTime: "08:30",
    arrivalLocalTime: "09:15",
    aircraftCode: "SF50-A",
    aircraftName: "Cirrus SF50",
    capacity: 4,
    price: 220,
  },
  {
    flightNumber: "DFA203",
    origin: "NZNE",
    destination: "NZRO",
    days: [1, 2, 3, 4, 5],
    departureLocalTime: "16:30",
    arrivalLocalTime: "17:15",
    aircraftCode: "SF50-A",
    aircraftName: "Cirrus SF50",
    capacity: 4,
    price: 220,
  },
  {
    flightNumber: "DFA204",
    origin: "NZRO",
    destination: "NZNE",
    days: [1, 2, 3, 4, 5],
    departureLocalTime: "18:00",
    arrivalLocalTime: "18:45",
    aircraftCode: "SF50-A",
    aircraftName: "Cirrus SF50",
    capacity: 4,
    price: 220,
  },
  {
    flightNumber: "DFA301",
    origin: "NZNE",
    destination: "NZGB",
    days: [1, 3, 5],
    departureLocalTime: "09:00",
    arrivalLocalTime: "09:35",
    aircraftCode: "SF50-B",
    aircraftName: "Cirrus SF50",
    capacity: 4,
    price: 180,
  },
  {
    flightNumber: "DFA302",
    origin: "NZGB",
    destination: "NZNE",
    days: [2, 4, 6],
    departureLocalTime: "10:00",
    arrivalLocalTime: "10:40",
    aircraftCode: "SF50-B",
    aircraftName: "Cirrus SF50",
    capacity: 4,
    price: 180,
  },
  {
    flightNumber: "DFA401",
    origin: "NZNE",
    destination: "NZCI",
    days: [2, 5],
    departureLocalTime: "09:30",
    arrivalLocalTime: "12:15",
    aircraftCode: "HONDA-A",
    aircraftName: "HondaJet Elite",
    capacity: 5,
    price: 950,
  },
  {
    flightNumber: "DFA402",
    origin: "NZCI",
    destination: "NZNE",
    days: [3, 6],
    departureLocalTime: "13:00",
    arrivalLocalTime: "14:45",
    aircraftCode: "HONDA-A",
    aircraftName: "HondaJet Elite",
    capacity: 5,
    price: 950,
  },
  {
    flightNumber: "DFA501",
    origin: "NZNE",
    destination: "NZTL",
    days: [1],
    departureLocalTime: "11:00",
    arrivalLocalTime: "12:45",
    aircraftCode: "HONDA-B",
    aircraftName: "HondaJet Elite",
    capacity: 5,
    price: 650,
  },
  {
    flightNumber: "DFA502",
    origin: "NZTL",
    destination: "NZNE",
    days: [2],
    departureLocalTime: "13:00",
    arrivalLocalTime: "15:00",
    aircraftCode: "HONDA-B",
    aircraftName: "HondaJet Elite",
    capacity: 5,
    price: 650,
  },
];

function formatDate(date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function createDateFromLocal(dateString, timeString, utcOffset) {
  return new Date(`${dateString}T${timeString}:00${utcOffset}`);
}

function createScheduleDocument(template, dateString) {
  const originAirport = airportMap[template.origin];
  const destinationAirport = airportMap[template.destination];

  const departureTime = createDateFromLocal(
    dateString,
    template.departureLocalTime,
    originAirport.utcOffset
  );

  const arrivalTime = createDateFromLocal(
    dateString,
    template.arrivalLocalTime,
    destinationAirport.utcOffset
  );

  return {
    flightNumber: template.flightNumber,

    origin: template.origin,
    destination: template.destination,

    originAirportName: originAirport.name,
    destinationAirportName: destinationAirport.name,

    originCity: originAirport.city,
    destinationCity: destinationAirport.city,

    originTimezone: originAirport.timezone,
    destinationTimezone: destinationAirport.timezone,

    departureTime,
    arrivalTime,

    departureLocal: `${dateString} ${template.departureLocalTime}`,
    arrivalLocal: `${dateString} ${template.arrivalLocalTime}`,

    aircraftCode: template.aircraftCode,
    aircraftName: template.aircraftName,

    capacity: template.capacity,
    price: template.price,

    bookings: [],

    status: "scheduled",
    createdAt: new Date(),
  };
}

async function seed() {
  try {
    await client.connect();

    const db = client.db(dbName);

    await db.collection("airports").deleteMany({});
    await db.collection("schedules").deleteMany({});

    await db.collection("airports").insertMany(airports);

    const schedules = [];

    const startDate = new Date("2026-06-01T00:00:00.000Z");
    const numberOfDays = 70;

    for (let i = 0; i < numberOfDays; i++) {
      const currentDate = new Date(startDate);
      currentDate.setUTCDate(startDate.getUTCDate() + i);

      const dayOfWeek = currentDate.getUTCDay();
      const dateString = formatDate(currentDate);

      for (const template of flightTemplates) {
        if (template.days.includes(dayOfWeek)) {
          schedules.push(createScheduleDocument(template, dateString));
        }
      }
    }

    await db.collection("schedules").insertMany(schedules);

    await db.collection("schedules").createIndex({
      origin: 1,
      destination: 1,
      departureTime: 1,
    });

    await db.collection("schedules").createIndex({
      "bookings.reference": 1,
    });

    await db.collection("schedules").createIndex({
      "bookings.passengerEmail": 1,
    });

    console.log(`Seed completed successfully.`);
    console.log(`Inserted ${airports.length} airports.`);
    console.log(`Inserted ${schedules.length} schedules.`);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

seed();