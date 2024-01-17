import prisma from "@/prismaclient";
import { clerkClient, currentUser } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/server";

type Notification = {
  user?: User;
  createdAt: Date;
  type: "follow" | "post";
};

export default async function getNotifications(): Promise<Notification[]> {
  const skip = 0;
  const user = await currentUser();
  if (!user) throw new Error("User not found");
  const follows = await prisma.follow.findMany({
    where: { followingId: user.id },
  });
  const followersIds = follows.map((f) => f.followerId);

  const posts = await prisma.question.findMany({
    where: { addresseeId: user.id },
  });

  const notificationsUsers = await clerkClient.users.getUserList({
    userId: followersIds,
  });

  const followNotifications: Notification[] = follows.map((f) => {
    const user = notificationsUsers.find((u) => u.id === f.followerId) as User;
    return {
      type: "follow",
      createdAt: f.createdAt,
      user,
    };
  });

  const postNotifications: Notification[] = posts.map((p) => {
    return {
      type: "post",
      createdAt: p.createdAt,
    };
  });

  return [...followNotifications, ...postNotifications]
    .sort((a, b) => {
      if (a.createdAt > b.createdAt) return -1;
      if (a.createdAt < b.createdAt) return 1;
      return 0;
    })
    .splice(skip, 10);
}
