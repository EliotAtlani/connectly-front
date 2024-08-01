import { Label } from "@/components/ui/label";

const Home = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Label className="text-2xl">Hello 👋</Label>
        <Label className="text-muted-foreground font-light">
          {" "}
          Select a conversation to start
        </Label>
      </div>
    </div>
  );
};

export default Home;
