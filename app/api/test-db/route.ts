import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await getDb();

    await db.command({ ping: 1 });

    return NextResponse.json({
      success: true,
      message: "Connected to MongoDB Atlas successfully",
      database: db.databaseName,
    });
  } catch (error) {
    console.error("MongoDB connection error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to connect to MongoDB Atlas",
      },
      { status: 500 }
    );
  }
}