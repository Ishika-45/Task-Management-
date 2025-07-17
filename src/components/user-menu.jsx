import React, { useState, useRef, useEffect } from "react";
import { UserButton, useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { ChartNoAxesGantt } from "lucide-react";

const UserMenu = () => {
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMyOrganizations = () => {
    navigate("/onboarding");
    setOpen(false);
  };

  const handleManageAccount = () => {
    window.open("https://dashboard.clerk.com/user", "_blank");
    setOpen(false);
  };

  const handleSignOut = () => {
    signOut(() => navigate("/"));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="cursor-pointer" onClick={() => setOpen((prev) => !prev)}>
        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-10 h-10",
            },
          }}
        />
      </div>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50">
          
          <button
            onClick={handleManageAccount}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
          >
            Manage Account
          </button>
          <button
            onClick={handleSignOut}
            className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-100 text-sm"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
