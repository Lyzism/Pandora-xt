import { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useTransparencyStore } from "@/stores/useTransparencyStore";

const Settings = () => {
  const { transparency, setTransparency } = useTransparencyStore();

  const handleTransparencyChange = (value: number[]) => {
    const roundedValue = Math.round(value[0]);
    setTransparency(roundedValue, true);
  };
  
  useEffect(() => {
    const updateTransparency = (newTransparency: unknown) => {
      if (typeof newTransparency === "number") {
        setTransparency(Math.round(newTransparency), false);
      }
    };
  
    window.electronAPI.receive("update-transparency", updateTransparency);
  
    return () => {
      window.electronAPI.receive("update-transparency", () => {});
    };
  }, [setTransparency]);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Settings</h2>
      {/* <div className="space-y-2">
        <Label htmlFor="theme">Theme</Label>
        <select id="theme" className="w-full p-2 border rounded-md">
          <option>Light</option>
          <option>Dark</option>
          <option>System</option>
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="language">Language</Label>
        <select id="language" className="w-full p-2 border rounded-md">
          <option>English</option>
          <option>Spanish</option>
          <option>French</option>
          <option>Bahasa Indonesia</option>
        </select>
      </div> */}
      <div className="space-y-2">
        <Label htmlFor="transparency">Transparency ({transparency}%)</Label>
        <Slider
          defaultValue={[transparency]}
          value={[transparency]}
          max={100}
          step={1}
          onValueChange={handleTransparencyChange}
          className="mt-2"
        />
      </div>
      <Button className="w-full">Save Settings</Button>
    </div>
  );
};

export default Settings;