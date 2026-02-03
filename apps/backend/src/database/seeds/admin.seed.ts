import 'dotenv/config';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../modules/users/user.entity';

export async function seedAdmin(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);

  const adminExists = await userRepository.findOne({
    where: { email: 'admin@store.com' },
  });

  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('Admin@123', 10);

    const admin = userRepository.create({
      name: 'Admin User',
      email: 'admin@store.com',
      password: hashedPassword,
      role: 'admin',
      isEmailVerified: true,
    });

    await userRepository.save(admin);
    console.log('✅ Admin user created successfully');

    console.log('\n👑 Admin credentials:');
    console.log('📧 Email: admin@store.com');
    console.log('🔑 Password: Admin@123');
    console.log('👥 Role: admin');
  } else {
    console.log('⚠️ Admin user already exists');
  }
}

// If you need a standalone script, add this:
if (require.main === module) {
  const dataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'store_db',
    entities: [User],
    synchronize: true,
  });

  dataSource.initialize()
    .then(() => {
      console.log('✅ Data Source has been initialized!');
      return seedAdmin(dataSource);
    })
    .then(() => {
      console.log('✅ Seed completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seed failed:', error);
      process.exit(1);
    });
}