/* eslint-disable @typescript-eslint/no-explicit-any */
import SubmitButton from "@/components/buttons/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { apiService } from "@/lib/apiService";
import { getUser } from "@/lib/utils";
import { useState } from "react";

const AddFriend = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const user = getUser();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const body = {
        userId: user?.userId,
        friendUsername: e.target.username.value,
      };

      const response = await apiService.post("/users/add-friend", body);
      console.log("Adding friend", response);
      toast({
        title: "Request send successfully",
      });
    } catch (error) {
      console.error("Error adding friend:", error);
      toast({
        title: "Failed to add friend",
        description: "User not found",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="px-8 py-4 w-full">
      <div className="flex flex-col gap-2">
        <Label className="text-xl font-bold">Add a friend</Label>
        <Label className="font-light text-muted-foreground ">
          Type your friend's username to add him
        </Label>
      </div>
      <form className="pt-8" onSubmit={handleSubmit}>
        <Input placeholder="Enter a username" required name="username" />
        <div className="flex justify-end">
          <SubmitButton className="mt-4 " loading={loading}>
            Add friend
          </SubmitButton>
        </div>
      </form>
    </div>
  );
};

export default AddFriend;
