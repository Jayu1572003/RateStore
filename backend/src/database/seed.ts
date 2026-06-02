import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';
import { User, UserRole } from '../users/user.entity';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);
  const userRepository = dataSource.getRepository(User);

  const adminEmail = 'admin@example.com';
  const existingAdmin = await userRepository.findOne({ where: { email: adminEmail } });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    const admin = userRepository.create({
      name: 'System Administrator Account',
      email: adminEmail,
      password: hashedPassword,
      address: '123 Admin Street, System City, Country',
      role: UserRole.ADMIN,
    });
    await userRepository.save(admin);
    console.log('Seed complete');
  } else {
    console.log('Admin already exists. Seed skipped.');
  }

  await app.close();
}

bootstrap().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
