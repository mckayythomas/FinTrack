"use client";

import { useState } from "react";
import { mutate } from "swr";
import {
  ComponentDataErrorProps,
  DataError,
} from "@/components/errors/DataError";

export default function AddNewBoardButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [createError, setCreateError] =
    useState<ComponentDataErrorProps | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const createdBoardData = {
      name: formData.name,
      description: formData.description,
    };
    const response = await fetch(`/api/boards`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(createdBoardData),
    });
    if (response.ok) {
      const { board: createdBoard } = await response.json();
      mutate(
        "/api/boards",
        (currentData) => {
          if (currentData && Array.isArray(currentData.boards)) {
            return {
              ...currentData,
              boards: [...currentData.boards, createdBoard],
            };
          }
          return currentData;
        },
        true,
      );
      setIsOpen(false);
    } else {
      setCreateError({
        statusCode: response.status,
        title: "Create Board Error",
        message: "Unable to create board. Please try again later",
      });
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-md bg-slate-600 px-3 py-1 font-bold text-white"
      >
        + Add New Board
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black opacity-50"></div>
          <form
            onSubmit={handleSubmit}
            className="fixed inset-0 z-50 m-auto h-[250px] w-[500px] rounded-lg bg-white px-4 py-3 shadow-md"
          >
            {createError ? (
              <>
                <div className="flex justify-between">
                  <h3>New Board:</h3>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setCreateError(null);
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
                  message={createError.message}
                  title={createError.title}
                  statusCode={createError.statusCode}
                />
              </>
            ) : (
              <>
                <div className="flex justify-between">
                  <h3>Create Board:</h3>
                  <button
                    onClick={() => {
                      setIsOpen(false);
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
                  Create Board
                </button>
              </>
            )}
          </form>
        </>
      )}
    </>
  );
}
