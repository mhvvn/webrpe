module.exports = {
  apps: [
    {
      name: 'rpe-smart-portal',
      script: './backend/server.cjs',
      instances: 'max', // Gunakan semua core CPU untuk performa maksimal
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
};
