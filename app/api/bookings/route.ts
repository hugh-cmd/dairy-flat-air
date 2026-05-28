import { NextRequest, NextResponse } from "next/server";
import { Db, ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { generateBookingReference } from "@/lib/bookingReference";

type Booking = {
  reference: string;
  passengerName: string;
  passengerEmail: string;
  seats: number;
  status: string;
  totalPrice: number;
  createdAt: Date;
  cancelledAt: Date | null;
};
type ScheduleDocument = {
  _id: ObjectId;
  flightNumber: string;
  origin: string;
  destination: string;
  originCity: string;
  destinationCity: string;
  originAirportName: string;
  destinationAirportName: string;
  departureLocal: string;
  arrivalLocal: string;
  aircraftName: string;
  capacity: number;
  price: number;
  bookings: Booking[];
  status: string;
  createdAt: Date;
};
function getBookedSeats(bookings: Booking[]) {
  return bookings
    .filter((booking) => booking.status === "confirmed")
    .reduce((total, booking) => total + booking.seats, 0);
}
async function generateUniqueBookingReference(db: Db) {
  for (let attempt = 0; attempt < 10; attempt++) {
    const reference = generateBookingReference();

    const existingBooking = await db
      .collection<ScheduleDocument>("schedules")
      .findOne(
        {
          "bookings.reference": reference,
        },
        {
          projection: {
            _id: 1,
          },
        }
      );

    if (!existingBooking) {
      return reference;
    }
  }

  throw new Error("Could not generate a unique booking reference");
}
export async function POST(request: NextRequest) {
  try {
    const db = await getDb();
    const body = await request.json();

    const scheduleId = body.scheduleId;
    const passengerName = String(body.passengerName || "").trim();
    const passengerEmail = String(body.passengerEmail || "").trim().toLowerCase();
    const seats = Number(body.seats || 1);

    if (!scheduleId || !passengerName || !passengerEmail || !seats) {
      return NextResponse.json(
        { error: "Missing booking details" },
        { status: 400 }
      );
    }

    if (!ObjectId.isValid(scheduleId)) {
      return NextResponse.json(
        { error: "Invalid schedule id" },
        { status: 400 }
      );
    }

    if (seats < 1 || seats > 6) {
      return NextResponse.json(
        { error: "Invalid number of seats" },
        { status: 400 }
      );
    }

    const schedule = await db.collection<ScheduleDocument>("schedules").findOne({
      _id: new ObjectId(scheduleId),
    });

    if (!schedule) {
      return NextResponse.json(
        { error: "Schedule not found" },
        { status: 404 }
      );
    }

    const bookedSeats = getBookedSeats(schedule.bookings || []);
    const availableSeats = schedule.capacity - bookedSeats;

    if (seats > availableSeats) {
      return NextResponse.json(
        { error: "Not enough seats available" },
        { status: 409 }
      );
    }

    const reference = await generateUniqueBookingReference(db);

    const booking = {
      reference,
      passengerName,
      passengerEmail,
      seats,
      status: "confirmed",
      totalPrice: seats * schedule.price,
      createdAt: new Date(),
      cancelledAt: null,
    };

    await db.collection<ScheduleDocument>("schedules").updateOne(
      { _id: new ObjectId(scheduleId) },
      {
        $push: {
          bookings: booking,
        },
      }
    );
    return NextResponse.json(
      {
        message: "Booking created successfully",
        booking,
        scheduleId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create booking:", error);

    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}