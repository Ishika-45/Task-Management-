import React, { useEffect, useState, Suspense } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners";
import SprintCreationForm from "../components/create-sprint";
import SprintBoard from "../components/sprint-board";
import { getProject } from "../services/projectService";
import { useUser, useOrganization } from "@clerk/clerk-react";

const ProjectLayout = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const { user, isLoaded: isUserLoaded } = useUser();
  const { organization, isLoaded: isOrgLoaded } = useOrganization();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isUserLoaded || !isOrgLoaded) return;

    const fetchProject = async () => {
      try {
        if (!user?.id || !organization?.id) {
          console.warn("❌ Missing user or organization info");
          navigate("/sign-in");
          return;
        }

        const data = await getProject(projectId, user.id, organization.id);

        if (!data) {
          navigate("/not-found");
        } else {
          setProject(data);
        }
      } catch (error) {
        console.error("Failed to fetch project:", error);
        navigate("/not-found");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [isUserLoaded, isOrgLoaded, user, organization, projectId, navigate]);

  if (loading) {
    return <BarLoader width={"100%"} color="#36d7b7" className="mt-4" />;
  }

  if (!project) {
    return <div className="text-center p-4">Project not found.</div>;
  }

  return (
    <div className="container mx-auto">
      <SprintCreationForm
        projectTitle={project.name}
        projectId={projectId}
        projectKey={project.key}
        sprintKey={project.sprints?.length + 1}
      />

      {project.sprints?.length > 0 ? (
        <Suspense fallback={<BarLoader width={"100%"} color="#36d7b7" />}>
          <SprintBoard
            sprints={project.sprints}
            projectId={projectId}
            orgId={project.organizationId}
          />
        </Suspense>
      ) : (
        <div className="text-center mt-4">
          Create a Sprint from the button above
        </div>
      )}
    </div>
  );
};

export default ProjectLayout;
