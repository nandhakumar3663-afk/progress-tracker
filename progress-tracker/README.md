# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Progress Tracker Live Storage

This app saves shared progress data to Firebase Firestore instead of browser local storage.

### Local setup

```bash
npm install
npm run dev
```

### Firebase setup

1. Create a Firebase project.
2. Create a Firestore database.
3. Add a Firebase web app and copy the project id and web API key.
4. Add these environment variables in Vercel and in a local `.env` file when developing:

```bash
VITE_FIREBASE_PROJECT_ID=your-firebase-project-id
VITE_FIREBASE_API_KEY=your-firebase-web-api-key
```

5. Use Firestore rules that allow the app to read and write the `progress` collection.

For a simple class project without real authentication, you can start with:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /progress/{userId} {
      allow read: if true;
      allow write: if request.resource.data.userId == userId;
    }
  }
}
```

This keeps progress in Firebase, so changes are visible to everyone using the live website. Because this app currently logs in only by roll number, anyone who knows a roll number can update that student's progress. Add Firebase Authentication before using it for sensitive data.
