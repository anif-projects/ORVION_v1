module = {
  apps: [
    {
      name: 'lms-backend',
      script: './server/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
    },
  ],
};
