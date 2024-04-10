import { cookies } from "next/headers";
import MonthsDashboard from "@/components/months/MonthsDashboard";
import NewTransactionButton from "@/components/transactions/NewTransactionButton";

export default async function Year({
  params,
}: {
  params: { boardId: string; yearId: string };
}) {
  const boardId = params.boardId;
  const yearId = params.yearId;

  const boardData = await fetch(
    `https://fin-track-nine.vercel.app/api/boards/${boardId}`,
    {
      method: "GET",
      headers: { Cookie: cookies().toString() },
    },
  );
  const board = await boardData.json();

  const monthsData = await fetch(
    `https://fin-track-nine.vercel.app/api/boards/${boardId}/years/${yearId}/months`,
    {
      method: "GET",
      headers: { Cookie: cookies().toString() },
    },
  );
  let months = [];
  if (monthsData.status === 200) {
    months = await monthsData.json();
    months = months.months;
  } else if (monthsData.status === 400) {
    months = [];
  } else {
    months = [];
    console.error(await monthsData.json());
  }

  return (
    <>
      <div className="my-8 flex justify-between">
        <h2 className="text-2xl font-bold underline">{board.board.name}</h2>
      </div>
      <div>
        <MonthsDashboard boardId={boardId} months={months} viewOnly={true} />
      </div>
    </>
  );
}
