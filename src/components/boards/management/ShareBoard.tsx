"use client";
import { useState } from "react";
import { mutate } from "swr";
import { IBoardEntity } from "@/domain/entities/IBoardEntity";
import { DataError, ComponentDataErrorProps } from "../../errors/DataError";
import isEmail from "../../utils/checkEmail";

interface IShareBoardProps {
  boardData: IBoardEntity;
}

export default function ShareBoard({ boardData }: IShareBoardProps) {
  const [shareError, setShareError] = useState<ComponentDataErrorProps | null>(
    null,
  );
  const [formData, setFormData] = useState({
    user: "",
    accessLevel: "",
  });
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const sharedBoardData = {
      name: !isEmail(formData.user) ? formData.user : undefined,
      email: isEmail(formData.user) ? formData.user : undefined,
      accessLevel: formData.accessLevel,
    };
    const response = await fetch(`/api/boards/${boardData._id}/shared`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sharedBoardData),
    });
    if (response.ok) {
      const { board: updatedBoard } = await response.json();
      mutate(
        "/api/boards",
        (cachedData) => {
          if (!cachedData || !cachedData.boards) return cachedData;
          const index = cachedData.boards.findIndex(
            (board: IBoardEntity) => board._id === boardData._id,
          );

          if (index !== -1) {
            const updatedBoards = [...cachedData.boards];
            updatedBoards[index] = updatedBoard;

            return { ...cachedData, boards: updatedBoards };
          }
          return cachedData;
        },
        false,
      );
      setIsOpen(false);
    } else {
      setShareError({
        statusCode: response.status,
        title: "Share Board Error",
        message: "Unable to share board. Please try again later",
      });
    }
  };

  return (
    <>
      {boardData && (
        <button
          type="button"
          title="Share Board"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="m-1 h-5 w-5"
          >
            <path d="M5.25 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM2.25 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM18.75 7.5a.75.75 0 0 0-1.5 0v2.25H15a.75.75 0 0 0 0 1.5h2.25v2.25a.75.75 0 0 0 1.5 0v-2.25H21a.75.75 0 0 0 0-1.5h-2.25V7.5Z" />
          </svg>
        </button>
      )}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black opacity-50"></div>
          <form
            onSubmit={handleSubmit}
            className="fixed inset-0 z-50 m-auto h-[250px] w-[550px] rounded-lg bg-white px-4 py-3 shadow-md"
          >
            {shareError ? (
              <>
                <div className="mb-12 flex justify-between">
                  <h3 className="text-xl font-bold underline">Share Board:</h3>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setShareError(null);
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
                  statusCode={shareError.statusCode}
                  title={shareError.title}
                  message={shareError.message}
                />
              </>
            ) : (
              <>
                <div className="flex justify-between">
                  <h3 className="text-xl font-bold underline">Share Board:</h3>
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
                <div className="flex justify-between">
                  <label className="m-3 font-semibold" htmlFor="user">
                    User by account email or name:
                  </label>
                  <input
                    className="m-3 rounded-md border-2 border-solid border-black px-3 py-1"
                    type="text"
                    id="user"
                    onChange={(e) =>
                      setFormData({ ...formData, user: e.target.value })
                    }
                    placeholder="Enter user name or email"
                    required
                  />
                </div>
                <div className="flex justify-between">
                  <label className="m-3 font-semibold" htmlFor="access-level">
                    Access Level:
                  </label>
                  <select
                    className="m-3 w-[243.2px] rounded-md border-2 border-solid border-black px-3 py-1"
                    id="access-level"
                    onChange={(e) =>
                      setFormData({ ...formData, accessLevel: e.target.value })
                    }
                    required
                  >
                    <option value="" disabled selected hidden>
                      Select Access Level
                    </option>
                    <option value="view-only">View Only</option>
                    <option value="contributor">Contributor</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="my-4 ml-[37%] rounded-md bg-slate-600 px-3 py-2 font-bold text-white"
                >
                  Share Board
                </button>
              </>
            )}
          </form>
        </>
      )}
    </>
  );
}
