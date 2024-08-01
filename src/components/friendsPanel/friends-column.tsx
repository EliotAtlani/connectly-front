import FriendsHeader from "./friends-header";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FriendsList from "./friends-list";
import FriendsRequest from "./friends-request";

const FriendsColumn = () => {
  return (
    <div className="p-4 w-full h-full">
      <FriendsHeader />
      <Tabs defaultValue="list" className="w-full my-4">
        <TabsList>
          <TabsTrigger value="list">My friends</TabsTrigger>
          <TabsTrigger value="request">Request</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <FriendsList />
        </TabsContent>
        <TabsContent value="request">
          <FriendsRequest />{" "}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FriendsColumn;
