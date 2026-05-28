import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
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
};

function addSeatInfo(schedule: ScheduleDocument) {
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
  { params }: { params: Promise<{ reference: string }> }
) {
  try {
    const { reference } = await params;
    const db = await getDb();

    const schedule = await db.collection<ScheduleDocument>("schedules").findOne({
      "bookings.reference": reference,
    });

    if (!schedule) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    const booking = (schedule.bookings || []).find(
      (item: Booking) => item.reference === reference
    );

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    const scheduleWithSeats = addSeatInfo(schedule);

    return NextResponse.json({
      booking,
      schedule: {
        _id: scheduleWithSeats._id,
        flightNumber: scheduleWithSeats.flightNumber,
        origin: scheduleWithSeats.origin,
        destination: scheduleWithSeats.destination,
        originCity: scheduleWithSeats.originCity,
        destinationCity: scheduleWithSeats.destinationCity,
        originAirportName: scheduleWithSeats.originAirportName,
        destinationAirportName: scheduleWithSeats.destinationAirportName,
        departureLocal: scheduleWithSeats.departureLocal,
        arrivalLocal: scheduleWithSeats.arrivalLocal,
        aircraftName: scheduleWithSeats.aircraftName,
        capacity: scheduleWithSeats.capacity,
        price: scheduleWithSeats.price,
        bookedSeats: scheduleWithSeats.bookedSeats,
        availableSeats: scheduleWithSeats.availableSeats,
      },
    });
  } catch (error) {
    console.error("Failed to fetch booking:", error);

    return NextResponse.json(
      { error: "Failed to fetch booking" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ reference: string }> }
) {
  try {
    const { reference } = await params;
    const db = await getDb();

    const schedule = await db.collection<ScheduleDocument>("schedules").findOne({
      "bookings.reference": reference,
    });

    if (!schedule) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    const booking = (schedule.bookings || []).find(
      (item: Booking) => item.reference === reference
    );

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    if (booking.status === "cancelled") {
      return NextResponse.json(
        { error: "Booking is already cancelled" },
        { status: 409 }
      );
    }

    await db.collection<ScheduleDocument>("schedules").updateOne(
      {
        _id: schedule._id,
        "bookings.reference": reference,
      },
      {
        $set: {
          "bookings.$.status": "cancelled",
          "bookings.$.cancelledAt": new Date(),
        },
      }
    );

    return NextResponse.json({
      message: "Booking cancelled successfully",
      reference,
    });
  } catch (error) {
    console.error("Failed to cancel booking:", error);

    return NextResponse.json(
      { error: "Failed to cancel booking" },
      { status: 500 }
    );
  }
}