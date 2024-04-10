"use client";

import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { IMonthEntity } from "@/domain/entities/IMonthEntity";
import TransactionList from "../transactions/TransactionList";

interface IMonthDashboardProps {
  viewOnly: Boolean;
  boardId: string;
  months: IMonthEntity[];
}

function getMonthName(monthNumber: number) {
  let monthName;
  switch (monthNumber) {
    case 1:
      monthName = "Jan";
      break;
    case 2:
      monthName = "Feb";
      break;
    case 3:
      monthName = "Mar";
      break;
    case 4:
      monthName = "Apr";
      break;
    case 5:
      monthName = "May";
      break;
    case 6:
      monthName = "Jun";
      break;
    case 7:
      monthName = "Jul";
      break;
    case 8:
      monthName = "Aug";
      break;
    case 9:
      monthName = "Sep";
      break;
    case 10:
      monthName = "Oct";
      break;
    case 11:
      monthName = "Nov";
      break;
    case 12:
      monthName = "Dec";
      break;
    default:
      monthName = undefined;
      break;
  }
  return monthName;
}

export default function MonthsDashboard({
  viewOnly,
  boardId,
  months,
}: IMonthDashboardProps) {
  months = [...months].sort((month1, month2) => {
    return month1.month - month2.month;
  });

  return (
    <Tabs>
      <TabList className="flex flex-wrap rounded-t-md border-2 border-solid border-black">
        {months.map((month) => {
          return (
            <Tab
              className="rounded-tr-md border-r-2 border-t border-black px-4"
              key={month._id}
            >
              {getMonthName(month.month)}
            </Tab>
          );
        })}
      </TabList>
      {months.map((month) => {
        return (
          <TabPanel key={month._id}>
            <div className="h-[400px] rounded-b-md border-2 border-black">
              <h1 className="m-4 text-lg font-bold">
                {getMonthName(month.month)}
              </h1>
              <p className="m-4">Total Expenses: ${month.totalExpenses}</p>
              <p className="m-4">Total Income: ${month.totalIncome}</p>
              <div>
                <TransactionList
                  boardId={boardId}
                  monthId={month._id!}
                  viewOnly={viewOnly}
                />
              </div>
            </div>
          </TabPanel>
        );
      })}
    </Tabs>
  );
}
