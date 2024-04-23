// File: pages/api/auth/[...nextauth]/route.ts

import { authOptions } from "@/utils/authOptions";
import NextAuth from "next-auth/next";

export default NextAuth(authOptions);
