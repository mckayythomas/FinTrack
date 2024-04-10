import useSWR from "swr";
import { ITransactionEntity } from "@/domain/entities/ITransactionEntity";
import { DataError } from "../errors/DataError";
import convertUNIXtoISODate from "../utils/convertTime";
import EditTransactionButton from "./EditTransaction";
import DeleteTransactionButton from "./DeleteTransaction";

interface ITransactionListProps {
  viewOnly: Boolean;
  boardId: string;
  monthId: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function TransactionList({
  viewOnly,
  boardId,
  monthId,
}: ITransactionListProps) {
  const {
    data: transactionsData,
    error: transactionsDataError,
    isLoading,
  } = useSWR(`/api/boards/${boardId}/months/${monthId}/transactions`, fetcher);

  if (transactionsDataError)
    return (
      <DataError
        message="Unable to find your transactions for this month. Please try again later..."
        statusCode={transactionsDataError.status}
        title="Get Data Error"
      />
    );

  if (isLoading)
    return (
      <div className="rounded border border-solid border-black p-5">
        <p className="text-center font-bold">Loading...</p>
      </div>
    );

  if (transactionsData.transactions.length === 0) {
    return (
      <div className="m-8 text-center font-bold">
        You have no transactions for this month yet.
      </div>
    );
  }
  return (
    <div className="max-h-[233px] overflow-y-auto">
      {transactionsData.transactions.map((transaction: ITransactionEntity) => {
        return (
          <article className="m-2 flex justify-between" key={transaction._id}>
            <div>
              <p className="font-bold">{transaction.name}</p>
              <p>{transaction.location}</p>
              <p>
                {transaction.category.charAt(0).toUpperCase() +
                  transaction.category.slice(1)}
              </p>
            </div>
            <div>
              <p className="text-end font-bold">
                $ {transaction.amount.toFixed(2)}
              </p>
              <p>{convertUNIXtoISODate(transaction.date as number)}</p>
              {viewOnly ? null : (
                <div className="flex justify-end">
                  <EditTransactionButton
                    boardId={boardId}
                    transaction={transaction}
                  />
                  <DeleteTransactionButton
                    boardId={boardId}
                    monthId={monthId}
                    transactionData={transaction}
                  />
                </div>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
