import getUsers from "@/app/utils/getUsers";
import Searchbox from "./searchbox";

export default function () {
  return (
    <div className="flex justify-center">
      <div className="w-[750px]">
        <Searchbox getUsers={getUsers} />
      </div>
    </div>
  );
}
