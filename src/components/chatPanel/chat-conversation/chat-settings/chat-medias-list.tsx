import { DialogTitle } from "@/components/ui/dialog";
import { apiService } from "@/lib/apiService";
import { ConversationType, Message } from "@/lib/types";
import { useEffect, useState } from "react";
import HashLoader from "react-spinners/HashLoader";

import ImageShow from "./image-show";

const ChatMediasList = ({ chatData }: { chatData: ConversationType }) => {
  const [medias, setMedias] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchMedias() {
      try {
        const response = await apiService.get(`/medias/${chatData.id}`);
        setMedias(response);
      } catch (error) {
        console.error(`Error in fetchMedias: ${error}`);
      } finally {
        setLoading(false);
      }
    }
    fetchMedias();
  }, []);
  return (
    <div className="p-6 w-3/4 h-[500px]">
      <DialogTitle> Medias list</DialogTitle>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <HashLoader color="#7c3aed" size={35} />
        </div>
      ) : medias?.length === 0 ? (
        <div className="flex justify-center items-center h-32">
          <p className="text-muted-foreground">No medias found</p>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2  h-[440px] mt-4 overflow-hidden overflow-y-auto">
          {medias?.map((media, index) => (
            <div key={index} className="flex items-center gap-4">
              <ImageShow content={media.content} width={"w-24"} height="h-24" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatMediasList;
