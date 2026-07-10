"use server";

import { PrismaClient } from "@/generated/prisma/client";
import { createClient } from "@/utils/supabase/server";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DIRECT_URL;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });


export async function registerUser(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: "SEEKER" | "RECRUITER";
    companyName?: string;
    companyWebsite?: string;
}) {
    const supabase = await createClient();

    // 1. Create the user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
                role: data.role,
                companyName: data.companyName,
                companyWebsite: data.companyWebsite,
            },
        },
    });

    if (authError) {
        return { error: authError.message };
    }

    if (!authData.user) {
        return { error: "Failed to create user in authentication system." };
    }

    // 2. Immediately create the user in Prisma using the Supabase ID
    try {
        await prisma.user.create({
            data: {
                id: authData.user.id, // Critical: Link Prisma ID to Supabase ID
                email: data.email,
                role: data.role,
                profile: {
                    create: {
                        firstName: data.firstName,
                        lastName: data.lastName,
                        ...(data.role === "RECRUITER" && {
                            companyName: data.companyName,
                            companyWebsite: data.companyWebsite,
                        }),
                    },
                },
            },
        });

        return {
            success: true,
            requireEmailVerification: !authData.session,
            role: data.role
        };
    } catch (dbError) {
        console.error("Database error during registration:", dbError);
        // if DB creation fails, delete the Supabase user to maintain sync
        await supabase.auth.admin.deleteUser(authData.user.id);
        return { error: "Failed to sync user to database. Please contact support." };
    }
}
