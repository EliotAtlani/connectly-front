import LogoutButton from "@/components/auth/LogoutButton";
import { useNavigate } from "react-router-dom";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import AvatarList from "@/components/avatar-list";
import { Separator } from "@/components/ui/separator";
import SubmitButton from "@/components/buttons/submit-button";
import { useState } from "react";
import { saveOnBoardedUser } from "@/api/userApi";
import { useToast } from "@/components/ui/use-toast";
import { getUser, updateUser } from "@/lib/utils";

const OnBoarding = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<number>(0);
  const { toast } = useToast();
  const user = getUser();

  if (!user) {
    navigate("/");
    return null;
  }
  if (user.isOnBoarded) {
    navigate("/home");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        userId: user.userId,
        image: selectedAvatar,
        username: e.currentTarget.username.value,
      };
      const response = await saveOnBoardedUser(data);

      updateUser(response.user);
      navigate("/home");
    } catch (error) {
      const msgError =
        error instanceof Error
          ? error.message
          : "Error setting up user information";
      toast({
        title: msgError,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex items-center relative flex-col gap-4 pt-10">
      <div className="absolute top-4 left-4"></div>
      <div className="flex flex-col gap-4 items-center">
        <Label className="text-5xl font-bold  mb-2">
          {" "}
          Welcome to Connectly!
        </Label>
        <Label className="text-xl font-light  mb-2 text-muted-foreground">
          Let's setup your profil information
        </Label>
      </div>

      <Separator className="w-2/3 my-8" />
      <form className="w-1/4" onSubmit={handleSubmit}>
        <div className="grid w-full items-center gap-8">
          <div className="flex flex-col space-y-4">
            <Label htmlFor="name">Username</Label>
            <Input id="name" name="username" placeholder="johndoe" required />
          </div>
          <div className="flex flex-col space-y-4">
            <Label htmlFor="framework">Select an avatar</Label>
            <AvatarList
              setSelected={setSelectedAvatar}
              selected={selectedAvatar}
            />
          </div>
        </div>
        <div className="flex justify-between items-center mt-8">
          <LogoutButton variant="secondary" />

          <SubmitButton loading={loading} className="">
            Save information
          </SubmitButton>
        </div>
      </form>
    </div>
  );
};

export default OnBoarding;
