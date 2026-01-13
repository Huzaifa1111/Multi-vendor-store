const bcrypt = require('bcrypt');
const { DataSource } = require('typeorm');

// Database configuration - update with your settings
const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "store_db",
  entities: ["src/**/*.entity.ts"],
  synchronize: true,
});

async function createAdminUser() {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connected');
    
    const userRepository = AppDataSource.getRepository('User');
    
    // Check if admin already exists
    const adminExists = await userRepository.findOne({
      where: { email: 'admin@store.com' }
    });
    
    if (adminExists) {
      console.log('ℹ️ Admin user already exists');
      console.log('Email:', adminExists.email);
      console.log('Role:', adminExists.role);
    } else {
      // Create admin user
      const hashedPassword = await bcrypt.hash('Admin@123', 10);
      
      const admin = userRepository.create({
        email: 'admin@store.com',
        name: 'Admin User',
        password: hashedPassword,
        role: 'admin',
      });
      
      await userRepository.save(admin);
      console.log('✅ Admin user created successfully');
      console.log('Email:', admin.email);
      console.log('Password:', 'Admin@123');
      console.log('Role:', admin.role);
    }
    
    // List all users
    const allUsers = await userRepository.find();
    console.log('\n📋 All users in database:');
    allUsers.forEach(user => {
      console.log(`- ${user.email} (${user.name}) - Role: ${user.role}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await AppDataSource.destroy();
  }
}

createAdminUser();