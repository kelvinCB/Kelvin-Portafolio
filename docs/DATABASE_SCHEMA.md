# Database Schema Documentation

## Overview
This document outlines the database schema for the Portfolio Backend (`portfolio_db`). The database is **PostgreSQL**.

### 🔐 Security Note
Sensitive fields in the `messages` table (email, phone, message) are encrypted at the application level before being stored. You will see encrypted strings if you query the database directly without decryption.

---

##  Tables

### 1. `messages`
Stores contact form submissions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `INTEGER` | `PRIMARY KEY`, `AUTO_INCREMENT` | Unique identifier |
| `name` | `VARCHAR(100)` | `NOT NULL` | Sender's name |
| `email` | `TEXT` | `NOT NULL` | **Encrypted** sender email |
| `phone` | `TEXT` | | **Encrypted** phone number (optional) |
| `message` | `TEXT` | `NOT NULL` | **Encrypted** message content |
| `ip_address` | `TEXT` | | Sender's IP address |
| `user_agent` | `TEXT` | | Browser/Device info |
| `read` | `BOOLEAN` | `DEFAULT false` | Has the message been read by admin? |
| `starred` | `BOOLEAN` | `DEFAULT false` | Is the message marked as important? |
| `tags` | `TEXT[]` | | Array of tags for categorization |
| `created_at` | `TIMESTAMP` | `DEFAULT NOW()` | Timestamp of creation |

**Indexes:**
- `idx_messages_created_at` on `created_at DESC`
- `idx_messages_read` on `read`

---

### 2. `users`
Stores admin users for the dashboard.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `INTEGER` | `PRIMARY KEY`, `AUTO_INCREMENT` | Unique identifier |
| `username` | `VARCHAR(50)` | `UNIQUE`, `NOT NULL` | Admin username |
| `email` | `VARCHAR(100)` | `UNIQUE`, `NOT NULL` | Admin email |
| `password` | `TEXT` | `NOT NULL` | Hashed password (bcrypt) |
| `role` | `VARCHAR(20)` | `DEFAULT 'admin'` | User role |
| `last_login` | `TIMESTAMP` | | Last successful login |
| `active` | `BOOLEAN` | `DEFAULT true` | Is the account active? |
| `created_at` | `TIMESTAMP` | `DEFAULT NOW()` | Timestamp of creation |

---

## 🛠️ Common SQL Queries

Use these queries after connecting to the database via:
```bash
sudo -u postgres psql -d portfolio_db
```

### Messages

**View last 10 messages (encrypted):**
```sql
SELECT id, name, created_at, read FROM messages ORDER BY created_at DESC LIMIT 10;
```

**Count unread messages:**
```sql
SELECT COUNT(*) FROM messages WHERE read = false;
```

**Mark all messages as read:**
```sql
UPDATE messages SET read = true WHERE read = false;
```

**Delete old messages (older than 1 year):**
```sql
DELETE FROM messages WHERE created_at < NOW() - INTERVAL '1 year';
```

### Users

**List active admins:**
```sql
SELECT id, username, email, last_login FROM users WHERE active = true;
```
