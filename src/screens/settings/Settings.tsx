/* eslint-disable @typescript-eslint/no-explicit-any */
import AvatarList from "@/components/avatar-list";
import SubmitButton from "@/components/buttons/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { apiService } from "@/lib/apiService";
import { getUser } from "@/lib/utils";
import { useEffect, useState } from "react";

const Settings = () => {
  const user = getUser();
  const [selectedAvatar, setSelectedAvatar] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    console.log(user);
    if (user) {
      setSelectedAvatar(user?.avatar);
    }
  }, []);

  const handleSaveInfo = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await apiService.patch(`/users/${user?.userId}`, {
        avatar: selectedAvatar,
      });
      localStorage.setItem("user", JSON.stringify(response.user));
      toast({
        title: "Settings saved",
        description: "Your settings have been saved",
      });
    } catch (error) {
      console.error(`Error in handleSaveInfo: ${error}`);
      toast({
        title: "Failed to save settings",
        description: "Please try again later",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="p-4 flex  flex-col items-center w-full">
      <form className="flex flex-col gap-4" onSubmit={handleSaveInfo}>
        <Label className="text-xl font-bold text-center mx-auto flex justify-center">
          Settings
        </Label>
        <div className="my-4 flex flex-col gap-2 items-start">
          <Label className="text-muted-foreground font-light">Username</Label>
          <Input value={user?.username} disabled />
        </div>
        <div className="my-4 flex flex-col gap-2">
          <Label className="text-muted-foreground font-light">Avatar</Label>
          <AvatarList
            setSelected={setSelectedAvatar}
            selected={selectedAvatar}
          />
        </div>
        <div className="my-4 flex  gap-2 justify-center">
          <SubmitButton className="w-1/2" loading={loading}>
            Save
          </SubmitButton>
        </div>
      </form>
    </div>
  );
};

export default Settings;
