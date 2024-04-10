"use client";

import { useState } from "react";
import {
  ComponentDataErrorProps,
  DataError,
} from "@/components/errors/DataError";

interface INewTransactionButtonProps {
  boardId: string;
}

export default function NewTransactionButton({
  boardId,
}: INewTransactionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [createError, setCreateError] =
    useState<ComponentDataErrorProps | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "expense",
    description: "",
    amount: 0,
    date: "",
    location: "",
    category: "",
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const createdTransactionData = {
      name: formData.name,
      amount: formData.amount,
      type: formData.type,
      date: formData.date,
      location: formData.location,
      category: formData.category,
    };
    const response = await fetch(`/api/boards/${boardId}/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(createdTransactionData),
    });
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
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-md bg-slate-600 px-3 py-1 font-bold text-white"
      >
        + Add New Transaction
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
                  <label className="m-3 font-semibold" htmlFor="amount">
                    Transaction Amount:
                  </label>
                  <input
                    className="m-3 ml-6 rounded-md border-2 border-solid border-black px-3 py-1"
                    type="number"
                    min="0"
                    step="0.01"
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
                  <label className="m-3 font-semibold" htmlFor="date">
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
                  <label className="m-3 font-semibold" htmlFor="location">
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
                  <label className="m-3 font-semibold" htmlFor="category">
                    Transaction Category:
                  </label>
                  <select
                    className="m-3 w-[243.2px] rounded-md border-2 border-solid border-black px-3 py-1"
                    id="category"
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    required
                  >
                    <option value="" disabled selected hidden>
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
                  Create Transaction
                </button>
              </>
            )}
          </form>
        </>
      )}
    </>
  );
}
