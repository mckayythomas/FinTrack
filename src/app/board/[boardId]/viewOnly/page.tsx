import { cookies } from "next/headers";
import YearsDashboard from "@/components/years/YearsDashboard";
import NewTransactionButton from "@/components/transactions/NewTransactionButton";

export default async function Board({
  params,
}: {
  params: { boardId: string };
}) {
  const boardId = params.boardId;
  const boardData = await fetch(`http://localhost:3000/api/boards/${boardId}`, {
    method: "GET",
    headers: { Cookie: cookies().toString() },
  });
  const board = await boardData.json();

  const yearsData = await fetch(
    `http://localhost:3000/api/boards/${boardId}/years`,
    {
      method: "GET",
      headers: { Cookie: cookies().toString() },
    },
  );
  let years = [];
  if (yearsData.status === 200) {
    years = await yearsData.json();
    years = years.years;
  } else if (yearsData.status === 400) {
    years = [];
  } else {
    years = [];
    console.error(await yearsData.json());
  }

  return (
    <>
      <div className="my-8 flex justify-between">
        <h2 className="text-2xl font-bold underline">{board.board.name}</h2>
      </div>
      <div>
        <YearsDashboard viewOnly={true} years={years} boardId={boardId} />
      </div>
    </>
  );
}
