'use server';
import {auth ,db} from '@/firebase/admin'
import { cookies } from "next/headers";

const ONE_WEEK = 60 * 60 * 24 * 7; // 7 days

export async function signUp(params: SignUpParams) {
  const { uid, name, email } = params;
  try {
    const userRecord = await db.collection('user').doc(uid).get();

    if (userRecord.exists) {
      return {
        success: false,
        message: "User already exists. Please sign in instead."
      };
    }

    // Write new user to Firestore
    await db.collection('user').doc(uid).set({
      name,
      email
    });

    return {
      success: true,
      message: "Account created successfully. Please sign in."
    };

  } catch (e: any) {
    console.log('Error creating a user:', e);

    if (e.code === 'auth/email-already-exists') {
      return {
        success: false,
        message: 'This email is already in use.'
      };
    }

    return {
      success: false,
      message: "Failed to create an account."
    };
  }
}

export async function signIn(params: SignInParams) {
  const { email, idToken } = params;

  try {
    const userRecord = await auth.getUserByEmail(email);
    if (!userRecord) {
      return {
        success: false,
        message: "User does not exist. Please create an account instead."
      };
    }

    await setSessionCookie(idToken);

    return {
      success: true,
      message: "Signed in successfully."
    };

  } catch (e: any) {
    console.log('Error during sign-in:', e);
    return {
      success: false,
      message: "Failed to login into account."
    };
  }
}

export async function setSessionCookie(idToken: string) {
  const cookieStore =  cookies();

  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: ONE_WEEK * 1000, // Must be in milliseconds
  });

  (cookieStore as any).set?.('session', sessionCookie, {
  maxAge: ONE_WEEK,
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  sameSite: 'lax'
});
}

export async function getCurrentUser(): Promise<User|null> {

      const cookieStore = await  cookies()
      const sessionCookie = cookieStore.get('session')?.value

      if(!sessionCookie)return null;

      try {
            const decodedClaims = await auth.verifySessionCookie(sessionCookie)
            const userRecord = await db.collection('users').doc(decodedClaims.uid).get()
            if(!userRecord.exists) return null;

            return{
               ...userRecord.data(),
                id : userRecord.id
            }as User;

      } catch (e : any) {
          console.log(e)
          return null ;
      }

}

export async function isAuthenticated (){
      const user = await getCurrentUser();
      return !!user; 

} 