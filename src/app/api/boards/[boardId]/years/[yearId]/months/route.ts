import { NextRequest, NextResponse } from "next/server";
import { MonthRepository } from "@/infrastructure/adapters/repositories/MonthRepository";
import { getMonthsByYear } from "@/domain/useCases/months/data/GetMonthsByYear";

const monthRepository = new MonthRepository();

// GET retrieve all months by year id
export async function GET(
  request: NextRequest,
  { params }: { params: { boardId: string; yearId: string } }
) {
  try {
    // Authenticate user
    const yearId = params.yearId;
    const months = await getMonthsByYear(yearId, monthRepository);
    if (!months) {
      return NextResponse.json(
        { error: `No months found for yearId: ${yearId}` },
        { status: 404 }
      );
    }

    return NextResponse.json({ months }, { status: 200 });
  } catch (error: any) {
    console.error(`Error getting months: ${error}`);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later" },
      { status: 500 }
    );
  }
}
