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

    // Get user sessions from Firestore (no orderBy to avoid index requirement)
    const sessionsSnapshot = await db
      .collection("sessions")
      .where("userId", "==", userId)
      .get();

    const sessions = await Promise.all(
      sessionsSnapshot.docs.map(async (doc) => {
        const sessionId = doc.id;
        const sessionData = doc.data();
        
        // Get all user messages for this session (no orderBy to avoid index requirement)
        const userMessagesSnapshot = await db
          .collection("sessions")
          .doc(sessionId)
          .collection("messages")
          .where("role", "==", "user")
          .get();

        // Get total message count (including both user and assistant)
        const allMessagesSnapshot = await db
          .collection("sessions")
          .doc(sessionId)
          .collection("messages")
          .get();

        // Find the last user message by sorting in JavaScript
        const userMessages = userMessagesSnapshot.docs.map(doc => ({
          content: doc.data().content,
          createdAt: doc.data().createdAt?.toDate() || new Date()
        }));
        
        userMessages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        const lastUserMessage = userMessages[0]?.content;

        return {
          sessionId,
          updatedAt: sessionData.updatedAt?.toDate() || new Date(),
          messageCount: allMessagesSnapshot.size,
          lastMessage: lastUserMessage
        };
      })
    );

    // Sort sessions by updatedAt in descending order (most recent first)
    sessions.sort((a, b) => {
      const dateA = a.updatedAt instanceof Date ? a.updatedAt.getTime() : new Date(a.updatedAt).getTime();
      const dateB = b.updatedAt instanceof Date ? b.updatedAt.getTime() : new Date(b.updatedAt).getTime();
      return dateB - dateA;
    });

    return NextResponse.json({ sessions });

  } catch (error) {
    console.error("Failed to load user sessions:", error);
    return NextResponse.json(
      { error: "Failed to load user sessions" },
      { status: 500 }
    );
  }
}
