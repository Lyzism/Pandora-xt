import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

const Settings = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Settings</h2>
      <div className="space-y-2">
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
      </div>
      <div className="space-y-2">
        <Label htmlFor="transparency">Transparency</Label>
        <Slider defaultValue={[100]} max={100} step={1} className="mt-2" />
      </div>
      <Button className="w-full">Save Settings</Button>
    </div>
  );
};

export default Settings;