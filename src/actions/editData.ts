"use server";
import { cookies } from "next/headers";
import { IBoardEntity } from "@/domain/entities/IBoardEntity";
import { ITransactionEntity } from "@/domain/entities/ITransactionEntity";
import { IUserEntity } from "@/domain/entities/IUserEntity";

export async function editData(
  apiEndpoint: string,
  data:
    | Partial<IBoardEntity>
    | Partial<IUserEntity>
    | Partial<ITransactionEntity>,
) {
  try {
    const url = process.env.API_HREF + apiEndpoint;
    const response = await fetch(url, {
      method: "PATCH",
      headers: { Cookie: cookies().toString() },
      body: JSON.stringify(data),
    });

    return response;
  } catch (error: any) {
    console.error(error);
  }
}
