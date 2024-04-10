import Image from "next/image";
import Link from "next/link";
import { auth } from "@/infrastructure/auth/nextAuth";

export default async function Header() {
  const session = await auth();

  return (
    <header className="flex bg-slate-600 p-4 text-white">
      <Image
        src={"/next.svg"}
        alt={"FinTrack Logo"}
        width={50}
        height={50}
      ></Image>
      <h1 className="ml-4 flex-grow text-3xl">FinTrack</h1>
      <nav>
        {session?.user ? (
          <>
            <Link className="mx-2" href="/home">
              Home
            </Link>
            <Link className="mx-2" href="/viewBoards">
              My Boards
            </Link>
            <Link className="mx-2" href="/api/auth/signout">
              <button className="rounded-md bg-white px-3 py-1 text-black">
                Logout
              </button>
            </Link>
          </>
        ) : (
          <>
            <Link className="mx-2" href="/api/auth/signin">
              <button className="rounded-md bg-white px-3 py-1 text-black">
                Login
              </button>
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
