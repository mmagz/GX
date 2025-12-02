import { User, Key, Bell, Shield, Moon, Sun } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useTheme } from "../contexts/ThemeContext";
import { mockAdminUser } from "../utils/mockData";
import { toast } from "sonner@2.0.3";

export function Settings() {
  const { theme, toggleTheme } = useTheme();

  const handleSaveProfile = () => {
    toast.success('Profile settings saved successfully');
  };

  const handleSaveNotifications = () => {
    toast.success('Notification preferences updated');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-[#262930] dark:text-white">System Settings</h2>
        <p className="text-sm text-[#404040] dark:text-gray-400 mt-1">
          Manage your account and application settings
        </p>
      </div>

      {/* Admin Profile */}
      <Card className="border-0 shadow-sm bg-white dark:bg-[#1a1a1a]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#262930] dark:text-white">
            <User className="w-5 h-5 text-[#A00000]" />
            Admin Profile
          </CardTitle>
          <CardDescription>
            Manage your personal information via Clerk
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={mockAdminUser.imageUrl} alt={mockAdminUser.firstName} />
              <AvatarFallback>{mockAdminUser.firstName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <Button variant="outline" onClick={() => toast.info('Profile image update via Clerk dashboard')}>
                Change Photo
              </Button>
              <p className="text-xs text-[#404040] dark:text-gray-400 mt-2">
                Managed through Clerk authentication
              </p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input 
                id="firstName" 
                defaultValue={mockAdminUser.firstName}
                disabled
              />
              <p className="text-xs text-[#404040] dark:text-gray-400">
                Edit via Clerk dashboard
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input 
                id="lastName" 
                defaultValue={mockAdminUser.lastName}
                disabled
              />
              <p className="text-xs text-[#404040] dark:text-gray-400">
                Edit via Clerk dashboard
              </p>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email"
                defaultValue={mockAdminUser.email}
                disabled
              />
              <p className="text-xs text-[#404040] dark:text-gray-400">
                Email managed by Clerk authentication
              </p>
            </div>
          </div>

          <Button onClick={() => toast.info('Redirecting to Clerk dashboard...')} className="bg-[#A00000] hover:bg-[#800000]">
            Open Clerk Dashboard
          </Button>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card className="border-0 shadow-sm bg-white dark:bg-[#1a1a1a]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#262930] dark:text-white">
            {theme === 'light' ? <Sun className="w-5 h-5 text-[#CC5500]" /> : <Moon className="w-5 h-5 text-[#CC5500]" />}
            Appearance
          </CardTitle>
          <CardDescription>
            Customize the look and feel of the dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#262930] dark:text-white">Dark Mode</p>
              <p className="text-xs text-[#404040] dark:text-gray-400 mt-1">
                Toggle between light and dark themes
              </p>
            </div>
            <Switch 
              checked={theme === 'dark'} 
              onCheckedChange={toggleTheme}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="border-0 shadow-sm bg-white dark:bg-[#1a1a1a]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#262930] dark:text-white">
            <Bell className="w-5 h-5 text-[#404040]" />
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Choose what notifications you want to receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#262930] dark:text-white">New User Registrations</p>
              <p className="text-xs text-[#404040] dark:text-gray-400 mt-1">
                Get notified when new users join
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#262930] dark:text-white">Content Submissions</p>
              <p className="text-xs text-[#404040] dark:text-gray-400 mt-1">
                Alert when content is submitted for review
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#262930] dark:text-white">Media Uploads</p>
              <p className="text-xs text-[#404040] dark:text-gray-400 mt-1">
                Notify on new Cloudinary uploads
              </p>
            </div>
            <Switch />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#262930] dark:text-white">System Updates</p>
              <p className="text-xs text-[#404040] dark:text-gray-400 mt-1">
                Important system and security updates
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <Button onClick={handleSaveNotifications} className="mt-4">
            Save Preferences
          </Button>
        </CardContent>
      </Card>

      {/* API Configuration */}
      <Card className="border-0 shadow-sm bg-white dark:bg-[#1a1a1a]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#262930] dark:text-white">
            <Key className="w-5 h-5 text-[#262930]" />
            API Configuration
          </CardTitle>
          <CardDescription>
            View API keys and configuration (edit via environment variables)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Clerk Publishable Key</Label>
            <Input 
              value="pk_test_••••••••••••••••••••••••••"
              disabled
            />
            <p className="text-xs text-[#404040] dark:text-gray-400">
              Configured in environment variables
            </p>
          </div>
          <div className="space-y-2">
            <Label>Cloudinary Cloud Name</Label>
            <Input 
              value="your-cloud-name"
              disabled
            />
            <p className="text-xs text-[#404040] dark:text-gray-400">
              Set in .env file
            </p>
          </div>
          <div className="space-y-2">
            <Label>MongoDB Connection String</Label>
            <Input 
              value="mongodb+srv://••••••••••••••••••••"
              type="password"
              disabled
            />
            <p className="text-xs text-[#404040] dark:text-gray-400">
              Configured in backend environment
            </p>
          </div>

          <div className="bg-[#EAE7E2] dark:bg-[#262930] p-4 rounded-lg mt-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-[#CC5500] mt-0.5" />
              <div>
                <p className="text-sm text-[#262930] dark:text-white">Security Note</p>
                <p className="text-xs text-[#404040] dark:text-gray-400 mt-1">
                  API keys and sensitive configuration should be managed through environment 
                  variables and never exposed in the client code. Update these values in your 
                  .env file and restart the application.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
