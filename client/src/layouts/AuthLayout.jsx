import React from "react";
import { Outlet } from "react-router-dom";
import { MdOutlineMapsHomeWork } from "react-icons/md";

const AuthLayout = () => {
  return (
    // Updated background classes
    <div className="relative min-h-screen w-full bg-slate-900  [background-size:16px_16px]">
      {/* Optional: Updated header for better dark mode aesthetics */}
      <header className="absolute top-0 left-0 w-full px-6 py-3 flex justify-between items-center z-10 bg-slate-900/50 backdrop-blur-sm border-b border-slate-300/10">
        <div className="flex items-center gap-2 text-slate-200 font-semibold ">
          <MdOutlineMapsHomeWork size={28} />
          <span className="text-xl">FinView</span>
        </div>
      </header>

      {/* center content, add top padding so header doesn't overlap */}
      <main className="relative min-h-screen w-full flex items-center justify-center pt-16 z-20">
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;