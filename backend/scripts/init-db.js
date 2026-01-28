const db = require('../config/database');

async function initDb() {
    try {
        console.log('🚀 Iniciando creación de tablas en PostgreSQL...');

        // Tabla de Usuarios
        const hasUsersTable = await db.schema.hasTable('users');
        if (!hasUsersTable) {
            await db.schema.createTable('users', (table) => {
                table.increments('id').primary();
                table.string('username', 50).unique().notNullable();
                table.string('email', 100).unique().notNullable();
                table.text('password').notNullable();
                table.string('role', 20).defaultTo('admin');
                table.timestamp('last_login');
                table.boolean('active').defaultTo(true);
                table.timestamp('created_at').defaultTo(db.fn.now());
            });
            console.log('✅ Tabla "users" creada.');
        } else {
            console.log('ℹ️ Tabla "users" ya existe.');
        }

        // Tabla de Mensajes
        const hasMessagesTable = await db.schema.hasTable('messages');
        if (!hasMessagesTable) {
            await db.schema.createTable('messages', (table) => {
                table.increments('id').primary();
                table.string('name', 100).notNullable();
                table.text('email').notNullable(); // Encriptado
                table.text('phone');              // Encriptado
                table.text('message').notNullable(); // Encriptado
                table.text('ip_address');
                table.text('user_agent');
                table.boolean('read').defaultTo(false);
                table.boolean('starred').defaultTo(false);
                table.specificType('tags', 'text[]'); // Array de strings en Postgres
                table.timestamp('created_at').defaultTo(db.fn.now());
            });
            console.log('✅ Tabla "messages" creada.');

            // Índices
            await db.raw('CREATE INDEX idx_messages_created_at ON messages(created_at DESC)');
            await db.raw('CREATE INDEX idx_messages_read ON messages(read)');
        } else {
            console.log('ℹ️ Tabla "messages" ya existe.');
        }

        console.log('✨ Base de datos inicializada correctamente.');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error inicializando la base de datos:', err);
        process.exit(1);
    }
}

initDb();
