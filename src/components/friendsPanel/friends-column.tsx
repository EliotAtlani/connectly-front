import FriendsHeader from "./friends-header";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FriendsList from "./friends-list";
import FriendsRequest from "./friends-request";
import { cn } from "@/lib/utils";
import { useFriendRequest } from "@/lib/providers/friendRequestProvider";

const FriendsColumn = () => {
  const { numberFriendRequest } = useFriendRequest();

  return (
    <div className="p-4 w-full h-full">
      <FriendsHeader />
      <Tabs defaultValue="list" className="w-full my-4">
        <TabsList>
          <TabsTrigger value="list">My friends</TabsTrigger>
          <TabsTrigger
            value="request"
            className={cn("relative", numberFriendRequest > 0 ? "mr-2" : "")}
          >
            Request
            {numberFriendRequest > 0 && (
              <div className="absolute top-0 right-[-7px] text-xs bg-primary text-white rounded-full w-4 h-4">
                {" "}
                {numberFriendRequest > 0 ? numberFriendRequest : ""}
              </div>
            )}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <FriendsList />
        </TabsContent>
        <TabsContent value="request">
          <FriendsRequest />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FriendsColumn;
