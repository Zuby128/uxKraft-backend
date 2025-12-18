const { Sequelize } = require('sequelize-typescript');

async function seed() {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
        console.error('DATABASE_URL not found');
        process.exit(1);
    }

    try {
        const url = new URL(databaseUrl);

        const sequelize = new Sequelize({
            dialect: 'postgres',
            host: url.hostname,
            port: parseInt(url.port, 10) || 5432,
            username: url.username,
            password: url.password,
            database: url.pathname.slice(1),
            dialectOptions: {
                ssl: {
                    require: true,
                    rejectUnauthorized: false,
                },
            },
            logging: console.log,
        });

        await sequelize.authenticate();
        console.log('✅ Database connected\n');

        // Categories
        console.log('🌱 Seeding categories...');
        await sequelize.query(`
      INSERT INTO item_categories (name, created_at, updated_at) 
      VALUES 
        ('Furniture', NOW(), NOW()),
        ('Lighting', NOW(), NOW()),
        ('Decor', NOW(), NOW()),
        ('Textiles', NOW(), NOW()),
        ('Artwork', NOW(), NOW()),
        ('Office Equipment', NOW(), NOW()),
        ('Kitchen & Dining', NOW(), NOW()),
        ('Outdoor', NOW(), NOW())
      ON CONFLICT (name) DO NOTHING;
    `);
        console.log('✅ Seeded categories\n');

        // Vendors
        console.log('🌱 Seeding vendors...');
        await sequelize.query(`
      INSERT INTO vendors (vendor_name, created_at, updated_at) 
      VALUES 
        ('ACME Corporation', NOW(), NOW()),
        ('Global Furniture Ltd', NOW(), NOW()),
        ('Premium Decor Inc', NOW(), NOW()),
        ('Modern Living Co', NOW(), NOW()),
        ('Classic Interiors', NOW(), NOW()),
        ('Urban Design Group', NOW(), NOW())
      ON CONFLICT (vendor_name) DO NOTHING;
    `);
        console.log('✅ Seeded vendors\n');

        // Customers
        console.log('🌱 Seeding customers...');
        await sequelize.query(`
      INSERT INTO customers (name, address, created_at, updated_at) 
      VALUES 
        ('Hotel California', '1 Beach Road, Los Angeles, CA 90001', NOW(), NOW()),
        ('Grand Resort & Spa', '200 Ocean Drive, Miami, FL 33139', NOW(), NOW()),
        ('Downtown Business Center', '500 5th Avenue, New York, NY 10110', NOW(), NOW()),
        ('Luxury Suites Hotel', '100 Park Lane, Chicago, IL 60601', NOW(), NOW()),
        ('Seaside Inn', '75 Coastal Highway, San Diego, CA 92101', NOW(), NOW())
      ON CONFLICT DO NOTHING;
    `);
        console.log('✅ Seeded customers\n');

        console.log('🎉 ✅ Basic seed data completed successfully!');
        console.log('📝 Note: Items, orders, and relations can be added via API\n');

        await sequelize.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Seed failed:', error.message);
        process.exit(1);
    }
}

seed();