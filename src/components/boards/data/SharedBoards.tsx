import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { IBoardEntity } from "@/domain/entities/IBoardEntity";
import convertUNIXtoISODate from "@/components/utils/convertTime";
import { auth } from "@/infrastructure/auth/nextAuth";
import { DataError } from "../../errors/DataError";
import EditBoard from "../management/EditBoard";

async function getSharedBoards() {
  const boardsData = await fetch(`${process.env.API_HREF}/api/boards/shared`, {
    method: "GET",
    headers: { Cookie: cookies().toString() },
  });
  return boardsData;
}

export default async function SharedBoards() {
  const session = await auth();
  const boardsData = await getSharedBoards();
  if (boardsData.status === 401) {
    redirect("api/auth/signin");
  }
  if (!boardsData.ok) {
    return (
      <DataError
        message={"Unable to find your boards. Please try again later..."}
        statusCode={boardsData.status}
        title="Get Data Error"
      />
    );
  }
  const boards = await boardsData.json();
  const userId = session?.user?.id;
  if (boards.boards.length === 0) {
    return (
      <div className="rounded border border-solid border-black p-5">
        <p className="text-center font-bold">
          No one has shared a board with you yet.
        </p>
      </div>
    );
  }

  return (
    <section className="flex flex-wrap justify-center">
      {boards.boards.map((board: IBoardEntity) => {
        return (
          <div key={board._id}>
            <div
              key={board._id}
              className="m-3 w-[250px] rounded-md border border-solid border-black"
            >
              <Link
                href={
                  board.sharedUsers?.find((user) => user.userId === userId)
                    ?.accessLevel === "contributor"
                    ? `/board/${board._id}`
                    : `/board/${board._id}/viewOnly`
                }
              >
                <h3 className="text-center text-xl font-bold">{board.name}</h3>
                <ul className="mx-2">
                  <li className="h-[72px]">
                    <strong>Description: </strong>
                    {board.description
                      ? board.description.length > 100
                        ? board.description.substring(0, 70) + "..."
                        : board.description
                      : "No description"}
                  </li>
                  <li>
                    <strong>Permission:</strong>{" "}
                    {board.sharedUsers?.find((user) => user.userId === userId)
                      ?.accessLevel === "contributor"
                      ? "Contributor"
                      : "View Only"}
                  </li>
                  <li>
                    <strong>Created On:</strong>{" "}
                    {convertUNIXtoISODate(board.createdAt!)}
                  </li>
                  <li>
                    <strong>Last Updated:</strong>{" "}
                    {convertUNIXtoISODate(board.updatedAt!)}
                  </li>
                </ul>
              </Link>
              {board.sharedUsers?.find((user) => user.userId === userId)
                ?.accessLevel === "contributor" ? (
                <div className="z-50 m-1 flex justify-end border-t border-t-black pt-1">
                  <EditBoard boardData={board} />
                </div>
              ) : null}
            </div>
          </div>
        );
      })}
    </section>
  );
}
