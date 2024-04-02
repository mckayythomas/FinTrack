"use server";
import { cookies } from "next/headers";

export async function getData(apiEndpoint: string) {
  try {
    const url = process.env.API_HREF + apiEndpoint;
    const response = await fetch(url, {
      method: "GET",
      headers: { Cookie: cookies().toString() },
    });

    if (!response.ok && response.status !== 401) {
      console.log(await response.json());
      throw new Error(`Couldn't get data for endpoint: ${apiEndpoint}`);
    } else if (response.status === 401) {
      return "not-logged-in";
    }

    return response.json();
  } catch (error: any) {
    console.error(error);
  }
}
