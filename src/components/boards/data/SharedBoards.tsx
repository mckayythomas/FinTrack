import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { DataError } from "../../errors/DataError";

async function getOwnedBoards() {
  const boards = await fetch(`${process.env.API_HREF}/api/boards/shared`, {
    method: "GET",
    headers: { Cookie: cookies().toString() },
  });

  return boards;
}

export default async function SharedBoards() {
  const boards = await getOwnedBoards();
  if (boards.status === 401) {
    redirect("api/auth/signin");
  } else if (boards.status === 404) {
    return (
      <div className="rounded border border-solid border-black p-5">
        <p className="text-center font-bold">
          No one has shared a board with you yet.
        </p>
      </div>
    );
  } else if (!boards.ok) {
    return (
      <DataError
        message={"Unable to find your boards. Please try again later..."}
        statusCode={boards.status}
        title="Get Data Error"
      />
    );
  }

  const boardsData = await boards.json();

  return <div></div>;
}
