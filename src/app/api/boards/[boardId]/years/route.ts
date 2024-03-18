import { NextRequest, NextResponse } from "next/server";
import { YearRepository } from "@/infrastructure/adapters/repositories/YearRepository";
import { getYearsByBoard } from "@/domain/useCases/years/data/GetAllYearsByBoard";

const yearRepository = new YearRepository();

// GET retrieve all years
export async function GET(
  request: NextRequest,
  { params }: { params: { boardId: string } }
) {
  try {
    // Authenticate user

    const boardId = params.boardId;
    const years = await getYearsByBoard(boardId, yearRepository);
    if (years.length === 0) {
      return NextResponse.json(
        { message: "No years found for the given board" },
        { status: 404 }
      );
    }

    return NextResponse.json({ years }, { status: 200 });
  } catch (error: any) {
    console.error(`Error getting years: ${error}`);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
