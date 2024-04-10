import AddNewBoardButton from "@/components/boards/creation/NewBoardButton";
import OwnedBoards from "@/components/boards/data/OwnedBoards";
import SharedBoards from "@/components/boards/data/SharedBoards";

export default function ViewBoards() {
  return (
    <>
      <div className="my-8 flex justify-between">
        <h2 className="text-2xl font-bold underline">My Boards</h2>
        <AddNewBoardButton />
      </div>
      <OwnedBoards />

      <div className="my-8">
        <h2 className="text-2xl font-bold underline">Shared With Me</h2>
      </div>
      <SharedBoards />
    </>
  );
}
