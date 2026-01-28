module.exports = {
  apps: [{
    name: 'portfolio-kelvin',
    script: './index.js',
    cwd: '/home/kelvin/portfolio-kelvin/backend',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: '/home/kelvin/logs/backend-error.log',
    out_file: '/home/kelvin/logs/backend-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    max_memory_restart: '1G',
    watch: false
  }]
};
