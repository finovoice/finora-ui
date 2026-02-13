# Finora UI


## Overview
This repository contains the source code for **Finora UI** — a project that recreates a Figma-based UI with modern frontend tooling. 
It is structured for easy local development and smooth deployment in any CI/CD pipeline.

---

## Repository
📂 GitHub: [samirpatil2000/finora-ui](https://github.com/samirpatil2000/finora-ui)

---

## Deployment
Your project is live at: 
👉 **https://finora-ui.vercel.app/**

---

## How It Works
1. Develop and test the project locally. 
2. Create a new branch for your feature/fix.
3. Commit and push changes to your branch.
4. Raise a Pull Request (PR) for code review.
---

## Local Development
To run this project locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/samirpatil2000/finora-ui.git
   cd finora-ui
   ```

2. Install dependencies:
   ```bash
   yarn
   ```

3. Start the development server:
   ```bash
   yarn run dev
   ```

4. Open your browser and go to **http://localhost:3000**

---

## Node Version and Engines
This project depends on **react-pdf**, which uses **pdfjs-dist** with strict Node.js engine requirements in recent versions.

- Recommended Node versions:
  - **>= 20.16.0**
  - **>= 22.3.0**

A `.yarnrc` file is included with:
```plaintext
ignore-engines true
```
This allows Yarn v1 (1.22.x) to bypass strict engine checks. 
If you prefer enforcing engine requirements, remove this setting and upgrade Node accordingly.

---

## Environment Variables
Create a `.env` file in the project root and configure the following:

```plaintext
NEXT_PUBLIC_BACKEND_URL="https://finora-backend-2zxw.onrender.com"
```

---
