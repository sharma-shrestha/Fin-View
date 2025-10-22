import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { getEnv } from "@/helpers/getEnv";
import { showToast } from "@/helpers/showToast";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [budget, setBudget] = useState(null);
  const [activeTab, setActiveTab] = useState("account");
  const [isEditing, setIsEditing] = useState(false);
  const [dob, setDob] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch logged-in user
  const fetchUser = async () => {
    try {
      const res = await fetch(`${getEnv("VITE_API_URL")}/users/me`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        if (data.user.dob) setDob(new Date(data.user.dob));
      }
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  // ✅ Fetch Financial Goal (current month)
  const fetchBudget = async () => {
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    try {
      const res = await fetch(`${getEnv("VITE_API_URL")}/budget/me?month=${month}&year=${year}`,
        { credentials: "include" }
      );
      const data = await res.json();
      if (data.success) setBudget(data.budget);
    } catch (err) {
      console.error("Error fetching budget:", err);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchBudget();
  }, []);

  const handleChange = (field, value) => {
    setUser((prev) => ({ ...prev, [field]: value }));
  };

  // ✅ Save profile changes
  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${getEnv("VITE_API_URL")}/users/update`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user.name,
          phone: user.phone,
          country: user.country,
          state: user.state,
          dob: dob ? dob.toISOString() : null,
        }),
      });

      const data = await res.json();
      if (data.success) {
        // ✅ Update local state immediately
        setUser(data.user);
        setIsEditing(false);
        showToast("success", data.message || "Profile updated successfully");
      } else {
        showToast("error", data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Error saving profile:", err);
      showToast("error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!user)
    return (
      <div className="flex items-center justify-center h-screen text-muted-foreground">
        Loading profile...
      </div>
    );

  // ✅ Compute goal progress dynamically from backend
  const goalValue = budget?.totals?.savings || 0;
  const goalTarget = budget?.income || 0;
  const goalProgress = goalTarget > 0 ? Math.min((goalValue / goalTarget) * 100, 100) : 0;

  return (
    <div className="min-h-screen bg-[#0b1324] text-white p-6">
      <h1 className="text-2xl font-semibold mb-6">Profile</h1>

      {/* Search bar */}
      <div className="mb-6">
        <Input
          placeholder="Search profile details..."
          className="bg-[#10192e] border-none text-white placeholder:text-gray-400"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Section */}
        <Card className="bg-[#10192e] border-none flex flex-col items-center p-6 rounded-2xl">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name?.[0]?.toUpperCase() || "U"}</AvatarFallback>
          </Avatar>
          <h2 className="text-lg text-white font-semibold">{user.name}</h2>
          <p className="text-sm text-gray-400">{user.email}</p>

          {/* Financial Goal */}
          <Card className="mt-6 w-full bg-[#0d1730] border-none p-4 rounded-2xl bg-gray-800">
            <CardHeader className="pb-2">
              <h3 className="text-sm text-gray-300">Financial Goal Progress</h3>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="relative w-24 h-24 mb-3">
                <Progress value={goalProgress} className="h-24 w-24 rounded-full" />
                <div className="absolute inset-0 flex items-center justify-center text-lg font-semibold text-white">
                  {Math.round(goalProgress)}%
                </div>
              </div>
              <p className="text-sm text-center text-gray-400">
                You’ve saved ₹{goalValue.toLocaleString()} out of ₹{goalTarget.toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </Card>

        {/* Right Section */}
        <Card className="col-span-2 bg-[#10192e] border-none rounded-2xl p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-transparent border-b border-gray-700 mb-4">
              <TabsTrigger
                value="account"
                className={`mr-4 pb-2 ${
                  activeTab === "account"
                    ? "border-b-2 border-teal-500 text-white"
                    : "text-gray-400"
                }`}
              >
                Account Info
              </TabsTrigger>
            </TabsList>

            <TabsContent value="account">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Full Name</label>
                  <Input
                    value={user.name || ""}
                    disabled={!isEditing}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="bg-[#0d1730] border text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Phone Number</label>
                  <Input
                    value={user.phone || ""}
                    disabled={!isEditing}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="bg-[#0d1730] border text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Country</label>
                  <Input
                    value={user.country || ""}
                    disabled={!isEditing}
                    onChange={(e) => handleChange("country", e.target.value)}
                    className="bg-[#0d1730] border text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">State</label>
                  <Input
                    value={user.state || ""}
                    disabled={!isEditing}
                    onChange={(e) => handleChange("state", e.target.value)}
                    className="bg-[#0d1730] border text-white"
                  />
                </div>

                {/* DOB Picker */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Date of Birth</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button disabled={!isEditing}>
                        <CalendarIcon className="mr-2 h-5 w-5 text-gray-400" />
                        {dob ? format(dob, "dd MMM yyyy") : "Select Date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-[#0d1730] text-white border-none shadow-none">
                      <Calendar
                        mode="single"
                        selected={dob}
                        onSelect={setDob}
                        fromYear={1970}
                        toYear={2030}
                        className="bg-[#0d1730] text-white"
                        captionLayout="dropdown"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <Button
                className="mt-6 bg-teal-600 hover:bg-teal-700"
                disabled={loading}
                onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              >
                {loading
                  ? "Saving..."
                  : isEditing
                  ? "Save Changes"
                  : "Edit Profile"}
              </Button>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
