import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, addDays } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { useUser, useOrganization } from "@clerk/clerk-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import useFetch from "../hooks/use-fetch";
import { createSprint } from "../services/sprintService";
import { sprintSchema } from "../lib/validators";

const SprintCreationForm = ({ projectTitle, projectKey, projectId, sprintKey }) => {
  const [showForm, setShowForm] = useState(false);
  const [dateRange, setDateRange] = useState({
    from: new Date(),
    to: addDays(new Date(), 14),
  });

  const { user } = useUser();
  const { organization } = useOrganization();
  const navigate = useNavigate();

  const {
    loading: createSprintLoading,
    fn: createSprintFn,
  } = useFetch(createSprint);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(sprintSchema),
    defaultValues: {
      name: `${projectKey}-${sprintKey}`,
      startDate: dateRange.from,
      endDate: dateRange.to,
    },
  });

  const onSubmit = async (data) => {
    if (!user || !organization) {
      alert("You must be signed in and part of an organization.");
      return;
    }

    await createSprintFn(
      projectId,
      {
        ...data,
        startDate: dateRange.from,
        endDate: dateRange.to,
      },
      user.id,
      organization.id
    );

    setShowForm(false);
    navigate(0); 
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-5xl font-bold mb-8 gradient-title">{projectTitle}</h1>
        <Button
          className="mt-2"
          onClick={() => setShowForm(!showForm)}
          variant={!showForm ? "default" : "destructive"}
        >
          {!showForm ? "Create New Sprint" : "Cancel"}
        </Button>
      </div>

      {showForm && (
        <Card className="pt-4 mb-4">
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="flex gap-4 items-end flex-wrap">
              <div className="flex-1 min-w-[250px]">
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Sprint Name
                </label>
                <Input
                  id="name"
                  {...register("name")}
                  readOnly
                  className="bg-slate-950"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div className="flex-1 min-w-[250px]">
                <label className="block text-sm font-medium mb-1">Sprint Duration</label>
                <Controller
                  control={control}
                  name="dateRange"
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={`w-full justify-start text-left font-normal bg-slate-950 ${
                            !dateRange && "text-muted-foreground"
                          }`}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateRange.from && dateRange.to ? (
                            format(dateRange.from, "LLL dd, y") +
                            " - " +
                            format(dateRange.to, "LLL dd, y")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto bg-slate-900" align="start">
                        <DayPicker
                          classNames={{
                            chevron: "fill-blue-500",
                            range_start: "bg-blue-700",
                            range_end: "bg-blue-700",
                            range_middle: "bg-blue-400",
                            day_button: "border-none",
                            today: "border-2 border-blue-700",
                          }}
                          mode="range"
                          disabled={[{ before: new Date() }]}
                          selected={dateRange}
                          onSelect={(range) => {
                            if (range?.from && range?.to) {
                              setDateRange(range);
                              field.onChange(range);
                            }
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
              </div>

              <Button
                type="submit"
                disabled={createSprintLoading}
                className="h-10 mt-4 min-w-[140px]"
              >
                {createSprintLoading ? "Creating..." : "Create Sprint"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default SprintCreationForm;
