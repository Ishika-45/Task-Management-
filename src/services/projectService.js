import {
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";

export const createProject = async (data, currentUser, currentOrgId, isAdmin) => {
  if (!currentUser) throw new Error("Unauthorized");
  if (!currentOrgId) throw new Error("No Organization Selected");
  if (!isAdmin) throw new Error("Only organization admins can create projects");

  try {
    const projectId = crypto.randomUUID();
    const projectRef = doc(db, "projects", projectId);

    const projectData = {
      id: projectId,
      name: data.name,
      key: data.key,
      description: data.description,
      organizationId: currentOrgId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await setDoc(projectRef, projectData);
    return projectData;
  } catch (error) {
    console.error("Error creating project:", error);
    throw new Error("Error creating project: " + error.message);
  }
};
export const getProject = async (projectId, currentUser, currentOrgId) => {
  if (!currentUser || !currentOrgId) {
    console.warn("Unauthorized access attempt in getProject");
    throw new Error("Unauthorized");
  }

  const projectRef = doc(db, "projects", projectId);
  const projectSnap = await getDoc(projectRef);

  if (!projectSnap.exists()) {
    console.warn(`Project not found: ${projectId}`);
    throw new Error("Project not found");
  }

  const project = projectSnap.data();

  if (project.organizationId !== currentOrgId) {
    console.warn("Access denied to project:", projectId);
    throw new Error("Access denied: this project does not belong to your organization");
  }

  try {
    const sprintsRef = collection(db, "sprints");
    const sprintQuery = query(
      sprintsRef,
      where("projectId", "==", projectId),
      orderBy("createdAt", "desc")
    );
    const sprintSnap = await getDocs(sprintQuery);
    const sprints = sprintSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    return { ...project, sprints };
  } catch (error) {
    console.error("Failed to load sprints for project:", projectId, error);
    return { ...project, sprints: [] }; 
  }
};

export const deleteProject = async (projectId, currentUser, currentOrgId, isAdmin) => {
  if (!currentUser || !currentOrgId) throw new Error("Unauthorized");
  if (!isAdmin) throw new Error("Only organization admins can delete projects");

  const projectRef = doc(db, "projects", projectId);
  const projectSnap = await getDoc(projectRef);

  if (!projectSnap.exists()) throw new Error("Project not found");

  const project = projectSnap.data();

  if (project.organizationId !== currentOrgId) {
    throw new Error("You don't have permission to delete this project");
  }

  try {
    await deleteDoc(projectRef);
    return { success: true };
  } catch (error) {
    console.error("Failed to delete project:", error);
    throw new Error("Error deleting project: " + error.message);
  }
};
