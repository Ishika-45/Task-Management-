import React, { useEffect } from "react";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import { useOrganization, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import useFetch from "../hooks/use-fetch";
import { deleteProject } from "../services/projectService"; 

export default function DeleteProject({ projectId }) {
  const navigate = useNavigate();
  const { user } = useUser();
  const { organization, membership } = useOrganization();

  const isAdmin = membership?.role === "org:admin";

  const {
    loading: isDeleting,
    error,
    fn: deleteProjectFn,
    data: deleted,
  } = useFetch(async () => {
    return await deleteProject(
      projectId,
      user,
      organization.id,
      isAdmin
    );
  });

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      deleteProjectFn();
    }
  };

  useEffect(() => {
    if (deleted?.success) {
      navigate(0);
    }
  }, [deleted, navigate]);

  if (!isAdmin) return null;

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className={`${isDeleting ? "animate-pulse" : ""}`}
        onClick={handleDelete}
        disabled={isDeleting}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
      {error && <p className="text-red-500 text-sm">{error.message}</p>}
    </>
  );
}
