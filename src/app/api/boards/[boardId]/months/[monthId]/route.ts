import { NextRequest, NextResponse } from "next/server";
import { MonthRepository } from "@/infrastructure/adapters/repositories/MonthRepository";
import { getMonthById } from "@/domain/useCases/months/data/GetMonthById";

const monthRepository = new MonthRepository();

// GET retrieve single month
export async function GET(
  request: NextRequest,
  { params }: { params: { boardId: string; monthId: string } }
) {
  try {
    //  Authenticate user
    const monthId = params.monthId;
    const month = await getMonthById(monthId, monthRepository);
    if (!month) {
      return NextResponse.json(
        { error: `No board found for boardId: ${monthId}` },
        { status: 404 }
      );
    }

    return NextResponse.json({ month }, { status: 200 });
  } catch (error: any) {
    console.error(`Error getting month: ${error}`);
    return NextResponse.json(
      { message: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
