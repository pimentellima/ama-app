import Searchbox from "./searchbox";

export default function () {
  return (
    <div className="flex justify-center my-3">
      <div
        className="w-[750px] flex flex-col p-3 
  bg-stone-700 rounded-md shadow-sm"
      >
        <Searchbox />
      </div>
    </div>
  );
}
