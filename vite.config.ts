import { defineConfig } from 'vite';

console.log('process.env.DEPLOY_ENV', process.env.DEPLOY_ENV);
// Determine the base dynamically
const isGitHubPages = process.env.DEPLOY_ENV === 'github';
const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
  base: isGitHubPages ? '/threejs-cartvisit/' : isProduction ? '/' : '/',
  build: {
    assetsDir: 'assets',
    copyPublicDir: true,
  }
});
