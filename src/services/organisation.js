import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";

export async function saveOrganizationIfNotExists(clerkOrg, currentUserId) {
  if (!clerkOrg || !currentUserId) {
    console.warn("❌ Missing Clerk org or user ID");
    return;
  }

  const orgRef = doc(db, "organizations", clerkOrg.id);
  const existing = await getDoc(orgRef);

  if (!existing.exists()) {
    const newOrgData = {
      id: clerkOrg.id,
      name: clerkOrg.name,
      slug: clerkOrg.slug,
      members: [currentUserId],
      createdAt: new Date(),
    };

    try {
      await setDoc(orgRef, newOrgData);
      
    } catch (err) {
      console.error("Firestore write failed:", err);
    }
  } else {
    console.log("ℹOrganization already exists in Firestore.");
  }
}


export async function getOrganization(slug, currentUserId) {
  const q = query(collection(db, "organizations"), where("slug", "==", slug));
  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  const organization = snapshot.docs[0];
  const data = organization.data();

  if (!data.members.includes(currentUserId)) {
    return null;
  }

  return { id: organization.id, ...data };
}

export async function getProjects(orgId) {
  const q = query(
    collection(db, "projects"),
    where("organizationId", "==", orgId),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function getUserIssues(userId, orgId) {
  const q = query(
    collection(db, "issues"),
    where("project.organizationId", "==", orgId)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .filter(
      (issue) => issue.assigneeId === userId || issue.reporterId === userId
    );
}

export async function getOrganizationUsers(orgId) {
  const orgRef = doc(db, "organizations", orgId);
  const orgSnap = await getDoc(orgRef);
  if (!orgSnap.exists()) return [];

  const { members } = orgSnap.data();

  const q = query(collection(db, "users"), where("clerkUserId", "in", members));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}
