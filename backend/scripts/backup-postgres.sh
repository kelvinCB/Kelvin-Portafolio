#!/bin/bash

# Script de Backup para PostgreSQL en el VPS de Contabo
# Uso: ./backup-postgres.sh

# Configuración
BACKUP_DIR="/home/kelvin/backups/postgresql"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DB_NAME="portfolio_db"
DB_USER="kelvin_user"
RETENTION_DAYS=7

# Crear directorio de backups si no existe
mkdir -p $BACKUP_DIR

# Archivo de salida
BACKUP_FILE="$BACKUP_DIR/backup-$DB_NAME-$TIMESTAMP.sql"

echo "🚀 Iniciando backup de la base de datos $DB_NAME..."

# Realizar el dump de la base de datos
# Nota: PGDATABASE, PGUSER, PGPASSWORD deben estar configurados o usar ~/.pgpass
# Por simplicidad en esta guía, asumimos que el usuario tiene permisos o .pgpass configurado
pg_dump -U $DB_USER $DB_NAME > $BACKUP_FILE

# Comprimir el backup
gzip $BACKUP_FILE

echo "✅ Backup completado: $BACKUP_FILE.gz"

# Eliminar backups antiguos (más de 7 días)
find $BACKUP_DIR -name "backup-$DB_NAME-*.sql.gz" -mtime +$RETENTION_DAYS -delete

echo "🧹 Backups antiguos eliminados (Retención: $RETENTION_DAYS días)"
