import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser, useOrganization } from "@clerk/clerk-react";
import {getOrganization,saveOrganizationIfNotExists} from "../services/organisation";
import OrgSwitcher from "../components/org-switcher";
import ProjectList from "../components/project-list";
import UserIssues from "../components/user-issues";

const Organization = () => {
  const { orgId } = useParams();
  const navigate = useNavigate();

  const { user, isLoaded: isUserLoaded } = useUser();
  const { organization: clerkOrg, isLoaded: isOrgLoaded } = useOrganization();

  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isUserLoaded && !user) {
      navigate("/sign-in");
    }
  }, [isUserLoaded, user, navigate]);

  useEffect(() => {
    if (isUserLoaded && isOrgLoaded && clerkOrg?.id && user?.id) {
      saveOrganizationIfNotExists(clerkOrg, user.id);
    }
  }, [clerkOrg, user, isUserLoaded, isOrgLoaded]);
  useEffect(() => {
    const fetchOrganization = async () => {
      if (!user?.id || !orgId) return;

      const org = await getOrganization(orgId, user.id);

      if (!org) {
        setOrganization(null);
      } else {
        setOrganization(org);
      }

      setLoading(false);
    };

    fetchOrganization();
  }, [orgId, user]);

  if (loading) return <div className="p-4">Loading organization...</div>;
  if (!organization) return <div className="p-4">Organization not found</div>;

  return (
    <div className="container mx-auto px-4">
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start">
        <h1 className="text-5xl font-bold gradient-title pb-2">
          {organization.name}&rsquo;s Projects
        </h1>
        <OrgSwitcher />
      </div>

      <div className="mb-4">
        <ProjectList orgId={organization.id} />
      </div>

      <div className="mt-8">
        <UserIssues />
      </div>
    </div>
  );
};

export default Organization;
