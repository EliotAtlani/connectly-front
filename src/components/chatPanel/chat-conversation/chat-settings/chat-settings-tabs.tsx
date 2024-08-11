import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface ChatSettingsTabsProps {
  tabs: string;
  setTabs: (tabs: string) => void;
}
const ChatSettingsTabs = ({ tabs, setTabs }: ChatSettingsTabsProps) => {
  const settingTabs = [
    {
      name: "settings",
      label: "Settings",
    },
    {
      name: "medias",
      label: "Medias",
    },
    {
      name: "background",
      label: "Background",
    },
    {
      name: "members",
      label: "Members",
    },
  ];
  return (
    <div className="h-full w-1/4 border-r-[1px] border-border">
      <div className="px-2 py-6">
        <DialogHeader className="px-4">
          <DialogTitle>Chat settings</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-8">
          {settingTabs.map((tab) => (
            <Label
              key={tab.name}
              className={cn(
                "w-full py-2 px-4 rounded-sm cursor-pointer hover:bg-muted transition-all duration-300",
                tabs === tab.name && "bg-muted"
              )}
              onClick={() => setTabs(tab.name)}
            >
              {tab.label}
            </Label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatSettingsTabs;
