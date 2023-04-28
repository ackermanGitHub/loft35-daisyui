/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
import million from 'million/compiler';
!process.env.SKIP_ENV_VALIDATION && (await import('./src/env.mjs'));

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,

  /**
   * If you have the "experimental: { appDir: true }" setting enabled, then you
   * must comment the below `i18n` config out.
   *
   * experimental: {
   *   runtime: "experimental-edge"
   * }
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
  images: {
    loader: 'custom',
    loaderFile: './src/utils/superbase-image-loader.ts',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        port: '',
        pathname: '/**',
      },
    ],
  },
};
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export default million.next(config);
