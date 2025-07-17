import React from "react";
import { useOrganization, useUser } from "@clerk/clerk-react";
import { BarLoader } from "react-spinners";

const UserLoading = () => {
  const { isLoaded: isOrgLoaded } = useOrganization();
  const { isLoaded: isUserLoaded } = useUser();

  if (!isOrgLoaded || !isUserLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return null;
};

export default UserLoading;