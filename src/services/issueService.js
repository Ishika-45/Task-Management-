import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  writeBatch,
} from "firebase/firestore";
import { db } from "../firebase";
import { IssueStatus, IssuePriority } from "../utils/constants";

export const getIssuesForSprint = async (sprintId) => {
  const q = query(
    collection(db, "issues"),
    where("sprintId", "==", sprintId),
    orderBy("status"),
    orderBy("order")
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const createIssue = async (projectId, data, currentUser) => {
  if (!currentUser) throw new Error("Unauthorized");

  if (!Object.values(IssueStatus).includes(data.status)) {
    throw new Error(`Invalid issue status: ${data.status}`);
  }

  if (!Object.values(IssuePriority).includes(data.priority)) {
    throw new Error(`Invalid issue priority: ${data.priority}`);
  }

  const issuesRef = collection(db, "issues");

  const q = query(
    issuesRef,
    where("projectId", "==", projectId),
    where("status", "==", data.status),
    orderBy("order", "desc")
  );

  const snapshot = await getDocs(q);
  const lastIssue = snapshot.docs[0];
  const newOrder = lastIssue ? lastIssue.data().order + 1 : 0;

  const issueId = crypto.randomUUID();
  const issueRef = doc(db, "issues", issueId);

  const issueData = {
    id: issueId,
    title: data.title,
    description: data.description,
    status: data.status,
    priority: data.priority,
    sprintId: data.sprintId || null,
    assigneeId: data.assigneeId || null,
    reporterId: currentUser.id,
    projectId,
    order: newOrder,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await setDoc(issueRef, issueData);
  return issueData;
};

export const updateIssueOrder = async (updatedIssues) => {
  const batch = writeBatch(db);

  updatedIssues.forEach((issue) => {
    if (!Object.values(IssueStatus).includes(issue.status)) {
      throw new Error(`Invalid issue status: ${issue.status}`);
    }

    const ref = doc(db, "issues", issue.id);
    batch.update(ref, {
      status: issue.status,
      order: issue.order,
      updatedAt: new Date(),
    });
  });

  await batch.commit();
  return { success: true };
};

export const deleteIssue = async (issueId, currentUser) => {
  if (!currentUser) throw new Error("Unauthorized");

  const issueRef = doc(db, "issues", issueId);
  const issueSnap = await getDoc(issueRef);

  if (!issueSnap.exists()) throw new Error("Issue not found");

  const issue = issueSnap.data();

  if (issue.reporterId !== currentUser.id) {
    const projectSnap = await getDoc(doc(db, "projects", issue.projectId));
    const project = projectSnap.data();

    if (!project.adminIds?.includes(currentUser.id)) {
      throw new Error("You don't have permission to delete this issue");
    }
  }

  await deleteDoc(issueRef);
  return { success: true };
};

export const updateIssue = async (issueId, updates, currentOrgId) => {
  if (updates.status && !Object.values(IssueStatus).includes(updates.status)) {
    throw new Error(`Invalid issue status: ${updates.status}`);
  }

  if (updates.priority && !Object.values(IssuePriority).includes(updates.priority)) {
    throw new Error(`Invalid issue priority: ${updates.priority}`);
  }

  const issueRef = doc(db, "issues", issueId);
  const issueSnap = await getDoc(issueRef);

  if (!issueSnap.exists()) throw new Error("Issue not found");

  const issue = issueSnap.data();

  const projectSnap = await getDoc(doc(db, "projects", issue.projectId));
  const project = projectSnap.data();

  if (project.organizationId !== currentOrgId) {
    throw new Error("Unauthorized");
  }

  await updateDoc(issueRef, {
    ...updates,
    updatedAt: new Date(),
  });

  const updated = await getDoc(issueRef);
  return { id: updated.id, ...updated.data() };
};
