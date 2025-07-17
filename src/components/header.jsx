import React, { useEffect } from "react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/clerk-react";
import UserMenu from "./user-menu";
import { PenBox } from "lucide-react";
import {checkUser} from "../lib/checkUser";
import UserLoading from "./user-loading";

const Header = () => {
  const { user, isLoaded } = useUser();

  useEffect(() => {
  const fetchUser = async () => {
    if (user && isLoaded) {
      await checkUser(user);
    }
  };
  fetchUser();
}, [user, isLoaded]);

  return (
    <header className="container mx-auto">
      <nav className="py-6 px-4 flex justify-between items-center">
        <Link to="/">
          <h1 className="text-5xl font-bold">
           PlanPilot
          </h1>
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/project/create">
            <Button variant="destructive" className="flex items-center gap-2">
              <PenBox size={18} />
              <span className="hidden md:inline">Create Project</span>
            </Button>
          </Link>

          <Link to="/onboarding">
            <Button variant="secondary" className="hidden md:inline">
              My Organizations
            </Button>
          </Link>

          <SignedOut>
            <SignInButton mode="redirect">
              <Button variant="secondary">Login</Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserMenu />
          </SignedIn>
        </div>
      </nav>

      <UserLoading />
    </header>
  );
};

export default Header;
