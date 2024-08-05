import { DialogTitle } from "@/components/ui/dialog";
import { apiService } from "@/lib/apiService";
import { ConversationType, Message } from "@/lib/types";
import React, { useEffect, useState } from "react";
import HashLoader from "react-spinners/HashLoader";

const ChatMediasList = ({ chatData }: { chatData: ConversationType }) => {
  const [medias, setMedias] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchMedias() {
      try {
        const response = await apiService.get(`/medias/${chatData.id}`);
        console.log(response);
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
    <>
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
        <div className="grid grid-cols-4 gap-5 max-h-[500px] overflow-hidden overflow-y-auto">
          {medias?.map((media, index) => (
            <div key={index} className="flex items-center gap-4">
              <img
                src={media.content}
                alt="media"
                className="w-20 h-20 rounded-md"
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default ChatMediasList;
