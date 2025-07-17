import { useState } from "react";
import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { formatDistanceToNow } from "date-fns";
import IssueDetailsDialog from "./issue-details-dialog";
import UserAvatar from "./user-avatar";
import { useUser } from "@clerk/clerk-react";

const priorityColor = {
  LOW: "border-green-600",
  MEDIUM: "border-yellow-300",
  HIGH: "border-orange-400",
  URGENT: "border-red-400",
};

export default function IssueCard({
  issue,
  showStatus = false,
  onDelete = () => {},
  onUpdate = () => {},
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useUser();

  const onDeleteHandler = (...params) => {
    onDelete(...params);
  };

  const onUpdateHandler = (...params) => {
    onUpdate(...params);
  };

  let created = "unknown";
  try {
    const createdDate =
      issue.createdAt?.toDate?.() || new Date(issue.createdAt);
    if (createdDate instanceof Date && !isNaN(createdDate)) {
      created = formatDistanceToNow(createdDate, { addSuffix: true });
    }
  } catch (err) {
    console.warn("Invalid createdAt value:", issue.createdAt);
  }

  const assigneeToShow = issue.assignee || {
    name: user?.fullName || "Unassigned",
    imageUrl: user?.imageUrl || "",
  };

  return (
    <>
      <Card
        className={`cursor-pointer transition-shadow border-2 ${priorityColor[issue.priority]} hover:shadow-lg shadow-sm rounded-md`}
        onClick={() => setIsDialogOpen(true)}
      >
        <CardHeader className="pb-2 pt-3">
          <CardTitle className="text-lg">{issue.title}</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-wrap items-center gap-2 pt-0">
          {showStatus && <Badge>{issue.status}</Badge>}
          <Badge variant="outline">{issue.priority}</Badge>
        </CardContent>

        <CardFooter className="flex flex-col items-start space-y-2 mt-2">
          <UserAvatar user={assigneeToShow} />
          <div className="text-xs text-gray-500">Created {created}</div>
        </CardFooter>
      </Card>

      {isDialogOpen && (
        <IssueDetailsDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          issue={issue}
          onDelete={onDeleteHandler}
          onUpdate={onUpdateHandler}
          borderCol={priorityColor[issue.priority]}
        />
      )}
    </>
  );
}
