import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/character-sheet',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
