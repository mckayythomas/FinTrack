"use client";
import { useState } from "react";
import { mutate } from "swr";
import { ComponentDataErrorProps } from "@/components/errors/DataError";
import { IUserEntity } from "@/domain/entities/IUserEntity";

interface IUnshareBoardProps {
  userData: any;
  boardId: string;
}

export default function UnshareBoard({
  userData,
  boardId,
}: IUnshareBoardProps) {
  const [unshareError, setUnshareError] =
    useState<ComponentDataErrorProps | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleRemoveUser = async (e: any) => {
    e.preventDefault();
    const userId = { userId: userData._id };
    console.log(userId);
    const response = await fetch(`/api/boards/${boardId}/shared/remove`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userId),
    });
    if (response.ok) {
      mutate(
        "/api/boards",
        (currentData) => {
          if (currentData && Array.isArray(currentData.users)) {
            const updatedUsers = currentData.users.filter(
              (user: IUserEntity) => user._id !== userData._id,
            );
            return {
              ...currentData,
              users: updatedUsers,
            };
          }
          return currentData;
        },
        false,
      );
      setIsOpen(false);
      window.location.reload();
    } else {
      setUnshareError({
        statusCode: response.status,
        title: "Unshare Board Error",
        message: "Unable to remove user. Please try again later.",
      });
      setIsOpen(false);
    }
  };

  return (
    <>
      <button
        type="button"
        title="Remove User"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-5 w-5"
        >
          <path d="M10.375 2.25a4.125 4.125 0 1 0 0 8.25 4.125 4.125 0 0 0 0-8.25ZM10.375 12a7.125 7.125 0 0 0-7.124 7.247.75.75 0 0 0 .363.63 13.067 13.067 0 0 0 6.761 1.873c2.472 0 4.786-.684 6.76-1.873a.75.75 0 0 0 .364-.63l.001-.12v-.002A7.125 7.125 0 0 0 10.375 12ZM16 9.75a.75.75 0 0 0 0 1.5h6a.75.75 0 0 0 0-1.5h-6Z" />
        </svg>
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black opacity-50"></div>
          <div className="fixed inset-0 z-50 m-auto h-[250px] w-[500px] rounded-lg bg-white px-4 py-3 shadow-md">
            <h3 className="text-center text-xl font-bold">
              Are you sure you want to remove user
              <br />
              <span className="underline">{userData.name}</span>?
            </h3>
            <div className="align-center mt-[40px] flex justify-center">
              <button
                onClick={handleRemoveUser}
                className="m-2 rounded-md bg-red-600 px-3 py-2 font-bold text-white"
              >
                Yes, Unshare Board
              </button>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="m-2 rounded-md bg-slate-600 px-3 py-2 font-bold text-white"
              >
                No, Stay Shared
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
