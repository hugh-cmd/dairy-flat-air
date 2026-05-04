import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

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

export async function GET(request: NextRequest) {
  try {
    const db = await getDb();
    const { searchParams } = new URL(request.url);

    const email = String(searchParams.get("email") || "")
      .trim()
      .toLowerCase();

    if (!email) {
      return NextResponse.json(
        { error: "Passenger email is required" },
        { status: 400 }
      );
    }

    const schedules = await db
      .collection("schedules")
      .find({
        "bookings.passengerEmail": email,
      })
      .sort({ departureTime: 1 })
      .toArray();

    const results = schedules.flatMap((schedule) => {
      const matchingBookings = (schedule.bookings || []).filter(
        (booking: Booking) =>
          booking.passengerEmail === email && booking.status === "confirmed"
      );

      return matchingBookings.map((booking: Booking) => ({
        booking,
        schedule: {
          _id: schedule._id,
          flightNumber: schedule.flightNumber,
          origin: schedule.origin,
          destination: schedule.destination,
          originCity: schedule.originCity,
          destinationCity: schedule.destinationCity,
          originAirportName: schedule.originAirportName,
          destinationAirportName: schedule.destinationAirportName,
          departureLocal: schedule.departureLocal,
          arrivalLocal: schedule.arrivalLocal,
          aircraftName: schedule.aircraftName,
          price: schedule.price,
        },
      }));
    });

    return NextResponse.json({
      count: results.length,
      results,
    });
  } catch (error) {
    console.error("Failed to fetch passenger flights:", error);

    return NextResponse.json(
      { error: "Failed to fetch passenger flights" },
      { status: 500 }
    );
  }
}