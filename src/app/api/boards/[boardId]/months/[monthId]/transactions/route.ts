import { NextRequest, NextResponse } from "next/server";
import { TransactionRepository } from "@/infrastructure/adapters/repositories/TransactionRepository";
import { getTransactionsByMonth } from "@/domain/useCases/transactions/data/GetTransactionsByMonth";

const transactionRepository = new TransactionRepository();

// GET retrieve all transactions
export async function GET(
  request: NextRequest,
  { params }: { params: { boardId: string; monthId: string } }
) {
  try {
    // Authenticate user
    const monthId = params.monthId;
    const transactions = await getTransactionsByMonth(
      monthId,
      transactionRepository
    );
    if (transactions.length === 0) {
      return NextResponse.json(
        { message: "No transactions found for the month." },
        { status: 404 }
      );
    }

    return NextResponse.json({ transactions }, { status: 200 });
  } catch (error: any) {
    console.error(`Error getting transactions: ${error}`);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
