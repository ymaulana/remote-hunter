import { NextResponse } from "next/server";
import { getJson } from "serpapi";
import { PrismaClient } from "@/generated/prisma/client";
import { JobSource } from "@/generated/prisma/enums";

import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { parseRelativeDate } from "@/lib/date-utils";
import { cleanTags, extractKeywords } from "@/lib/tag-utils";
import { detectCurrency } from "@/lib/currency-utils";

const connectionString = process.env.DIRECT_URL;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });


export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const authHeader = request.headers.get("authorization");

    // Optional: Verify Cron Secret if set
    if (
        process.env.CRON_SECRET &&
        authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const apiKey = process.env.SERPAPI_KEY;
    if (!apiKey) {
        return NextResponse.json(
            { error: "SERPAPI_KEY is not set" },
            { status: 500 }
        );
    }

    try {
        const query = searchParams.get("q") || "remote developer";
        const gl = searchParams.get("gl") || "us";

        // We wrap getJson in a promise because it uses a callback style or we can use the async version if available, 
        // but the standard serpapi package uses callbacks or returned promises depending on version. 
        // Let's assume standard usage.
        const response = await new Promise<any>((resolve, reject) => {
            getJson(
                {
                    engine: "google_jobs",
                    q: query,
                    api_key: apiKey,
                    hl: "en",
                    gl: gl,
                },
                (json) => {
                    if (json["error"]) {
                        reject(json["error"]);
                    } else {
                        resolve(json);
                    }
                }
            );
        });

        const jobs = response["jobs_results"] || [];
        let createdCount = 0;

        for (const job of jobs) {
            // Basic mapping - adjust fields based on actual SerpApi response and your schema
            // SerpApi 'google_jobs' results usually have: title, company_name, location, description, via_extensions, etc.

            const externalId = job.job_id; // Unique ID from Google
            const title = job.title;
            const company = job.company_name;
            const location = job.location;
            const description = job.description;
            // externalLink is the link to the job listing from Serpapi response "apply_options > links"
            const externalLink = job.apply_options?.[0]?.link || job.share_link;
            const applyOptions = job.apply_options;

            // Tag Processing
            const rawTags = job.extensions || [];
            const cleanedTags = cleanTags(rawTags);
            const extractedTags = extractKeywords(description + " " + title); // Search in title too

            // Merge and deduplicate
            const tags = Array.from(new Set([...cleanedTags, ...extractedTags]));

            // Find posting date
            let postedAt = new Date();

            // Try detected_extensions first (more reliable)
            if (job.detected_extensions?.posted_at) {
                postedAt = parseRelativeDate(job.detected_extensions.posted_at);
            } else if (job.extensions) {
                // Fallback to scanning extensions for "ago"
                for (const ext of job.extensions) {
                    if (ext.includes("ago")) {
                        postedAt = parseRelativeDate(ext);
                        break;
                    }
                }
            }

            // Capture salary string directly from SerpApi
            const salary = job.detected_extensions?.salary || null;

            // Detect currency from salary, description, and extensions
            const currency = detectCurrency(salary, description, job.extensions);

            // Skip if essential info is missing
            if (!title || !company || !externalId) continue;

            // Upsert to avoid duplicates using externalId
            await prisma.job.upsert({
                where: { externalId: externalId },
                update: {
                    title,
                    company,
                    location,
                    description: description || "No description provided",
                    externalLink,
                    applyOptions: applyOptions || undefined,
                    salary,
                    currency,
                    tags,
                    postedAt,
                    updatedAt: new Date(),
                },
                create: {
                    title,
                    company,
                    location,
                    description: description || "No description provided",
                    source: JobSource.EXTERNAL,
                    externalId,
                    externalLink,
                    applyOptions: applyOptions || undefined,
                    salary,
                    currency,
                    tags,
                    postedAt,
                }
            });

            createdCount++;
        }

        return NextResponse.json({
            success: true,
            message: `Fetched ${jobs.length} jobs, created ${createdCount} new jobs.`,
        });

    } catch (error: any) {
        console.error("Cron job error details:", error);

        let errorMessage = "Internal Server Error";
        if (typeof error === 'string') {
            errorMessage = error;
        } else if (error instanceof Error) {
            errorMessage = error.message;
        } else if (error && typeof error === 'object' && 'message' in error) {
            errorMessage = String(error.message);
        } else {
            errorMessage = String(error);
        }

        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}
