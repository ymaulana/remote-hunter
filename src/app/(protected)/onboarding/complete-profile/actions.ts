"use server"

import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { z } from "zod"
import { PrismaClient } from "@/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"

const connectionString = process.env.DIRECT_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const profileSchema = z.object({
    role: z.enum(["SEEKER", "RECRUITER"]),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    companyName: z.string().min(1, "Company name is required").optional(),
    companyWebsite: z.string().url("Please enter a valid URL").optional(),
}).refine(data => {
    if (data.role === "RECRUITER" && !data.companyName) {
        return false
    }
    return true
}, {
    message: "Company name is required for recruiters",
    path: ["companyName"]
})

export async function completeProfile(prevState: any, formData: FormData) {
    const supabase = await createClient()

    // Verify the user is actually signed in
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
        return { success: false, error: "Not authenticated" }
    }

    // Parse the form data
    const role = formData.get("role") as string
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const companyName = formData.get("companyName") as string
    const companyWebsite = formData.get("companyWebsite") as string

    const validatedFields = profileSchema.safeParse({
        role,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        companyName: companyName || undefined,
        companyWebsite: companyWebsite || undefined,
    })

    // Return early if the form data is invalid
    if (!validatedFields.success) {
        return {
            success: false,
            error: "Invalid fields",
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    const result = validatedFields.data

    try {
        // 1. Update the Supabase Auth user_metadata with the role
        const { error: updateError } = await supabase.auth.updateUser({
            data: {
                role: result.role,
            }
        })

        if (updateError) throw updateError

        // 2. Check if user already exists in Prisma
        const existingUser = await prisma.user.findUnique({
            where: { id: user.id },
            include: { profile: true },
        })

        if (existingUser) {
            // User already exists (from form registration), just update the role
            await prisma.user.update({
                where: { id: user.id },
                data: { role: result.role },
            })
        } else {
            // OAuth user - create new User and Profile records
            // Extract name from user_metadata (Google provides full_name, given_name, family_name)
            const fullName = user.user_metadata?.full_name || ""
            const givenName = user.user_metadata?.given_name || ""
            const familyName = user.user_metadata?.family_name || ""

            // Parse name - try full_name first, then fall back to given_name/family_name
            let firstName = givenName
            let lastName = familyName

            if (fullName && !firstName) {
                const nameParts = fullName.split(" ")
                firstName = nameParts[0] || ""
                lastName = nameParts.slice(1).join(" ") || ""
            }

            // Create user in Prisma database
            await prisma.user.create({
                data: {
                    id: user.id,
                    email: user.email!,
                    role: result.role,
                    profile: {
                        create: {
                            firstName: firstName || "User",
                            lastName: lastName || "",
                            companyName: result.role === "RECRUITER" ? companyName : undefined,
                            companyWebsite: result.role === "RECRUITER" ? companyWebsite : undefined,
                        },
                    },
                },
            })
        }

    } catch (err) {
        console.error("Failed to update profile", err)
        return { success: false, error: "Failed to update profile. Please try again." }
    }

    // 3. Revalidate and redirect
    // After picking a role, redirect to the exact routes specified:
    if (result.role === "SEEKER") {
        redirect("/jobs")
    } else {
        redirect("/hire")
    }
}
