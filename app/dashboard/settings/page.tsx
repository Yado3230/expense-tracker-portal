"use client";
import React from "react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import {
  Check,
  Lock,
  Moon,
  Save,
  Settings,
  Sun,
  Bell,
  UserCog,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "CAD", symbol: "$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "$", name: "Australian Dollar" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
];

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "ja", name: "Japanese" },
  { code: "zh", name: "Chinese" },
  { code: "ar", name: "Arabic" },
];

const DATE_FORMATS = [
  { value: "MM/DD/YYYY", label: "MM/DD/YYYY (US)" },
  { value: "DD/MM/YYYY", label: "DD/MM/YYYY (EU)" },
  { value: "YYYY-MM-DD", label: "YYYY-MM-DD (ISO)" },
];

const SettingsPage = () => {
  const { theme, setTheme } = useTheme();
  const [isLoading, setIsLoading] = React.useState(false);

  // Personal preferences state
  const [preferences, setPreferences] = React.useState({
    currency: "USD",
    language: "en",
    dateFormat: "MM/DD/YYYY",
    weekStart: "sunday",
  });

  // Appearance settings state
  const [appearance, setAppearance] = React.useState({
    theme: theme || "system",
    fontSize: "medium",
    reducedMotion: false,
    sidebarCompact: false,
  });

  // Notification settings state
  const [notifications, setNotifications] = React.useState({
    emailSummary: true,
    expenseAlerts: true,
    budgetWarnings: true,
    receiptReminders: false,
    marketingEmails: false,
  });

  // Security settings state
  const [security, setSecurity] = React.useState({
    twoFactorAuth: false,
    sessionTimeout: "30",
  });

  // Handle save for all settings
  const handleSaveSettings = () => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Apply theme changes immediately
      setTheme(appearance.theme);

      // Show success message
      toast.success("Settings saved successfully");
      setIsLoading(false);
    }, 800);
  };

  // Handle changes for different setting groups
  const handlePreferencesChange = (key: string, value: string | boolean) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  const handleAppearanceChange = (key: string, value: string | boolean) => {
    setAppearance((prev) => ({ ...prev, [key]: value }));

    // Apply theme change immediately for preview
    if (key === "theme") {
      setTheme(value as string);
    }
  };

  const handleNotificationsChange = (key: string, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [key]: value }));
  };

  const handleSecurityChange = (key: string, value: string | boolean) => {
    setSecurity((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-gray-500">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="appearance" className="w-full">
        <TabsList className="grid grid-cols-4 w-full mb-6">
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <UserCog className="h-4 w-4" />
            <span>Preferences</span>
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex items-center gap-2"
          >
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span>Security</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>
                Customize how the application looks and feels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium">Theme</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    Select the color theme for the application
                  </p>
                  <div className="grid grid-cols-3 gap-4">
                    <div
                      className={`relative flex flex-col items-center justify-center rounded-md border-2 p-4 cursor-pointer ${
                        appearance.theme === "light"
                          ? "border-blue-600"
                          : "border-gray-200 hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700"
                      }`}
                      onClick={() => handleAppearanceChange("theme", "light")}
                    >
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-100 dark:bg-sky-900">
                        <Sun className="h-7 w-7 text-yellow-500" />
                      </div>
                      <p className="mt-2 font-medium">Light</p>
                      {appearance.theme === "light" && (
                        <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white">
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                    </div>
                    <div
                      className={`relative flex flex-col items-center justify-center rounded-md border-2 p-4 cursor-pointer ${
                        appearance.theme === "dark"
                          ? "border-blue-600"
                          : "border-gray-200 hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700"
                      }`}
                      onClick={() => handleAppearanceChange("theme", "dark")}
                    >
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-900">
                        <Moon className="h-7 w-7 text-slate-200" />
                      </div>
                      <p className="mt-2 font-medium">Dark</p>
                      {appearance.theme === "dark" && (
                        <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white">
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                    </div>
                    <div
                      className={`relative flex flex-col items-center justify-center rounded-md border-2 p-4 cursor-pointer ${
                        appearance.theme === "system"
                          ? "border-blue-600"
                          : "border-gray-200 hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700"
                      }`}
                      onClick={() => handleAppearanceChange("theme", "system")}
                    >
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-sky-100 to-slate-900">
                        <div className="flex">
                          <Sun className="h-5 w-5 text-yellow-500" />
                          <Moon className="h-5 w-5 -ml-1 text-slate-200" />
                        </div>
                      </div>
                      <p className="mt-2 font-medium">System</p>
                      {appearance.theme === "system" && (
                        <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white">
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Reduced Motion</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Reduce animations and transitions
                      </p>
                    </div>
                    <Switch
                      checked={appearance.reducedMotion}
                      onCheckedChange={(checked) =>
                        handleAppearanceChange("reducedMotion", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Compact Sidebar</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Use a more compact sidebar layout
                      </p>
                    </div>
                    <Switch
                      checked={appearance.sidebarCompact}
                      onCheckedChange={(checked) =>
                        handleAppearanceChange("sidebarCompact", checked)
                      }
                    />
                  </div>
                </div>

                <Separator className="my-4" />

                <div>
                  <Label className="text-base" htmlFor="fontSize">
                    Font Size
                  </Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    Adjust the size of text throughout the application
                  </p>
                  <Select
                    value={appearance.fontSize}
                    onValueChange={(value) =>
                      handleAppearanceChange("fontSize", value)
                    }
                  >
                    <SelectTrigger className="w-full sm:w-[240px]">
                      <SelectValue placeholder="Select font size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium (Default)</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button
                onClick={handleSaveSettings}
                disabled={isLoading}
                className="ml-auto"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <span className="h-4 w-4 animate-spin mr-2 border-2 border-current border-t-transparent rounded-full" />
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </span>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>
                Configure your regional and display preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-base" htmlFor="currency">
                    Currency
                  </Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    Select your preferred currency for transactions
                  </p>
                  <Select
                    value={preferences.currency}
                    onValueChange={(value) =>
                      handlePreferencesChange("currency", value)
                    }
                  >
                    <SelectTrigger className="w-full sm:w-[240px]">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          <div className="flex items-center">
                            <span className="mr-2">{currency.symbol}</span>
                            <span>
                              {currency.name} ({currency.code})
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator className="my-4" />

                <div>
                  <Label className="text-base" htmlFor="language">
                    Language
                  </Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    Choose your preferred display language
                  </p>
                  <Select
                    value={preferences.language}
                    onValueChange={(value) =>
                      handlePreferencesChange("language", value)
                    }
                  >
                    <SelectTrigger className="w-full sm:w-[240px]">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map((language) => (
                        <SelectItem key={language.code} value={language.code}>
                          {language.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator className="my-4" />

                <div>
                  <Label className="text-base" htmlFor="dateFormat">
                    Date Format
                  </Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    How dates should be displayed throughout the application
                  </p>
                  <Select
                    value={preferences.dateFormat}
                    onValueChange={(value) =>
                      handlePreferencesChange("dateFormat", value)
                    }
                  >
                    <SelectTrigger className="w-full sm:w-[240px]">
                      <SelectValue placeholder="Select date format" />
                    </SelectTrigger>
                    <SelectContent>
                      {DATE_FORMATS.map((format) => (
                        <SelectItem key={format.value} value={format.value}>
                          {format.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator className="my-4" />

                <div>
                  <Label className="text-base">Week Starts On</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    Choose which day your week begins
                  </p>
                  <RadioGroup
                    value={preferences.weekStart}
                    onValueChange={(value) =>
                      handlePreferencesChange("weekStart", value)
                    }
                    className="grid grid-cols-2 gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sunday" id="sunday" />
                      <Label htmlFor="sunday">Sunday</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="monday" id="monday" />
                      <Label htmlFor="monday">Monday</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button
                onClick={handleSaveSettings}
                disabled={isLoading}
                className="ml-auto"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <span className="h-4 w-4 animate-spin mr-2 border-2 border-current border-t-transparent rounded-full" />
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </span>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Weekly Email Summary</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Receive a weekly email summarizing your finances
                    </p>
                  </div>
                  <Switch
                    checked={notifications.emailSummary}
                    onCheckedChange={(checked) =>
                      handleNotificationsChange("emailSummary", checked)
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Large Expense Alerts</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Get notified when large expenses are recorded
                    </p>
                  </div>
                  <Switch
                    checked={notifications.expenseAlerts}
                    onCheckedChange={(checked) =>
                      handleNotificationsChange("expenseAlerts", checked)
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Budget Warnings</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Be alerted when nearing budget limits
                    </p>
                  </div>
                  <Switch
                    checked={notifications.budgetWarnings}
                    onCheckedChange={(checked) =>
                      handleNotificationsChange("budgetWarnings", checked)
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Receipt Reminders</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Get reminded to upload receipts for expenses
                    </p>
                  </div>
                  <Switch
                    checked={notifications.receiptReminders}
                    onCheckedChange={(checked) =>
                      handleNotificationsChange("receiptReminders", checked)
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">
                      Marketing Communications
                    </Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Receive updates about new features and promotions
                    </p>
                  </div>
                  <Switch
                    checked={notifications.marketingEmails}
                    onCheckedChange={(checked) =>
                      handleNotificationsChange("marketingEmails", checked)
                    }
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button
                onClick={handleSaveSettings}
                disabled={isLoading}
                className="ml-auto"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <span className="h-4 w-4 animate-spin mr-2 border-2 border-current border-t-transparent rounded-full" />
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </span>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Update your security preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">
                      Two-Factor Authentication
                    </Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={security.twoFactorAuth}
                      onCheckedChange={(checked) =>
                        handleSecurityChange("twoFactorAuth", checked)
                      }
                    />
                    {!security.twoFactorAuth && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleSecurityChange("twoFactorAuth", true)
                        }
                      >
                        Enable
                      </Button>
                    )}
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="text-base" htmlFor="sessionTimeout">
                    Session Timeout
                  </Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    Automatically log out after a period of inactivity
                  </p>
                  <Select
                    value={security.sessionTimeout}
                    onValueChange={(value) =>
                      handleSecurityChange("sessionTimeout", value)
                    }
                  >
                    <SelectTrigger className="w-full sm:w-[240px]">
                      <SelectValue placeholder="Select timeout period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                      <SelectItem value="0">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div>
                  <Label className="text-base">Password Reset</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    Change your account password
                  </p>
                  <Button variant="outline">Change Password</Button>
                </div>

                <Separator />

                <div>
                  <Label className="text-base">Login History</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    View your recent login activity
                  </p>
                  <Button variant="outline">View Login History</Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button
                onClick={handleSaveSettings}
                disabled={isLoading}
                className="ml-auto"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <span className="h-4 w-4 animate-spin mr-2 border-2 border-current border-t-transparent rounded-full" />
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </span>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
