import { db } from '../config/database';

async function testConnection() {
  try {
    console.log('🔍 Testing database connection...');
    await db.initialize();
    console.log('✅ Database connected successfully');
    
    console.log('🔍 Testing query...');
    const result = await db.query('SELECT version()');
    console.log('✅ Query successful:', result);
    
    await db.destroy();
    console.log('✅ Connection closed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

testConnection();