# VPS Backend Maintenance & Monitoring Guide

This guide ensures your backend remains active and healthy on the Contabo VPS.

## 🚀 Quick Check: Is the backend running?

Run this command from your terminal to see the status of the application:

```bash
pm2 status
```

You should see `portfolio-backend` (or your app name) with a green **online** status.

### Accessing the Server
```bash
ssh kelvin@86.48.24.125
```

---

## 🛠️ Essential Management Commands

### Performance Management (PM2)
PM2 is the process manager that keeps the app alive after crashes or reboots.

- **Restart the app**: `pm2 restart portfolio-backend`
- **View live logs**: `pm2 logs portfolio-backend`
- **Stop the app**: `pm2 stop portfolio-backend`
- **Update environment variables**: After editing `.env`, run `pm2 restart portfolio-backend --update-env`

### Database Management (PostgreSQL)
We moved from MongoDB to PostgreSQL for better performance and control.

- **Enter Database Console**: `sudo -u postgres psql -d portfolio_db`
- **Check Table Sizes**: `\dt+`
- **List last 5 messages**: `SELECT * FROM messages ORDER BY created_at DESC LIMIT 5;`

### Web Server (Nginx)
Nginx acts as the gatekeeper, routing traffic from port 80 (HTTP) to your Node.js app on port 5000.

- **Check Configuration Syntax**: `sudo nginx -t`
- **Restart Nginx**: `sudo systemctl restart nginx`
- **View Access Logs**: `sudo tail -f /var/log/nginx/access.log`

---

## 📦 Backups
Automated backups are configured via a script in `backend/scripts/backup-postgres.sh`.

- **Run manual backup**: `bash ~/portfolio-kelvin/backend/scripts/backup-postgres.sh`
- **Location of backups**: `~/backups/postgres/`

---

## 🚑 Troubleshooting

### 1. I get a "502 Bad Gateway"
This usually means Nginx is running but the Node.js app is stopped.
**Fix**: `pm2 restart portfolio-backend`

### 2. My changes in GitHub are not appearing
Go to the project folder on the VPS and pull the changes:
```bash
cd ~/portfolio-kelvin
git pull
pm2 restart portfolio-backend
```

### 3. The server rebooted and the app didn't start
**Fix**:
```bash
pm2 save
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u kelvin --hp /home/kelvin
```

---

## 📈 Monitoring Health Check
You can always check the health of the API from any browser:
**URL**: `http://86.48.24.125/api/health`

It should return:
```json
{ "status": "ok", "environment": "production" }
```
