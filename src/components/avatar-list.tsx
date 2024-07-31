import ImageSelected from "./buttons/image-selected";
import { avatarList } from "@/data/avatar-list";

interface AvatarListProps {
  selected: number;
  setSelected: (index: number) => void;
}

const AvatarList = ({ selected, setSelected }: AvatarListProps) => {
  return (
    <div className="grid lg:grid-cols-5 md:grid-cols-4 grid-cols-2 gap-4 ">
      {avatarList.map((avatar, index) => (
        <div
          key={index}
          onClick={() => setSelected(index)}
          className="rounded-full"
        >
          <ImageSelected
            href={avatar}
            alt={`avatar-${index}`}
            selected={selected == index}
          />
        </div>
      ))}
    </div>
  );
};

export default AvatarList;
