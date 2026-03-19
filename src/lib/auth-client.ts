// import { createAuthClient } from "better-auth/react";

// export const authClient = createAuthClient({
//   baseURL: process.env.NEXT_PUBLIC_APP_URL,
//   user: {
//     additionalFields: {
//       role: { type: "string" },
//     },
//   },
// });

// export const { signIn, signUp, useSession, signOut } = authClient;

import { createAuthClient } from "better-auth/react";

export interface LyveraUser {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  role: "user" | "admin";
}

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  user: {
    additionalFields: {
      role: { type: "string" },
    },
  },
});

export const { signIn, signUp, signOut } = authClient;

// The "Unknown Bridge" fix
export const useSession = () => {
  const session = authClient.useSession();

  return {
    ...session,
    data: session.data
      ? {
          ...session.data,
          // We cast to unknown first, then to our LyveraUser
          user: session.data.user as unknown as LyveraUser,
        }
      : null,
  };
};
