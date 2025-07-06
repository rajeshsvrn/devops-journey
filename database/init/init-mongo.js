// MongoDB initialization script
print('Starting database initialization...');

// Switch to our application database
db = db.getSiblingDB('devops-journey');

// Create a collection and insert a sample document to ensure database creation
db.app_info.insertOne({
  name: 'DevOps Journey',
  version: '1.0.0',
  initialized: new Date(),
  description: 'A comprehensive DevOps learning application'
});

// Create indexes for better performance
print('Creating indexes...');

// User collection indexes
db.users.createIndex({ "username": 1 }, { unique: true, name: "username_unique" });
db.users.createIndex({ "email": 1 }, { unique: true, name: "email_unique" });
db.users.createIndex({ "createdAt": 1 }, { name: "created_at_index" });
db.users.createIndex({ "lastLogin": 1 }, { name: "last_login_index" });

print('Database initialization completed successfully!');
print('Created database: devops-journey');
print('Created indexes for users collection');