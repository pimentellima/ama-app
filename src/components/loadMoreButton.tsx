export default function ({
  loading,
  handleLoadMore,
}: {
  loading: "success" | "error" | "loading";
  handleLoadMore: () => Promise<void>;
}) {
  return (
    <button
      onClick={handleLoadMore}
      className="hover:bg-stone-300 dark:hover:bg-stone-600
     bg-white dark:bg-stone-700 py-2 px-4 rounded-full"
    >
      {loading === "success" && "Load more"}
      {loading === "error" && "Error while loading. Try again"}
    </button>
  );
}
