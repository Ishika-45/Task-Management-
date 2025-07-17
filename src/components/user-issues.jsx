import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import IssueCard from "./issue-card";
import { getUserIssues } from "../services/organisation";
import { useOrganization, useUser } from "@clerk/clerk-react";

const UserIssues = () => {
  const { user } = useUser();
  const { organization } = useOrganization();

  const [assignedIssues, setAssignedIssues] = useState([]);
  const [reportedIssues, setReportedIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIssues = async () => {
      if (!user?.id || !organization?.id) return;

      try {
        const allIssues = await getUserIssues(user.id, organization.id);

        const assigned = allIssues.filter(
          (issue) => issue.assigneeId === user.id
        );
        const reported = allIssues.filter(
          (issue) => issue.reporterId === user.id
        );

        setAssignedIssues(assigned);
        setReportedIssues(reported);
      } catch (error) {
        console.error("Error fetching user issues:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, [user, organization]);

  if (loading) return <p>Loading issues...</p>;
  if (assignedIssues.length === 0 && reportedIssues.length === 0)
    return null;

  return (
    <>
      <h1 className="text-4xl font-bold gradient-title mb-4">My Issues</h1>

      <Tabs defaultValue="assigned" className="w-full">
        <TabsList>
          <TabsTrigger value="assigned">Assigned to You</TabsTrigger>
          <TabsTrigger value="reported">Reported by You</TabsTrigger>
        </TabsList>

        <TabsContent value="assigned">
          <IssueGrid issues={assignedIssues} />
        </TabsContent>

        <TabsContent value="reported">
          <IssueGrid issues={reportedIssues} />
        </TabsContent>
      </Tabs>
    </>
  );
};

const IssueGrid = ({ issues }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {issues.map((issue) => (
        <IssueCard key={issue.id} issue={issue} showStatus />
      ))}
    </div>
  );
};

export default UserIssues;
