import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "./ui/drawer";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useNavigate } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
import useFetch from "../hooks/use-fetch";
import { createIssue } from "../services/issueService";
import { issueSchema } from "../lib/validators";
import { useUser } from "@clerk/clerk-react";

const IssueCreationDrawer = ({
  isOpen,
  onClose,
  sprintId,
  status,
  projectId,
  onIssueCreated,
}) => {
  const { user, isLoaded } = useUser();
  const currentUserId = user?.id;
  const navigate = useNavigate();
  const {
    loading: createIssueLoading,
    fn: createIssueFn,
    error,
    data: newIssue,
  } = useFetch(createIssue);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    getValues,
    setValue,
  } = useForm({
    resolver: zodResolver(issueSchema),
    defaultValues: {
      priority: "MEDIUM",
      description: "",
      title: "",
      assigneeId: currentUserId || "",
    },
  });

  useEffect(() => {
    if (currentUserId) {
      setValue("assigneeId", currentUserId);
    }
  }, [currentUserId, setValue]);

  const onSubmit = async (data) => {
    if (!currentUserId || !projectId) return;

    const issueData = {
      ...data,
      assigneeId: currentUserId,
      status,
      sprintId,
    };

    try {
      await createIssueFn(projectId, issueData, user);
    } catch (err) {
      console.error("Error creating issue:", err.message);
      return;
    }
  };

  useEffect(() => {
    if (newIssue) {
      reset();
      onClose();
      onIssueCreated();
    }
  }, [newIssue, createIssueLoading, onClose, onIssueCreated, reset]);

  if (!isLoaded) return null;

  return (
    <Drawer open={isOpen} onClose={() => {onClose(); window.location.reload();}}>
      <DrawerContent aria-describedby="drawer-description">
        <DrawerHeader>
          <DrawerTitle>Create New Issue</DrawerTitle>
          <p
            id="drawer-description"
            className="text-sm text-muted-foreground mt-1"
          >
            Provide title, description, and priority to create a new issue.
          </p>
        </DrawerHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Title
            </label>
            <Input id="title" {...register("title")} />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium mb-1"
            >
              Description
            </label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <MDEditor value={field.value} onChange={field.onChange} />
              )}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="priority"
              className="block text-sm font-medium mb-1"
            >
              Priority
            </label>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="URGENT">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.priority && (
              <p className="text-red-500 text-sm mt-1">
                {errors.priority.message}
              </p>
            )}
          </div>

          {error && <p className="text-red-500 mt-2">{error.message}</p>}

          <Button
            type="submit"
            className="w-full"
            disabled={createIssueLoading}
          >
            {createIssueLoading ? "Creating..." : "Create Issue"}
          </Button>
        </form>
      </DrawerContent>
    </Drawer>
  );
};

export default IssueCreationDrawer;
