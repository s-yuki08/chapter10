import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Supabase Storage の画像を next/image で表示できるようにする
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pnzlmirenjwlcmdrjivn.supabase.co",
        pathname: "/storage/v1/object/public/post_thumbnail/**",
      },
    ],
  },
};

export default nextConfig;
