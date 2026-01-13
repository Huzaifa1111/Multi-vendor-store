import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../modules/users/user.entity';
import { UserRole } from '../../modules/users/user.entity';

async function seedAdmin() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'admin',
    database: 'store_db',
    entities: [User],
    synchronize: false, // Important: false for seeds
  });

  await dataSource.initialize();
  console.log('✅ Database connected');

  const userRepository = dataSource.getRepository(User);

  // Check if admin exists
  const existingAdmin = await userRepository.findOne({
    where: { email: 'admin@store.com' },
  });

  if (existingAdmin) {
    console.log('⚠️ Admin already exists, updating...');
    existingAdmin.name = 'Admin User';
    existingAdmin.password = await bcrypt.hash('Admin@123', 10);
    existingAdmin.role = UserRole.ADMIN;
    await userRepository.save(existingAdmin);
    console.log('✅ Admin updated');
  } else {
    // Create new admin
    const adminUser = userRepository.create({
      name: 'Admin User',
      email: 'admin@store.com',
      password: await bcrypt.hash('Admin@123', 10),
      role: UserRole.ADMIN,
    });

    await userRepository.save(adminUser);
    console.log('✅ Admin created');
  }

  console.log('👑 Admin credentials:');
  console.log('📧 Email: admin@store.com');
  console.log('🔑 Password: Admin@123');
  console.log('👥 Role: admin');

  await dataSource.destroy();
}

seedAdmin().catch(console.error);