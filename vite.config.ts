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
    rollupOptions: {
      input: {
        main: 'index.html'
      },
      output: {
        assetFileNames: (assetInfo) => {
          if (!assetInfo.name) return 'assets/[name]-[hash].[ext]';
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/\.(gltf|bin)$/.test(assetInfo.name)) {
            return `assets/models/robot/[name].[ext]`;
          }
          return `assets/[name]-[hash].[ext]`;
        }
      }
    }
  },
  publicDir: 'public'
});
