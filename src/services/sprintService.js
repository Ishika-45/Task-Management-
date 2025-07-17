import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";
import { SprintStatus } from "../utils/constants"; 

export const createSprint = async (projectId, data, currentUser, currentOrgId) => {
  if (!currentUser || !currentOrgId) throw new Error("Unauthorized");

  const projectRef = doc(db, "projects", projectId);
  const projectSnap = await getDoc(projectRef);
  if (!projectSnap.exists()) throw new Error("Project not found");

  const project = projectSnap.data();
  if (project.organizationId !== currentOrgId) {
    throw new Error("You don't have access to this project");
  }

  const sprintsQuery = query(
    collection(db, "sprints"),
    where("projectId", "==", projectId),
    orderBy("createdAt", "desc")
  );
  const sprintsSnap = await getDocs(sprintsQuery);

  const sprintId = crypto.randomUUID();
  const sprintRef = doc(db, "sprints", sprintId);

  const sprintData = {
    id: sprintId,
    name: data.name,
    startDate: data.startDate,
    endDate: data.endDate,
    status: SprintStatus.PLANNED,
    projectId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await setDoc(sprintRef, sprintData);
  return sprintData;
};

export const updateSprintStatus = async (
  sprintId,
  newStatus,
  currentUser,
  currentOrgId,
  isAdmin
) => {
  if (!currentUser || !currentOrgId) throw new Error("Unauthorized");
  if (!isAdmin) throw new Error("Only Admin can make this change");

  const sprintRef = doc(db, "sprints", sprintId);
  const sprintSnap = await getDoc(sprintRef);
  if (!sprintSnap.exists()) throw new Error("Sprint not found");

  const sprint = sprintSnap.data();

  const projectSnap = await getDoc(doc(db, "projects", sprint.projectId));
  const project = projectSnap.data();
  if (project.organizationId !== currentOrgId) {
    throw new Error("Unauthorized");
  }

  const now = new Date();
  const startDate = new Date(sprint.startDate);
  const endDate = new Date(sprint.endDate);

  if (
    newStatus === SprintStatus.ACTIVE &&
    (now < startDate || now > endDate)
  ) {
    throw new Error("Cannot start sprint outside of its date range");
  }

  if (
    newStatus === SprintStatus.COMPLETED &&
    sprint.status !== SprintStatus.ACTIVE
  ) {
    throw new Error("Can only complete an active sprint");
  }

  await updateDoc(sprintRef, {
    status: newStatus,
    updatedAt: new Date(),
  });

  const updated = await getDoc(sprintRef);
  return { success: true, sprint: { id: updated.id, ...updated.data() } };
};
