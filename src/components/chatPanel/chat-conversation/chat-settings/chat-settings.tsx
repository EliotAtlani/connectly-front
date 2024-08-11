import { ConversationType } from "@/lib/types";

import { useState } from "react";

import ChatSettingsTabs from "./chat-settings-tabs";
import ChatBasicSettings from "./chat-basic-settings";
import ChatMediasList from "./chat-medias-list";
import ChatBackgroundImages from "./chat-background-images";
import ChatSettingsMembers from "./chat-settings-members";
interface ChatSettingsProps {
  chatData: ConversationType;
  getChatData: () => Promise<void>;
  tab: string;
}

const ChatSettings = ({ chatData, getChatData, tab }: ChatSettingsProps) => {
  const [tabs, setTabs] = useState<string>(tab);

  return (
    <div className="flex w-full ">
      <ChatSettingsTabs tabs={tabs} setTabs={setTabs} />
      {tabs === "settings" && (
        <ChatBasicSettings chatData={chatData} getChatData={getChatData} />
      )}
      {tabs === "medias" && <ChatMediasList chatData={chatData} />}
      {tabs === "background" && (
        <ChatBackgroundImages chatData={chatData} getChatData={getChatData} />
      )}
      {tabs === "members" && <ChatSettingsMembers chatData={chatData} />}
    </div>
  );
};

export default ChatSettings;
