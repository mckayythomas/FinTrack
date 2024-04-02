"use client";
import { useState } from "react";
import { mutate } from "swr";
import { IBoardEntity } from "@/domain/entities/IBoardEntity";
import { DataError, ComponentDataErrorProps } from "../../errors/DataError";

interface IEditBoardProps {
  boardData: IBoardEntity;
}

export default function EditBoard({ boardData }: IEditBoardProps) {
  const [editError, setEditError] = useState<ComponentDataErrorProps | null>(
    null,
  );
  const [formData, setFormData] = useState({
    name: boardData.name,
    description: boardData.description,
  });
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const updatedBoardData = {
      name: formData.name,
      description: formData.description,
    };
    const response = await fetch(`/api/boards/${boardData._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedBoardData),
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
      setEditError({
        statusCode: response.status,
        title: "Edit Board Error",
        message: "Unable to edit board. Please try again later",
      });
    }
  };

  return (
    <>
      {boardData && (
        <button
          type="button"
          title="Edit Board"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="m-1 h-5 w-5"
          >
            <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
          </svg>
        </button>
      )}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black opacity-50"></div>
          <form
            onSubmit={handleSubmit}
            className="fixed inset-0 z-50 m-auto h-[250px] w-[500px] rounded-lg bg-white px-4 py-3 shadow-md"
          >
            {editError ? (
              <>
                <div className="mb-12 flex justify-between">
                  <h3 className="text-xl font-bold underline">Edit Board:</h3>
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
                  <h3 className="text-xl font-bold underline">Edit Board:</h3>
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
                  <label className="m-3 font-semibold" htmlFor="name">
                    Board Name:
                  </label>
                  <input
                    className="m-3 rounded-md border-2 border-solid border-black px-3 py-1"
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter board name"
                  />
                </div>
                <div className="flex justify-between">
                  <label className="m-3 font-semibold" htmlFor="description">
                    Board Description:
                  </label>
                  <input
                    className="m-3 rounded-md border-2 border-solid border-black px-3 py-1"
                    type="text"
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Enter board description"
                  />
                </div>
                <button
                  type="submit"
                  className="my-4 ml-[37%] rounded-md bg-slate-600 px-3 py-2 font-bold text-white"
                >
                  Make Changes
                </button>
              </>
            )}
          </form>
        </>
      )}
    </>
  );
}
