"use client";
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
          <div className="flex xl:flex-row flex-col">
            <span className="hover:underline">{user.username}</span>
            {user.isFollowing && (
              <div className="flex xl:ml-3 mt-1">
                <p
                  className="text-xs bg-white dark:bg-stone-700 rounded-full 
                    border dark:border-stone-600 border-stone-300 px-1
                    flex justify-center items-center text-stone-700 dark:text-stone-300"
                >
                  You follow
                </p>
              </div>
            )}
          </div>
        </Link>
        <Link
          className="dark:hover:bg-stone-600 
          hover:bg-stone-300 bg-white dark:bg-stone-700 
            py-2 px-4 rounded-full"
          href={`/${user.username}`}
        >
          See profile
        </Link>
      </div>
    ))
  );
}

export default function ({
  getUsers,
}: {
  getUsers: ({
    skip,
    search,
  }: {
    skip: number;
    search: string;
  }) => Promise<any[] | undefined>;
}) {
  const [search, setSearch] = useState<string>("");
  const [result, setResult] = useState<any[] | null>(null);
  const [loading, setLoading] = useState<"error" | "success" | "loading">(
    "success"
  );

  const handleSearch = async () => {
    setLoading("loading");
    try {
      const users = await getUsers({ search, skip: 0 });
      setLoading("success");
      setResult(users || []);
      return;
    } catch (error) {
      setLoading("error");
    }
  };

  return (
    <div
      className="flex flex-col gap-2 rounded-md shadow-sm 
    bg-white dark:bg-stone-700 p-4"
    >
      <label htmlFor="search">Search for users</label>
      <form className="flex gap-2">
        <input
          name="search"
          placeholder="Type a username"
          value={search}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 bg-stone-200 dark:bg-stone-600 focus:outline-none rounded-md
          placeholder:text-stone-400 w-full"
        />
        <button
          type="button"
          onClick={handleSearch}
          className="hover:bg-stone-300 dark:hover:bg-stone-600
            py-2 px-4 rounded-md"
        >
          Search
        </button>
      </form>
      <UserList users={result} loading={loading} />
    </div>
  );
}
