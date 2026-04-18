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

// Enhanced function to get full user data from Clerk
export async function getFullUserData() {
  try {
    const { userId, sessionClaims } = await auth();
    
    if (!userId) {
      return null;
    }

    // Get additional user data from session claims
    return {
      userId,
      email: sessionClaims?.email || null,
      firstName: sessionClaims?.firstName || null,
      lastName: sessionClaims?.lastName || null,
      fullName: sessionClaims?.fullName || sessionClaims?.name || null,
      username: sessionClaims?.username || null,
      imageUrl: sessionClaims?.picture || sessionClaims?.image || null,
      sessionId: sessionClaims?.sid || null,
      // Session and auth context data
      sessionClaims: sessionClaims || {},
      // Additional claims that might be available
      emailVerified: sessionClaims?.email_verified || false,
      iss: sessionClaims?.iss || null,
      aud: sessionClaims?.aud || null,
      exp: sessionClaims?.exp || null,
      iat: sessionClaims?.iat || null,
      nbf: sessionClaims?.nbf || null,
      sub: sessionClaims?.sub || null,
      // Authentication method and provider info
      azp: sessionClaims?.azp || null, // Authorized party
      nonce: sessionClaims?.nonce || null,
      authTime: sessionClaims?.auth_time || null,
      // Store the raw claims for future use
      rawClaims: sessionClaims,
    };
  } catch (error) {
    console.error('Error getting full user data:', error);
    return null;
  }
}
