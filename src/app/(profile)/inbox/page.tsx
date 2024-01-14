import { fetchQuestions } from "@/app/actions";
import { currentUser } from "@clerk/nextjs";
import Questions from "../../../components/questions";

export default async function () {
  const user = await currentUser();

  if (!user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  const questions = await fetchQuestions(user.id);
  if (!questions) {
    return (
      <div className="w-[600px] text-center">
        An error occurred while loading questions
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <div className="w-[750px]">
        <div className="text-center rounded-md bg-stone-700 shadow-sm py-4">
          <p>Share your profile</p>
          <p className="text-lg text-red-700">{`${process.env.NEXT_PUBLIC_BASE_URL}/${user.username}`}</p>
        </div>
        <div className="my-3">
          {questions.length === 0 ? (
            <p className="text-center">Your questions will appear here</p>
          ) : (
            <Questions
              isCurrentUser={true}
              userImageUrl={user.imageUrl}
              userUsername={user.username as string}
              initialQuestions={questions}
            />
          )}
        </div>
      </div>
    </div>
  );
}
