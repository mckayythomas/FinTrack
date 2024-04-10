import { ErrorProps } from "next/error";

export interface ComponentDataErrorProps extends ErrorProps {
  message: string;
}

export function DataError({
  statusCode,
  title,
  message,
}: ComponentDataErrorProps) {
  return (
    <div className="rounded border border-solid border-red-500">
      <h3 className="px-2 font-bold text-red-500">
        {statusCode} {title}:
      </h3>
      <p className="px-2 text-red-500">Something went wrong :(</p>
      <p className="px-2 text-red-500">{message}</p>
    </div>
  );
}
