"use client";
import { useState } from "react";
import { mutate } from "swr";
import { ITransactionEntity } from "@/domain/entities/ITransactionEntity";
import { ComponentDataErrorProps, DataError } from "../errors/DataError";

interface IDeleteTransactionProps {
  boardId: string;
  monthId: string;
  transactionData: ITransactionEntity;
}

export default function DeleteTransactionButton({
  boardId,
  monthId,
  transactionData,
}: IDeleteTransactionProps) {
  const [deleteError, setDeleteError] =
    useState<ComponentDataErrorProps | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async (e: any) => {
    const response = await fetch(
      `/api/boards/${boardId}/transactions/${transactionData._id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    if (response.ok) {
      mutate(
        `/api/boards/${boardId}/months/${monthId}/transactions`,
        (currentData) => {
          if (currentData && Array.isArray(currentData.transactions)) {
            const updatedTransactions = currentData.transactions.filter(
              (transaction: ITransactionEntity) =>
                transaction._id !== transactionData._id,
            );

            return {
              ...currentData,
              transactions: updatedTransactions,
            };
          }

          return currentData;
        },
        false,
      );
      setIsOpen(false);
    }
  };

  return (
    <>
      {transactionData && (
        <button
          type="button"
          title="Delete Transaction"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="m-1 h-5 w-5"
          >
            <path
              fillRule="evenodd"
              d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black opacity-50"></div>
          <div className="fixed inset-0 z-50 m-auto h-[200px] w-[450px] rounded-lg bg-white px-4 py-3 shadow-md">
            {deleteError ? (
              <>
                <div className="mb-12 flex justify-between">
                  <h3 className="text-xl font-bold underline">
                    Delete Transaction:
                  </h3>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setDeleteError(null);
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
                  statusCode={deleteError.statusCode}
                  title={deleteError.title}
                  message={deleteError.message}
                />
              </>
            ) : (
              <>
                <div className="flex justify-between">
                  <h3 className="text-xl font-bold underline">
                    Delete Transaction:
                  </h3>
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
                <div className="flex h-full flex-col items-center justify-center">
                  <p className="mb-4 text-center">
                    Are you sure you want to delete{" "}
                    <strong>{transactionData.name}</strong> ?
                  </p>
                  <button
                    className="mt-3 rounded-md bg-red-500 px-3 py-2 font-bold text-white"
                    onClick={handleDelete}
                  >
                    Delete Transaction
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
}
