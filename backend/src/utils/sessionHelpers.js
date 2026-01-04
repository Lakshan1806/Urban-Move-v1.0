export const saveToSession = (session, key, value) => {
  session[key] = value;
  return new Promise((resolve, reject) => {
    session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

export const clearFromSession = (session, key) => {
  if (session[key]) {
    delete session[key];
    return new Promise((resolve, reject) => {
      session.save((err) => {
        if (err) {
          console.error("Session save error:", err);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
  return Promise.resolve();
};

export const getFromSession = (session, key, defaultValue = null) => {
  return session[key] || defaultValue;
};
