"use client";
import { ArrowRightIcon } from "@heroicons/react/16/solid";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";

function UserList({
  users,
  loading,
}: {
  users: any[] | null;
  loading: "error" | "success" | "loading";
}) {
  if (loading === "loading")
    return (
      <div className="flex w-full justify-center items-center">
        <ClipLoader color="white" className="h-6 w-6" />
      </div>
    );
  if (loading === "error")
    return (
      <div className="flex w-full justify-center items-center">
        An error occurred while loading users
      </div>
    );
  return users?.length === 0 ? (
    <div>No users found</div>
  ) : (
    users?.map((user) => (
      <div className="py-1 flex justify-between items-center">
        <Link href={`/${user.username}`} className="flex gap-2 items-center">
          <Image
            alt=""
            height={150}
            width={150}
            src={user.imageUrl}
            className="h-16 w-16 rounded-full"
          />
          <span className="hover:underline">{user.username}</span>
        </Link>
        <Link
          className="hover:bg-stone-600 bg-stone-700 
            py-2 px-4 rounded-full"
          href={`/${user.username}`}
        >
          See profile
        </Link>
      </div>
    ))
  );
}

export default function () {
  const [search, setSearch] = useState<string>("");
  const [result, setResult] = useState<any[] | null>(null);
  const [loading, setLoading] = useState<"error" | "success" | "loading">(
    "success"
  );

  const handleSearch = async () => {
    setLoading("loading");
    try {
      const res = await fetch(`api/users?username=${search}`);
      if (!res.ok) {
        setLoading("error");
      }
      const users = await res.json();
      setLoading("success");
      setResult(users);
      return;
    } catch (error) {
      setLoading("error");
    }
  };

  return (
    <div className="flex flex-col gap-2 rounded-md shadow-sm bg-stone-700 p-3">
      <label htmlFor="search">Search for users</label>
      <div className="flex gap-2">
        <input
          name="search"
          placeholder="Type a username"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 bg-stone-600 focus:outline-none rounded-md
          placeholder:text-stone-400 w-full"
        />
        <button
          onClick={handleSearch}
          className="hover:bg-stone-600 bg-stone-700 
            py-2 px-4 rounded-full"
        >
          Search
        </button>
      </div>

      <UserList users={result} loading={loading} />
    </div>
  );
}
