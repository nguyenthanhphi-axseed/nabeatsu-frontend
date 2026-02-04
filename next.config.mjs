/** @type {import('next').NextConfig} */
const nextConfig = {
  // Nếu bạn cần cấu hình LIFF hoặc cho phép ảnh từ nguồn ngoài, viết vào đây
  reactStrictMode: true,
  /* images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.onrender.com', // Cho phép ảnh từ Render
      },
    ],
  },
  */
};

export default nextConfig;