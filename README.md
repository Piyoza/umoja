# 🚀 Junior Astronaut Mission Trainer

**One repository. One shared codebase. One team. One mission.**

## 1. Project Overview

Junior Astronaut Mission Trainer is an interactive educational application designed to help learners explore space, understand the solar system, complete astronaut missions, and develop scientific decision-making skills.

The application is being migrated from Base44 into an independent application using React, TanStack, Firebase, and modern web technologies.

**Original application:** https://shiny-astro-mission-lab.base44.app

### Main Features

- Interactive astronaut mission simulations.
- Solar system exploration.
- Planet comparison and gravity exploration.
- Planetary surface and landing activities.
- Learning academy and educational lessons.
- User progress tracking.
- Achievements and rewards.
- User registration and authentication.
- Astra AI educational assistant.
- Administrative dashboard.

## 2. Technology Stack

| Technology | Purpose |
|---|---|
| React 19 | Frontend |
| TanStack Router | Routing |
| TanStack Start | Application framework |
| TanStack Query | Server-state management |
| Firebase Authentication | User authentication |
| Cloud Firestore | Database |
| Firebase Cloud Functions | Backend operations |
| Three.js | 3D visualisations |
| Tailwind CSS | Styling |
| Recharts | Charts |
| Lucide React | Icons |
| Vite | Development tooling |
| Zod | Data validation |

## 3. Development Requirements

Every team member must install:

- Node.js 24 or a compatible supported version.
- npm.
- Git.
- Visual Studio Code.
- Access to the shared GitHub repository.
- Access to the project's Firebase configuration when required.

Check your versions:

```cmd
node -v
npm -v
git --version
```

## 4. Repository Structure

The planned application structure:

```text
junior-astronaut/
├── public/
├── src/
│   ├── routes/
│   ├── components/
│   │   ├── layout/
│   │   ├── dashboard/
│   │   ├── simulator/
│   │   ├── solar/
│   │   ├── astra/
│   │   ├── auth/
│   │   └── ui/
│   ├── lib/
│   │   ├── simulation/
│   │   ├── AuthContext.jsx
│   │   ├── progress.js
│   │   ├── solar-data.js
│   │   ├── academy-data.js
│   │   └── achievements.js
│   ├── hooks/
│   └── api/
├── functions/
├── firebase.json
├── firestore.rules
├── firestore.indexes.json
├── package.json
├── package-lock.json
├── README.md
└── .gitignore
```

The final structure will follow the original Base44 application to preserve existing functionality.

## 5. Installation Guide

Follow these steps when setting up the project for the first time.

### Step 1: Clone the shared GitHub repository

```cmd
git clone YOUR_GITHUB_REPOSITORY_URL
```

Enter the project folder:

```cmd
cd junior-astronaut
```

### Step 2: Install all project dependencies

The preferred command for team members is:

```cmd
npm install
```

This reads `package.json` and installs the required packages using the committed `package-lock.json`.

### Step 3: Core application dependencies

The following packages are part of the current installed application environment:

```cmd
npm install react@19.1.0 react-dom@19.1.0 @tanstack/react-router@1.170.33 @tanstack/react-start@1.168.60 @tanstack/react-query@5.102.0 @tanstack/react-router-ssr-query@1.167.3 three@0.171.0 lucide-react@0.475.0 recharts@2.15.4 clsx@2.1.1 tailwind-merge@3.7.0 class-variance-authority@0.7.1 tailwindcss-animate@1.0.7 zod@4.6.7 sonner@2.0.1
```

### Step 4: UI dependencies

```cmd
npm install @radix-ui/react-accordion @radix-ui/react-alert-dialog @radix-ui/react-aspect-ratio @radix-ui/react-avatar @radix-ui/react-checkbox @radix-ui/react-collapsible @radix-ui/react-context-menu @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-hover-card @radix-ui/react-label @radix-ui/react-menubar @radix-ui/react-navigation-menu @radix-ui/react-popover @radix-ui/react-progress @radix-ui/react-radio-group @radix-ui/react-scroll-area @radix-ui/react-select @radix-ui/react-separator @radix-ui/react-slider @radix-ui/react-slot @radix-ui/react-switch @radix-ui/react-tabs @radix-ui/react-toast @radix-ui/react-toggle @radix-ui/react-toggle-group @radix-ui/react-tooltip vaul cmdk embla-carousel-react input-otp react-day-picker react-resizable-panels next-themes react-hook-form @hookform/resolvers
```

Install only the Radix packages actually imported by the retained UI components.

### Step 5: Development dependencies

```cmd
npm install -D vite@8.2.4 @vitejs/plugin-react@6.0.5 tailwindcss@3.4.17 postcss@8.5.3 autoprefixer@10.4.20 eslint@9 @eslint/js@9 eslint-plugin-react-hooks globals
```

