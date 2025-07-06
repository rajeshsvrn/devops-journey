// MongoDB initialization script for Docker
print('🚀 Initializing DevOps Journey database...');

// Switch to application database
db = db.getSiblingDB('devops-journey');

// Create application user
db.createUser({
    user: 'devops-user',
    pwd: 'devops-password',
    roles: [
        {
            role: 'readWrite',
            db: 'devops-journey'
        }
    ]
});

// Create collections and indexes
print('📊 Creating indexes...');

// Users collection indexes
db.users.createIndex({ "username": 1 }, { unique: true, name: "username_unique" });
db.users.createIndex({ "email": 1 }, { unique: true, name: "email_unique" });
db.users.createIndex({ "createdAt": 1 }, { name: "created_at_index" });

// Insert application metadata
db.app_info.insertOne({
    name: 'DevOps Journey',
    version: '1.0.0',
    environment: 'docker',
    initialized: new Date(),
    description: 'DevOps Journey application running in Docker containers'
});

print('✅ Database initialization completed!');