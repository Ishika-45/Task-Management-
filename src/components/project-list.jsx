import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; 
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { getProjects } from "../services/organisation"; 
import DeleteProject from "./delete-project";

const ProjectList = ({ orgId }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!orgId) return;
      const result = await getProjects(orgId);
      setProjects(result);
      setLoading(false);
    };

    fetchProjects();
  }, [orgId]);

  if (loading) return <p>Loading projects...</p>;

  if (projects.length === 0) {
    return (
      <p>
        No projects found.{" "}
        <Link
          className="underline underline-offset-2 text-blue-500"
          to="/project/create"
        >
          Create New.
        </Link>
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {projects.map((project) => (
        <Card key={project.id}>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              {project.name}
              <DeleteProject projectId={project.id} />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">{project.description}</p>
            <Link
              to={`/project/${project.id}`}
              className="text-blue-500 hover:underline"
            >
              View Project
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProjectList;
