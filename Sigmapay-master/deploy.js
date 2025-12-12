import ghpages from 'gh-pages';
import path from 'path';
import { fileURLToPath } from 'url';

// Define the repository URL
const repoUrl = 'https://github.com/Ammar-Ma-Eid/Sigmapay.git';

// Options for deployment
const options = {
  repo: repoUrl,
  branch: 'gh-pages',
  message: 'Auto-generated deployment to GitHub Pages',
  dotfiles: true, // Include .nojekyll file
};

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the build directory
const distPath = path.join(__dirname, 'dist');

console.log(`Deploying from ${distPath} to ${options.repo} (${options.branch} branch)...`);

// Deploy using gh-pages
ghpages.publish(distPath, options, function (err) {
  if (err) {
    console.error('Deployment error:', err);
    process.exit(1);
  } else {
    console.log('Deployment successful!');
    console.log('Your site should be available at: https://ammar-ma-eid.github.io/Sigmapay/');
  }
});
