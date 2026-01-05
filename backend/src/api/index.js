import createV1Router from "./v1/routes/index.js";

const registerApiRoutes = (app) => {
  const v1Router = createV1Router();

  // Primary, versioned mount
  app.use("/api/v1", v1Router);

  // Legacy mounts for existing clients (to be deprecated once callers switch to /api/v1)
  app.use("/api", v1Router);
  app.use("/", v1Router);

  // TODO: add v2 routing when implemented (e.g. `app.use('/api/v2', createV2Router())`).
};

export default registerApiRoutes;
