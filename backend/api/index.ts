// Serverless entry point for Vercel.
// Imports the already-compiled Express app (backend/dist) created by `npm run build`.
// Vercel runs the build before packaging this function, so ../dist/server.js exists.
import app from '../dist/server.js'

export default app
