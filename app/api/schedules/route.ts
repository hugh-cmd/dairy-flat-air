import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  try {
    const db = await getDb();
    const { searchParams } = new URL(request.url);

    const orig = searchParams.get("orig");
    const dest = searchParams.get("dest");
    const date1 = searchParams.get("date1");
    const date2 = searchParams.get("date2");

    const query: Record<string, unknown> = {
      status: "scheduled",
    };

    if (orig) {
      query.origin = orig;
    }

    if (dest) {
      query.destination = dest;
    }

    if (date1 && date2) {
      query.departureLocal = {
        $gte: `${date1} 00:00`,
        $lte: `${date2} 23:59`,
      };
    } else if (date1) {
      query.departureLocal = {
        $gte: `${date1} 00:00`,
      };
    }

    const schedules = await db
      .collection("schedules")
      .find(query)
      .sort({ departureTime: 1 })
      .limit(100)
      .toArray();

    const schedulesWithSeats = schedules.map((schedule) => {
      const confirmedBookings = (schedule.bookings || []).filter(
        (booking: { status: string }) => booking.status === "confirmed"
      );

      const bookedSeats = confirmedBookings.reduce(
        (total: number, booking: { seats: number }) => total + booking.seats,
        0
      );

      return {
        ...schedule,
        bookedSeats,
        availableSeats: schedule.capacity - bookedSeats,
      };
    });

    return NextResponse.json({
      count: schedulesWithSeats.length,
      schedules: schedulesWithSeats,
    });
  } catch (error) {
    console.error("Failed to fetch schedules:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch schedules",
      },
      { status: 500 }
    );
  }
}