import React from "react";
import { Bell, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Topbar = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="fixed top-0 left-0 w-full flex items-center justify-between bg-[#0f172a] border-b border-[#475569] px-8 py-3 z-50 text-[#3AAFA9]">
      {/* Left side: FineView logo */}
      <h1
        className="text-2xl font-bold text-[#e5e9e9] cursor-pointer"
        onClick={() => navigate("/dashboard")}
      >
        FineView
      </h1>

      {/* Right side: Dashboard, Transactions, Analytics, Notification, Logout, Profile */}
      <div className="flex items-center space-x-8">
        <button
          onClick={() => navigate("/dashboard")}
          className="hover:text-white font-medium"
        >
          Dashboard
        </button>
        <button
          onClick={() => navigate("/transactions")}
          className="hover:text-white font-medium"
        >
          Transactions
        </button>
        <button
          onClick={() => navigate("/analytics")}
          className="hover:text-white font-medium"
        >
          Analytics
        </button>
        <Bell
          className="cursor-pointer hover:text-white"
          size={22}
        />
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition"
        >
          <LogOut size={16} /> Logout
        </button>
        <User
          className="cursor-pointer hover:text-white"
          size={22}
          onClick={() => navigate("/profile")}
        />
      </div>
    </div>
  );
};

export default Topbar;
