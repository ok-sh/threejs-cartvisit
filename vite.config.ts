import { defineConfig } from 'vite';

// Determine the base dynamically
const isGitHubPages = process.env.DEPLOY_ENV === 'github';

export default defineConfig({
  base: isGitHubPages ? '/threejs-cartvisit/' : '/',
});
