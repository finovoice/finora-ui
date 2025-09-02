# Recreate Figma UI

*Automatically synced with your [v0.dev](https://v0.dev) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/samirs-projects-e75afdc6/v0-recreate-figma-ui)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/fsJjXaw7C8r)

## Overview



This repository will stay in sync with your deployed chats on [v0.dev](https://v0.dev).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.dev](https://v0.dev).

## Deployment

Your project is live at:

**[https://vercel.com/samirs-projects-e75afdc6/v0-recreate-figma-ui](https://vercel.com/samirs-projects-e75afdc6/v0-recreate-figma-ui)**

## Build your app

Continue building your app on:

**[https://v0.dev/chat/projects/fsJjXaw7C8r](https://v0.dev/chat/projects/fsJjXaw7C8r)**

## How It Works

1. Create and modify your project using [v0.dev](https://v0.dev)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository


## Local Development
To run this project locally, follow these steps:

1. After cloning the repository, run `yarn` to install dependencies.
2. Start the development server with `yarn run dev`.
3. Open your browser and navigate to `http://localhost:3000` to view the app.

### Node version and engines
This project depends on react-pdf, which in turn uses pdfjs-dist with strict Node engine requirements in recent versions. To ensure installs work even on older Node 20.x (e.g., v20.0.0), the repository includes a `.yarnrc` with `ignore-engines true` for Yarn v1. If you are using Yarn v1 (1.22.x), this will bypass engine checks during `yarn install`.

- Recommended: use Node >= 20.16.0 or >= 22.3.0 for full compatibility.
- If you prefer enforcing engines, remove the `.yarnrc` setting and upgrade your Node version accordingly.

### .env
Create a `.env` file in the root directory of your project and add the following environment variables:

```plaintext
NEXT_PUBLIC_BACKEND_URL="https://finora-backend-2zxw.onrender.com"
```