"use client";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { follow, unfollow } from "./actions";

type ProfileData = {
  followersCount: number;
  followingCount: number;
  questionsCount: number;
  isFollowing: boolean;
};

export default function ({
  loggedUser,
  user,
  initialProfileData,
}: {
  loggedUser?: any;
  user: any;
  initialProfileData: ProfileData;
}) {
  const [profileData, setProfileData] =
    useState<ProfileData>(initialProfileData);
  const isLoggedUser = loggedUser?.id === user.id;

  return (
    <>
      <Toaster position="top-center" />
      <div className="flex text-stone-700 dark:text-stone-300">
        <p className="pr-2 ">{`${profileData.questionsCount} Questions`}</p>
        <p className="px-2 ">{`${profileData.followersCount} Followers`}</p>
        <p className="pl-2 ">{`${profileData.followingCount} Following`}</p>
      </div>
      {!!loggedUser && !isLoggedUser && (
        <button
          onClick={async () => {
            const followerId = loggedUser?.id;
            const followingId = user.id;
            if (!followerId || !followingId)
              return toast.error("An error occurred");

            try {
              if (profileData.isFollowing) {
                await unfollow({ followerId, followingId });
                setProfileData((data) => ({
                  ...data,
                  isFollowing: false,
                  followersCount: data.followersCount - 1,
                }));
                return;
              }
              await follow({ followerId, followingId });
              setProfileData((data) => ({
                ...data,
                isFollowing: true,
                followersCount: data.followersCount + 1,
              }));
            } catch (error) {
              console.log(error);
              toast.error("An error occurred");
            }
          }}
          className="mt-2 hover:bg-stone-300 dark:hover:bg-stone-600
             bg-white dark:bg-stone-700 py-2 px-4 rounded-full 
             border dark:border-stone-600 border-stone-300"
        >
          {profileData.isFollowing ? "Unfollow" : "Follow"}
        </button>
      )}
    </>
  );
}