### Step 6: Verify installation

```cmd
npm list --depth=0
```

All required packages should appear without dependency errors.

**Important:** The dependency versions above document the current development setup. The committed `package-lock.json` should be the source of truth for reproducible installations. Do not independently upgrade packages without discussing the change with the team.

## 6. Firebase Configuration

Firebase will provide the independent backend.

### Planned Firestore collections

| Collection | Purpose |
|---|---|
| users | User profiles and preferences |
| simulation_attempts | Mission results |
| exploration_progress | Exploration records |
| lesson_progress | Lesson completion |
| achievements | Unlocked achievements |

### Security requirements

- Users may only access their own records.
- Admin access must be role-authorised.
- Backend functions must validate user permissions.
- Achievement awards must be validated server-side.
- AI credentials must never be exposed in frontend code.
- Never commit private Firebase credentials.

Firebase configuration will be added when the backend migration begins.

## 7. Environment Variables

Create a `.env.local` file in the root directory when Firebase configuration is available.

Example:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_APP_ID=
```

Only public Firebase web configuration belongs in frontend environment variables. Private API keys, service-account credentials, and AI provider secrets must remain server-side.

Never commit `.env.local` to GitHub.

## 8. Running the Application

Once the application configuration and scripts have been created:

```cmd
npm run dev
```

Open the local development URL displayed in the terminal.

The actual development and build scripts will be documented after the TanStack Start configuration is established.

## 9. Team GitHub Collaboration

The entire application will be maintained in **one shared GitHub repository**.

### Branch naming

```text
main
feature/feature-name
fix/issue-name
docs/documentation-name
refactor/component-name
```

### Team workflow

**1. Pull the latest changes**

```cmd
git checkout main
git pull origin main
```

**2. Create a feature branch**

```cmd
git checkout -b feature/your-feature-name
```

**3. Make your changes**

Only modify files related to your assigned task.

**4. Review changes**

```cmd
git status
git diff
```

**5. Commit changes**

```cmd
git add .
git commit -m "Describe your changes"
```

**6. Push your branch**

```cmd
git push -u origin feature/your-feature-name
```

**7. Create a Pull Request**

Open GitHub and submit a Pull Request into `main`.

A team member must review and approve changes before merging.

### Collaboration rules

1. Never work directly on `main`.
2. Always pull before starting a new task.
3. Use feature branches.
4. Avoid editing the same files as another developer without communicating.
5. Test changes before submitting Pull Requests.
6. Never commit secrets or credentials.
7. Do not remove existing functionality without approval.
8. Keep commits clear and descriptive.

## 10. Suggested Team Responsibilities

| Team area | Responsibilities |
|---|---|
| Project Lead | Coordination and architecture |
| Frontend | React pages and UI |
| Simulation | Mission engine and scenarios |
| Solar System | Planet data and exploration |
| Backend | Firebase and Cloud Functions |
| Authentication | Registration, login and security |
| AI Integration | Astra assistant |
| Testing | Quality assurance and bug reports |

Responsibilities can be adjusted according to team size.

## 11. Base44 Migration Plan

The migration will take place in stages.

1. Collect the original Base44 source files.
2. Recreate the original application structure.
3. Configure project routing and build tools.
4. Migrate existing UI components and pages.
5. Preserve simulation and educational logic.
6. Replace Base44 authentication with Firebase Authentication.
7. Replace Base44 data operations with Firestore.
8. Implement secure backend functions.
9. Migrate Astra AI functionality.
10. Test existing features and prepare deployment.

**Migration principle:** Preserve existing functionality. Do not rebuild working features unnecessarily.

## 12. Project Progress

- [x] Initial project folder created.
- [x] Core dependencies installed.
- [x] Development dependencies installed.
- [x] Node.js environment verified.
- [x ] GitHub repository connected.
- [ x] Original Base44 source code migrated.
- [ ] Application configuration completed.
- [ ] Firebase project configured.
- [ ] Firestore security rules configured.
- [ ] Authentication migrated.
- [ ] Backend functions implemented.
- [x ] AI functionality migrated.
- [ ] Application tested.
- [ ] Independent deployment completed.

## 13. Important Git Files

The repository must include:

- `package.json`
- `package-lock.json`
- `README.md`
- `.gitignore`
- Application source code
- Firebase rules and configuration when available

The repository must exclude:

- `node_modules/`
- `.env`
- `.env.local`
- Firebase service-account private keys
- Private API credentials
- Build output

## 14. Project Goal

To create a fully independent, secure, maintainable, and collaborative Junior Astronaut Mission Trainer application while preserving the educational experience and functionality of the original Base44 application.

**One repository. One shared codebase. One team. One mission.** 🚀

Repository: `YOUR_GITHUB_REPOSITORY_URL`
