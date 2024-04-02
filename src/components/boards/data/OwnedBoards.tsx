"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useSWR from "swr";
import { useEffect } from "react";
import { IBoardEntity } from "@/domain/entities/IBoardEntity";
import { DataError } from "../../errors/DataError";
import convertUNIXtoISODate from "../../utils/convertTime";
import EditBoard from "../management/EditBoard";
import DeleteBoard from "../management/DeleteBoard";
import SharedUsers from "./SharedUsers";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function OwnedBoards() {
  const { data: boardData, error: boardDataError } = useSWR(
    "/api/boards",
    fetcher,
  );
  const router = useRouter();

  useEffect(() => {
    if (boardDataError?.status === 401) {
      router.push("/api/auth/signin");
    }
  }, [boardDataError, router]);

  if (boardDataError)
    return (
      <DataError
        message="Unable to find your boards. Please try again later..."
        statusCode={boardDataError.status}
        title="Get Data Error"
      />
    );
  if (!boardData)
    return (
      <div className="h-[215px] rounded border border-solid border-black p-5">
        <p className="text-center font-bold">Loading...</p>
      </div>
    );

  return (
    <section className="flex flex-wrap justify-center">
      {boardData.boards.map((board: IBoardEntity) => {
        return (
          <div
            key={board._id}
            className="m-3 w-[250px] rounded-md border border-solid border-black"
          >
            <Link href={`/viewBoards/${board._id}`}>
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
                  <strong>Status:</strong>{" "}
                  {board.privacy.charAt(0).toUpperCase() +
                    board.privacy.slice(1)}
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
            <div className="m-1 flex justify-end border-t border-black pt-1">
              <EditBoard boardData={board} />
              <DeleteBoard boardData={board} />
            </div>
          </div>
        );
      })}
    </section>
  );
}
