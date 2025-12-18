import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function runMigrations() {
  try {
    const { Sequelize } = await import('sequelize-typescript');
    const { databaseConfig } = await import('./config/database.config');

    // Import all models
    const { ItemCategory } =
      await import('./base/entities/item-category.entity');
    const { Item } = await import('./base/entities/item.entity');
    const { Vendor } = await import('./base/entities/vendor.entity');
    const { VendorAddress } =
      await import('./base/entities/vendor-address.entity');
    const { Customer } = await import('./base/entities/customer.entity');
    const { OrderItem } = await import('./base/entities/order-item.entity');
    const { OrderPlanning } =
      await import('./base/entities/order-planning.entity');
    const { OrderProduction } =
      await import('./base/entities/order-production.entity');
    const { OrderLogistics } =
      await import('./base/entities/order-logistics.entity');
    const { Upload } = await import('./base/entities/upload.entity');

    const sequelize = new Sequelize({
      ...databaseConfig,
      models: [
        ItemCategory,
        Item,
        Vendor,
        VendorAddress,
        Customer,
        OrderItem,
        OrderPlanning,
        OrderProduction,
        OrderLogistics,
        Upload,
      ],
    } as any);

    await sequelize.authenticate();
    console.log('✅ Database connected');

    await sequelize.sync({ alter: true });
    console.log('✅ Database migrated');

    await sequelize.close();
  } catch (error) {
    console.error('❌ Migration failed:', error);
    // Don't exit, let app start anyway
  }
}

async function bootstrap() {
  if (process.env.NODE_ENV === 'production') {
    await runMigrations();
  }

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: [
      'https://ux-kraft-frontend.vercel.app/',
      'http://localhost:8100',
      'http://localhost:4200',
      'http://localhost:5173',
      'http://localhost',
      'https://localhost',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  const config = new DocumentBuilder()
    .setTitle('UXKRAFT TASK')
    .setDescription('Api Documentation')
    .setVersion('1.0')
    .addTag('Categories', 'Category management endpoints')
    .addTag('Customers', 'Customer management endpoints')
    .addBearerAuth(
      {
        description: 'Please enter token in following format: Bearer <JWT>',
        name: 'Authorization',
        bearerFormat: 'Bearer',
        scheme: 'Bearer',
        type: 'http',
        in: 'Header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('port') || 3000;

  await app.listen(port, '0.0.0.0');

  console.log(`App is running on: http://localhost:${port}`);
  console.log(`Swagger is running on: http://localhost:${port}/api`);
}
bootstrap();
