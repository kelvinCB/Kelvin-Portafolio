# VPS Backend Maintenance & Monitoring Guide

This guide ensures your backend remains active and healthy on the Contabo VPS.

## 🚀 Quick Check: Is the backend running?

1. **Connect to the Server**:
   ```bash
   ssh kelvin@86.48.24.125
   ```

2. **Navigate to the Project Folder**:
   ```bash
   cd ~/portfolio-kelvin
   ```

3. **Check Status with PM2**:
   Run this command to see the status of the application:
   ```bash
   pm2 status
   ```

You should see `portfolio-backend` (or your app name) with a green **online** status.

---

## 🛠️ Essential Management Commands

### Performance Management (PM2)
PM2 is the process manager that keeps the app alive after crashes or reboots.
# Delete this

- **Restart the app**: `pm2 restart portfolio-backend`
- **View live logs**: `pm2 logs portfolio-backend`
- **Stop the app**: `pm2 stop portfolio-backend`
- **Update environment variables**: After editing `.env`, run `pm2 restart portfolio-backend --update-env`

### Database Management (PostgreSQL)
We moved from MongoDB to PostgreSQL for better performance and control.

- **Log in to PostgreSQL**:
   ```bash
   sudo -u postgres psql -d portfolio_db
   ```
   *(Exit with `\q`)*

- **📖 See Full Schema**: Check `docs/DATABASE_SCHEMA.md` for table definitions.

#### Query Cheat Sheet (Run inside `psql` shell)

**Messages**:
- **See last 10 messages**:
  ```sql
  SELECT id, name, created_at, read FROM messages ORDER BY created_at DESC LIMIT 10;
  ```
- **Read full content of a specific message (e.g., ID 1)**:
  ```sql
  SELECT message FROM messages WHERE id = 1;
  ```
- **Count unread messages**:
  ```sql
  SELECT COUNT(*) FROM messages WHERE read = false;
  ```

**Users**:
- **List admin users**:
  ```sql
  SELECT id, username, email, last_login FROM users;
  ```

- **Check Table Sizes**: `\dt+`

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
