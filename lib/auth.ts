import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export async function getUserFromRequest() {
  try {
    const { userId } = await auth();
    return userId;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export async function requireAuth() {
  const { userId } = await auth();
  if (!userId) {
    redirect('/login');
  }
  return userId;
}

export async function isAuthenticated() {
  const { userId } = await auth();
  return !!userId;
}
