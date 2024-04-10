"use client";

import { useState } from "react";
import {
  ComponentDataErrorProps,
  DataError,
} from "@/components/errors/DataError";
import { ITransactionEntity } from "@/domain/entities/ITransactionEntity";
import convertUNIXtoISODateForForm from "../utils/convertDateForForms";

interface INewTransactionButtonProps {
  boardId: string;
  transaction: ITransactionEntity;
}

export default function EditTransactionButton({
  boardId,
  transaction,
}: INewTransactionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [createError, setCreateError] =
    useState<ComponentDataErrorProps | null>(null);
  const [formData, setFormData] = useState({
    _id: transaction._id,
    name: transaction.name,
    type: transaction.type,
    description: transaction.description,
    amount: transaction.amount,
    date: convertUNIXtoISODateForForm(transaction.date as number),
    location: transaction.location,
    category: transaction.category,
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const createdTransactionData = {
      _id: formData._id,
      name: formData.name,
      amount: formData.amount,
      type: formData.type,
      date: formData.date,
      location: formData.location,
      category: formData.category,
    };
    const response = await fetch(
      `/api/boards/${boardId}/transactions/${transaction._id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(createdTransactionData),
      },
    );
    if (response.ok) {
      const { board: createdBoard } = await response.json();
      window.location.reload();
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
        type="button"
        title="Edit Transaction"
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
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black opacity-50"></div>
          <form
            onSubmit={handleSubmit}
            className="fixed inset-0 z-50 m-auto h-[500px] w-[500px] rounded-lg bg-white px-4 py-3 shadow-md"
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
                    Transaction Name:
                  </label>
                  <input
                    className="m-3 rounded-md border-2 border-solid border-black px-3 py-1"
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter transaction name"
                    required
                  />
                </div>
                <div className="flex justify-between">
                  <label className="m-3 font-semibold" htmlFor="description">
                    Transaction Amount:
                  </label>
                  <input
                    className="m-3 rounded-md border-2 border-solid border-black px-3 py-1"
                    type="number"
                    id="amount"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        amount: Number(e.target.value),
                      })
                    }
                    placeholder="Enter transaction amount"
                    required
                  />
                </div>
                <div>
                  <label className="m-3 font-semibold" htmlFor="description">
                    Transaction Date:
                  </label>
                  <input
                    className="m-3 rounded-md border-2 border-solid border-black px-3 py-1"
                    type="date"
                    id="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    placeholder="Enter transaction date"
                    required
                  />
                </div>
                <div>
                  <label className="m-3 font-semibold" htmlFor="description">
                    Transaction Location:
                  </label>
                  <input
                    className="m-3 rounded-md border-2 border-solid border-black px-3 py-1"
                    type="text"
                    id="location"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="Enter transaction location"
                    required
                  />
                </div>
                <div>
                  <label className="m-3 font-semibold" htmlFor="description">
                    Transaction Category:
                  </label>
                  <select
                    className="m-3 w-[243.2px] rounded-md border-2 border-solid border-black px-3 py-1"
                    id="category"
                    onChange={(e) =>
                      // @ts-ignore
                      setFormData({ ...formData, category: e.target.value })
                    }
                    required
                  >
                    <option value="" disabled hidden>
                      Select Category
                    </option>
                    <option value="housing">Housing</option>
                    <option value="transportation">Transportation</option>
                    <option value="food">Food</option>
                    <option value="utilities">Utilities</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="insurance">Insurance</option>
                    <option value="household supplies">
                      Household Supplies
                    </option>
                    <option value="personal">Personal</option>
                    <option value="education">Education</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="my-4 ml-[37%] rounded-md bg-slate-600 px-3 py-2 font-bold text-white"
                >
                  Edit Transaction
                </button>
              </>
            )}
          </form>
        </>
      )}
    </>
  );
}
