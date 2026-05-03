import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

type Booking = {
  seats: number;
  status: string;
};

function addSeatInfo(schedule: any) {
  const confirmedBookings = (schedule.bookings || []).filter(
    (booking: Booking) => booking.status === "confirmed"
  );

  const bookedSeats = confirmedBookings.reduce(
    (total: number, booking: Booking) => total + booking.seats,
    0
  );

  return {
    ...schedule,
    bookedSeats,
    availableSeats: schedule.capacity - bookedSeats,
  };
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid schedule id" },
        { status: 400 }
      );
    }

    const db = await getDb();

    const schedule = await db.collection("schedules").findOne({
      _id: new ObjectId(id),
    });

    if (!schedule) {
      return NextResponse.json(
        { error: "Schedule not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(addSeatInfo(schedule));
  } catch (error) {
    console.error("Failed to fetch schedule:", error);

    return NextResponse.json(
      { error: "Failed to fetch schedule" },
      { status: 500 }
    );
  }
}