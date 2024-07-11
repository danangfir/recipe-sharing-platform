import withPlugins from 'next-compose-plugins';
import withTM from 'next-transpile-modules';

const nextConfig = {
  reactStrictMode: true,
  // konfigurasi lainnya
};

export default withPlugins([withTM(['three'])], nextConfig);
