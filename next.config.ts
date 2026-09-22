import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/dashboard/recruiter/jobs/new", destination: "/post-job", permanent: true },
      { source: "/dashboard/recruiter/jobs/:id/edit", destination: "/post-job/:id/edit", permanent: true },
    ];
  }
};

export default nextConfig;
