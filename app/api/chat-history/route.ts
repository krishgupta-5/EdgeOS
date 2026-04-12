import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/firebase-admin";

export async function GET(req: Request) {
  try {
    // Authentication check
    const { userId } = await auth();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Get sessionId from query params
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json({ error: "sessionId is required" }, { status: 400 });
    }

    // Get messages from Firestore (no orderBy to avoid index requirement)
    const messagesSnapshot = await db
      .collection("sessions")
      .doc(sessionId)
      .collection("messages")
      .get();

    // Convert to array and sort by createdAt in JavaScript
    const messages = messagesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date()
    }));

    // Sort by createdAt ascending (oldest first)
    messages.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

    return NextResponse.json({ messages });

  } catch (error) {
    console.error("Failed to load chat history:", error);
    return NextResponse.json(
      { error: "Failed to load chat history" },
      { status: 500 }
    );
  }
}
