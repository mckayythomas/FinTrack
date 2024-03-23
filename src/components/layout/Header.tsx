import Image from "next/image";
import Link from "next/link";
import { auth } from "@/infrastructure/auth/nextAuth";

export default async function Header() {
  const session = await auth();

  return (
    <header className="flex bg-slate-600 p-4">
      <Image
        src={"/next.svg"}
        alt={"FinTrack Logo"}
        width={50}
        height={50}
      ></Image>
      <h1 className="ml-4 flex-grow text-3xl">FinTrack</h1>
      <nav className="mx-4">
        {session?.user ? (
          <>
            <Link className="mx-4" href="/home">
              Home
            </Link>
            <Link className="mx-4" href="/boards">
              My Boards
            </Link>
            <Link className="mx-4" href="account">
              My Account
            </Link>
            <Link className="mx-4" href="/api/auth/signout">
              <button className="rounded-md bg-white px-3 py-1">Logout</button>
            </Link>
          </>
        ) : (
          <>
            <Link className="mx-4" href="/api/auth/signin">
              <button className="rounded-md bg-white px-3 py-1">Login</button>
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
