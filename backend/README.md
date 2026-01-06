# Backend (Urban Move)

## API versioning

- Primary mount: `/api/v1/...`.
- Legacy mounts kept temporarily: `/api/...` and bare `/auth`, `/cars`, etc. (served by the same v1 router). Plan to deprecate these once clients are moved.
- Add future versions by registering `/api/v2/...`.

## Current structure (module-first)

- `src/api/index.js` mounts `/api/v1` (and legacy `/api` + `/`) via `src/api/v1/routes/index.js`.
- Domain modules now live in `src/modules/{admin,cars,drivers,rides,schedules,location,tracking,messaging,feedback,payments,users}` with `routes/` and `controllers/` moved from the old `api/v1` tree.
- Shared pieces stay in `src/models`, `src/middlewares`, `src/utils`, `src/config`, `src/sockets`.
- Models/services are still shared; they can be pushed into modules later if desired.

```
backend/
  src/
    api/
      index.js              # mounts v1/v2 routers
      v1/routes/index.js    # v1 router composition

    modules/
      admin/ (routes/, controllers/)
      cars/  (routes/, controllers/)
      drivers/ (routes/, controllers/)
      rides/ (routes/, controllers/)
      schedules/ (routes/, controllers/)
      location/ (routes/, controllers/)
      tracking/ (routes/, controllers/)
      messaging/ (routes/)
      feedback/ (routes/, controllers/)
      payments/ (routes/)
      users/ (routes/, controllers/)

    middlewares/
    models/
    utils/

    config/
      env.js
      db.js
      passport.js
      passportDriver.js

    jobs/                  # cron/scheduled work
    sockets/

    app.js                 # express app wiring
    server.js              # process bootstrap (db, jobs, sockets)
```

This keeps API surface (routing) thin and pushes logic into domain modules.
