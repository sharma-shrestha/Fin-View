// src/pages/Success.jsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Success = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Card className="w-[380px] rounded-2xl shadow-lg bg-[#121a2a] text-center text-white border border-gray-400">
        <CardContent className="flex flex-col items-center space-y-6 py-10">
          {/* Success Icon */}
          <CheckCircle2 className="w-20 h-20 text-teal-400" />

          {/* Title & Subtitle */}
          <div>
            <h2 className="text-2xl font-semibold">You’re in!</h2>
            <p className="text-gray-400 text-sm mt-1">
              Loading your financial overview...
            </p>
          </div>

          {/* Dashboard Button */}
          <Button
            className="w-full bg-teal-500 hover:bg-teal-600 text-white rounded-xl"
            onClick={() => navigate("/AccountSetup")}
          >
            Go to Account Setup
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Success;
