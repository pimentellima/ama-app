import getUsers from "@/app/utils/getUsers";
import Searchbox from "./searchbox";

export default function () {
  return <Searchbox getUsers={getUsers} />;
}
