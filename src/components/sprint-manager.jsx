import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Badge } from "./ui/badge";
import { BarLoader } from "react-spinners";
import {
  formatDistanceToNow,
  isAfter,
  isBefore,
  format,
  isValid,
} from "date-fns";
import useFetch from "../hooks/use-fetch";
import { useNavigate, useSearchParams } from "react-router-dom";
import { updateSprintStatus } from "../services/sprintService";
import { useUser, useOrganization } from "@clerk/clerk-react";

const SprintManager = ({ sprint, setSprint, sprints, projectId }) => {
  const [status, setStatus] = useState(sprint.status);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { user, isLoaded } = useUser();
  const { organization, membership } = useOrganization();

  const currentUser = user;
  const currentOrgId = organization?.id || null;
  const isAdmin = membership?.role?.includes("admin");

  const {
    fn: updateStatus,
    loading,
    error,
    data: updatedStatus,
  } = useFetch(updateSprintStatus);

  const formatSafeDate = (dateInput) => {
    if (!dateInput) return "Invalid date";
    try {
      const date =
        typeof dateInput?.toDate === "function"
          ? dateInput.toDate()
          : new Date(dateInput);
      return isValid(date) ? format(date, "MMM d, yyyy") : "Invalid date";
    } catch {
      return "Invalid date";
    }
  };

  const getJsDate = (value) =>
    typeof value?.toDate === "function" ? value.toDate() : new Date(value);

  const startDate = getJsDate(sprint.startDate);
  const endDate = getJsDate(sprint.endDate);
  const now = new Date();

  const canStart =
    isAdmin &&
    isBefore(now, endDate) &&
    isAfter(now, startDate) &&
    status === "PLANNED";
  const canEnd = isAdmin && status === "ACTIVE";

  const handleStatusChange = async (newStatus) => {
    try {
      await updateStatus(sprint.id, newStatus, currentUser, currentOrgId, isAdmin);
    } catch (err) {
      console.error("Error updating sprint status:", err.message);
    }
  };

  useEffect(() => {
    if (updatedStatus?.success) {
      setStatus(updatedStatus.sprint.status);
      setSprint({
        ...sprint,
        status: updatedStatus.sprint.status,
      });
    }
  }, [updatedStatus, loading]);

  const getStatusText = () => {
    if (status === "COMPLETED") return `Sprint Ended`;
    if (status === "ACTIVE" && isAfter(now, endDate)) {
      return `Overdue by ${formatDistanceToNow(endDate)}`;
    }
    if (status === "PLANNED" && isBefore(now, startDate)) {
      return `Starts in ${formatDistanceToNow(startDate)}`;
    }
    return null;
  };

  useEffect(() => {
    const sprintId = searchParams.get("sprint");
    if (sprintId && sprintId !== sprint.id) {
      const selectedSprint = sprints.find((s) => s.id === sprintId);
      if (selectedSprint) {
        setSprint(selectedSprint);
        setStatus(selectedSprint.status);
      }
    }
  }, [searchParams, sprints, sprint.id, setSprint]);

  const handleSprintChange = (value) => {
    const selectedSprint = sprints.find((s) => s.id === value);
    if (selectedSprint) {
      setSprint(selectedSprint);
      setStatus(selectedSprint.status);
      navigate(`/project/${projectId}?sprint=${value}`);
    }
  };

  if (!isLoaded || !organization) return null;

  return (
    <>
      <div className="flex justify-between items-center gap-4">
        <Select value={sprint.id} onValueChange={handleSprintChange}>
          <SelectTrigger className="bg-slate-950 self-start">
            <SelectValue placeholder="Select Sprint" />
          </SelectTrigger>
          <SelectContent>
            {sprints.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name} ({formatSafeDate(s.startDate)} to{" "}
                {formatSafeDate(s.endDate)})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {canStart && (
          <Button
            onClick={() => handleStatusChange("ACTIVE")}
            disabled={loading}
            className="bg-green-900 text-white"
          >
            Start Sprint
          </Button>
        )}
        {canEnd && (
          <Button
            onClick={() => handleStatusChange("COMPLETED")}
            disabled={loading}
            variant="destructive"
          >
            End Sprint
          </Button>
        )}
      </div>

      {loading && <BarLoader width={"100%"} className="mt-2" color="#36d7b7" />}

      {getStatusText() && (
        <Badge variant="" className="mt-3 ml-1 self-start">
          {getStatusText()}
        </Badge>
      )}
    </>
  );
};

export default SprintManager;
