"use client";
import { useState } from "react";
import useSWR from "swr";
import { IBoardEntity } from "@/domain/entities/IBoardEntity";
import {
  DataError,
  ComponentDataErrorProps,
} from "@/components/errors/DataError";
import ShareBoard from "../management/ShareBoard";

interface ISharedUsersProps {
  boardData: IBoardEntity;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function SharedUsers({ boardData }: ISharedUsersProps) {
  const [editError, setEditError] = useState<ComponentDataErrorProps | null>(
    null,
  );
  const [isOpen, setIsOpen] = useState(false);

  const { data: sharedUsersData, error: sharedUsersDataError } = useSWR(
    `/api/boards/${boardData._id}/shared/users`,
    fetcher,
  );
  console.log(sharedUsersData);

  if (sharedUsersDataError)
    return (
      <DataError
        message="Unable to find your boards. Please try again later..."
        statusCode={sharedUsersDataError.status}
        title="Get Data Error"
      />
    );

  return (
    <>
      {boardData && (
        <button
          type="button"
          title="Shared Users"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-6 w-6"
          >
            <path d="M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.25 8.625a3.375 3.375 0 1 1 6.75 0 3.375 3.375 0 0 1-6.75 0ZM1.5 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM17.25 19.128l-.001.144a2.25 2.25 0 0 1-.233.96 10.088 10.088 0 0 0 5.06-1.01.75.75 0 0 0 .42-.643 4.875 4.875 0 0 0-6.957-4.611 8.586 8.586 0 0 1 1.71 5.157v.003Z" />
          </svg>
        </button>
      )}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black opacity-50"></div>
          <div className="fixed inset-0 z-50 m-auto h-[250px] w-[500px] rounded-lg bg-white px-4 py-3 shadow-md">
            {editError ? (
              <>
                <div className="mb-12 flex justify-between">
                  <h3 className="text-xl font-bold underline">Shared With:</h3>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setEditError(null);
                    }}
                    className="text-red-500 hover:bg-red-500 hover:text-white"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-6 w-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
                <DataError
                  statusCode={editError.statusCode}
                  title={editError.title}
                  message={editError.message}
                />
              </>
            ) : (
              <>
                <div className="flex justify-between">
                  <h3 className="flex-grow text-xl font-bold underline">
                    Shared With:
                  </h3>
                  <ShareBoard boardData={boardData} />
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-red-500 hover:bg-red-500 hover:text-white"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-6 w-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
                <div className="">
                  {boardData.sharedUsers!.length === 0 ? (
                    <>
                      <div className="mx-1 my-1 flex h-[198px] items-center justify-center rounded-md border border-solid border-black text-center font-bold">
                        <p>This Board is not shared with anyone yet.</p>
                      </div>
                    </>
                  ) : (
                    <>
                      {!sharedUsersData ? (
                        <div>
                          <p>Loading Shared Users...</p>
                        </div>
                      ) : (
                        sharedUsersData.map((sharedUser: any) => (
                          <div key={sharedUser._id}>
                            <p>{sharedUser.name}</p>
                            <p>{sharedUser.email}</p>
                            <p>
                              {sharedUser.accessLevel === "view-only"
                                ? "View Only"
                                : "Contributor"}
                            </p>
                          </div>
                        ))
                      )}
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
}
