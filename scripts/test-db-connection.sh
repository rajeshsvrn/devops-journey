#!/bin/bash

echo "🔍 Testing database connection..."

# Test MongoDB connection
mongosh --eval "
try {
    db.adminCommand('ping');
    print('✅ MongoDB connection successful!');
    
    // Switch to our app database
    use devops-journey;
    
    // Show existing collections
    print('📊 Existing collections:');
    db.getCollectionNames().forEach(collection => {
        print('  - ' + collection);
    });
    
    // Show user count if users collection exists
    if (db.users.countDocuments() > 0) {
        print('👥 Total users: ' + db.users.countDocuments());
    } else {
        print('👥 No users found (database is empty)');
    }
    
} catch (error) {
    print('❌ MongoDB connection failed: ' + error);
    quit(1);
}
" --quiet