# Deployment Guide

This guide will help you deploy your Snake Game to GitHub Pages with automatic CI/CD.

## Prerequisites

- A GitHub account
- Git installed on your local machine
- Node.js and npm installed

## Step-by-Step Deployment

### 1. Create a GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it something like `snake-game-javascript`
3. Make it public (required for free GitHub Pages)
4. Don't initialize with README, .gitignore, or license (we already have these)

### 2. Initialize Git and Push Your Code

```bash
# Initialize git repository
git init

# Add all files
git add .

# Make your first commit
git commit -m "Initial commit: Snake game with CI/CD setup"

# Add your GitHub repository as origin (replace with your actual repo URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git push -u origin main
```

### 3. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings** tab
3. Scroll down to **Pages** section in the left sidebar
4. Under **Source**, select **GitHub Actions**
5. Save the settings

### 4. Update README URLs

Edit the `README.md` file and replace:
- `YOUR_USERNAME` with your GitHub username
- `YOUR_REPO_NAME` with your repository name

### 5. Push the Updated README

```bash
git add README.md
git commit -m "Update README with correct repository URLs"
git push
```

## What Happens Next

1. **Automatic Testing**: Every push and pull request will trigger the CI pipeline
2. **Automatic Deployment**: When you push to the main branch, the game will be automatically deployed to GitHub Pages
3. **Live URL**: Your game will be available at `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

## CI/CD Pipeline Features

- ✅ **Automated Testing**: Runs all unit tests on every push
- ✅ **Build Verification**: Ensures the project builds successfully
- ✅ **Automatic Deployment**: Deploys to GitHub Pages on successful builds
- ✅ **Cross-platform**: Tests run on Ubuntu latest
- ✅ **Dependency Caching**: Faster builds with npm cache

## Making Changes

1. Make your changes locally
2. Test them: `npm test`
3. Build to verify: `npm run build`
4. Commit and push:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push
   ```
5. The CI/CD pipeline will automatically test and deploy your changes

## Monitoring Deployments

- Check the **Actions** tab in your GitHub repository to see build status
- Green checkmarks ✅ mean successful deployments
- Red X marks ❌ indicate failed builds (check logs for details)

## Troubleshooting

### Build Fails
- Check the Actions tab for error logs
- Ensure all tests pass locally: `npm test`
- Verify build works locally: `npm run build`

### Deployment Issues
- Ensure GitHub Pages is set to "GitHub Actions" source
- Check that the repository is public
- Verify the workflow file is in `.github/workflows/ci-cd.yml`

### Game Not Loading
- Check browser console for errors
- Ensure all assets are properly referenced with relative paths
- Verify the build output in the `dist/` folder

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Preview production build
npm run preview
```

Your Snake Game is now ready for the world! 🐍🎮