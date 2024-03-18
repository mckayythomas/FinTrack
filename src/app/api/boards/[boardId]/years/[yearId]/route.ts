import { NextRequest, NextResponse } from "next/server";
import { YearRepository } from "@/infrastructure/adapters/repositories/YearRepository";
import { getYearById } from "@/domain/useCases/years/data/GetYearById";

const yearRepository = new YearRepository();

// GET retrieve data for a single year
export async function GET(
  request: NextRequest,
  { params }: { params: { boardId: string; yearId: string } }
) {
  try {
    // Authenticate User
    const yearId = params.yearId;
    const year = await getYearById(yearId, yearRepository);
    if (!year) {
      return NextResponse.json(
        { error: `No year found for yearId: ${yearId}` },
        { status: 404 }
      );
    }

    return NextResponse.json({ year }, { status: 200 });
  } catch (error: any) {
    console.error(`Error getting year: ${error}`);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
