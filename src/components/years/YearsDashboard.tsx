"use client";

import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import Link from "next/link";
import { IYearEntity } from "@/domain/entities/IYearEntity";

interface IYearDashboardProps {
  viewOnly: Boolean;
  years: IYearEntity[];
  boardId: string;
}

export default function YearsDashboard({
  viewOnly,
  years,
  boardId,
}: IYearDashboardProps) {
  if (years.length === 0) {
    return (
      <div className="rounded-md border border-solid border-black p-20 text-center font-bold">
        There are no transactions for this board yet.
      </div>
    );
  }

  years = [...years].sort((year1, year2) => {
    return year1.year - year2.year;
  });

  return (
    <Tabs>
      <TabList className="flex rounded-t-md border-2 border-solid border-black">
        {years.map((year) => {
          return (
            <Tab
              className="rounded-tr-md border-r-2 border-black px-4"
              key={year._id}
            >
              {year.year}
            </Tab>
          );
        })}
      </TabList>
      {years.map((year) => {
        return (
          <TabPanel key={year._id}>
            <div className="h-[400px] rounded-b-md border-2 border-black">
              <h1 className="m-4 text-lg font-bold">{year.year}</h1>
              <p className="m-4">Total Expenses: ${year.totalExpenses}</p>
              <p className="m-4">Total Income: ${year.totalIncome}</p>
              <Link
                href={
                  viewOnly
                    ? `/board/${boardId}/viewOnly/${year._id}`
                    : `/board/${boardId}/${year._id}`
                }
                className="m-4 bg-slate-600 px-3 py-2 font-bold text-white "
              >
                View Months for {year.year}
              </Link>
            </div>
          </TabPanel>
        );
      })}
    </Tabs>
  );
}
