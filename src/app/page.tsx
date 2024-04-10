import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex h-[100%] flex-col">
      <h1 className="text-center text-2xl font-bold">Welcome to FinTrack!</h1>
      <h2 className="text-center text-2xl font-bold">
        The future of finance tracking
      </h2>

      <p className="m-4 h-28 bg-slate-600 p-4 text-center text-xl text-white">
        FinTrack aims to make your finance tracking easier. Track personally, in
        a group, however you need!
      </p>

      <Link
        className="m-20 rounded-md bg-slate-600 px-3 py-2 text-center font-bold text-white"
        href={"/api/auth/signin"}
      >
        Get Started!
      </Link>
    </div>
  );
}
