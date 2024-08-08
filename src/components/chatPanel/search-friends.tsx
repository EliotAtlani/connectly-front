import React from "react";
import { Input } from "../ui/input";
import { Friends } from "@/lib/types";
import { cn } from "@/lib/utils";

const SearchFriends = ({
  setFilterFriends,
  friends,
  className,
}: {
  setFilterFriends: React.Dispatch<React.SetStateAction<Friends[]>>;
  friends: Friends[];
  className?: string;
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    const filteredFriends = friends.filter((friend) =>
      friend.username.toLowerCase().includes(value.toLowerCase())
    );

    setFilterFriends(filteredFriends);
  };

  return (
    <div className={cn("", className)}>
      <Input
        placeholder="Search friends"
        className="rounded-full"
        onChange={handleChange}
      />
    </div>
  );
};

export default SearchFriends;
