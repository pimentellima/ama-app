import getNotifications from "@/app/utils/getNotifications";
import { currentUser } from "@clerk/nextjs";
import moment from "moment";
import { unstable_noStore } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function () {
  unstable_noStore();
  const user = await currentUser();
  if (!user) {
    return redirect("/");
  }
  const notifications = await getNotifications();
  if (!notifications) return <p className="text-center">An error occured</p>;

  return (
    <div className="p-3 bg-white dark:bg-stone-700 rounded-md shadow-sm">
      {notifications.length === 0 ? (
        <p className="text-center">You have 0 notifications</p>
      ) : (
        <div className="flex flex-col gap-3">
          {notifications.map((notification, index) => {
            return (
              <div
                key={index}
                className="flex justify-between p-3 
                bg-stone-200 dark:bg-stone-800 rounded-md shadow-sm"
              >
                {notification.type === "follow" && !!notification.user && (
                  <div className="flex items-center">
                    <Link
                      href={`/${notification.user.username}`}
                      className="flex gap-1 items-center"
                    >
                      <Image
                        alt=""
                        height={150}
                        width={150}
                        src={notification.user.imageUrl}
                        className="h-16 w-16 rounded-full"
                      />
                      <div className="ml-1 flex gap-1 xl:flex-row flex-col">
                        <p className="font-semibold hover:underline">
                          {notification.user.username}
                        </p>
                        <p className="hover:underline">followed you</p>
                      </div>
                    </Link>
                  </div>
                )}
                {notification.type === "post" && (
                  <Link href={`/inbox`} className="hover:underline">
                    Someone asked you a question 🙀
                  </Link>
                )}
                <div className="flex items-center"></div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {
                    <p className="text-xs text-stone-400">{`${moment(
                      notification.createdAt
                    ).fromNow(true)} ago`}</p>
                  }
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
