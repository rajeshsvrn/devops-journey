#!/bin/bash

echo "🌱 Seeding database with sample data..."

mongosh devops-journey --eval "
// Clear existing data
print('🧹 Clearing existing data...');
db.users.deleteMany({});

print('🌱 Creating sample users...');

// Note: Passwords will be hashed by the application
// These are just for demonstration - use the app to register users
db.app_info.insertOne({
    name: 'DevOps Journey',
    version: '1.0.0',
    environment: 'development',
    seeded: new Date(),
    description: 'Sample data for DevOps Journey application'
});

print('✅ Database seeded successfully!');
print('📝 Note: Use the application to register users - passwords need to be properly hashed.');
"

chmod +x scripts/*.sh