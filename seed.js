const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
});

async function seed() {
    try {
        console.log('🌱 Starting seed process...');

        // 1. Clear existing data (in reverse order of dependencies)
        console.log('🗑️  Clearing existing data...');
        await sequelize.query('TRUNCATE TABLE uploads RESTART IDENTITY CASCADE;');
        await sequelize.query('TRUNCATE TABLE order_logistics RESTART IDENTITY CASCADE;');
        await sequelize.query('TRUNCATE TABLE order_production RESTART IDENTITY CASCADE;');
        await sequelize.query('TRUNCATE TABLE order_planning RESTART IDENTITY CASCADE;');
        await sequelize.query('TRUNCATE TABLE items RESTART IDENTITY CASCADE;');
        await sequelize.query('TRUNCATE TABLE addresses RESTART IDENTITY CASCADE;');
        await sequelize.query('TRUNCATE TABLE customers RESTART IDENTITY CASCADE;');
        await sequelize.query('TRUNCATE TABLE vendors RESTART IDENTITY CASCADE;');
        await sequelize.query('TRUNCATE TABLE item_categories RESTART IDENTITY CASCADE;');

        // 2. Insert Categories
        console.log('📦 Inserting categories...');
        await sequelize.query(`
      INSERT INTO item_categories (name, created_at, updated_at) VALUES
      ('Furniture', NOW(), NOW()),
      ('Lighting', NOW(), NOW()),
      ('Decorative', NOW(), NOW()),
      ('Textiles', NOW(), NOW()),
      ('Electronics', NOW(), NOW());
    `);

        // 3. Insert Vendors
        console.log('🏢 Inserting vendors...');
        await sequelize.query(`
      INSERT INTO vendors (vendor_name, created_at, updated_at) VALUES
      ('ACME Corporation', NOW(), NOW()),
      ('Global Supplies Ltd', NOW(), NOW()),
      ('Premium Goods Inc', NOW(), NOW());
    `);

        // 4. Insert Customers
        console.log('👥 Inserting customers...');
        await sequelize.query(`
      INSERT INTO customers (name, created_at, updated_at) VALUES
      ('Luxury Hotel Group', NOW(), NOW()),
      ('Grand Resort & Spa', NOW(), NOW()),
      ('Elite Properties LLC', NOW(), NOW());
    `);

        // 5. Insert Addresses
        console.log('📍 Inserting addresses...');
        await sequelize.query(`
      INSERT INTO addresses (title, address, type, reference_id, created_at, updated_at) VALUES
      -- Vendor Addresses
      ('Main Office', '123 Business Ave, NY', 'vendor', 1, NOW(), NOW()),
      ('Warehouse - East Coast', '456 Industrial Blvd, NJ', 'vendor', 1, NOW(), NOW()),
      ('Head Office', '789 Trade St, CA', 'vendor', 2, NOW(), NOW()),
      ('Distribution Center', '321 Logistics Rd, TX', 'vendor', 2, NOW(), NOW()),
      ('Corporate HQ', '555 Commerce Dr, IL', 'vendor', 3, NOW(), NOW()),
      ('Factory Outlet', '777 Manufacturing Way, OH', 'vendor', 3, NOW(), NOW()),
      
      -- Customer Addresses
      ('Main Lobby', '100 Luxury Lane, Beverly Hills, CA 90210', 'customer', 1, NOW(), NOW()),
      ('Guest Suites', '100 Luxury Lane, Beverly Hills, CA 90210', 'customer', 1, NOW(), NOW()),
      ('Reception', '200 Ocean Drive, Miami, FL 33139', 'customer', 2, NOW(), NOW()),
      ('Spa Building', '200 Ocean Drive, Miami, FL 33139', 'customer', 2, NOW(), NOW()),
      ('Penthouse Floors', '300 Park Avenue, New York, NY 10022', 'customer', 3, NOW(), NOW()),
      ('Conference Center', '300 Park Avenue, New York, NY 10022', 'customer', 3, NOW(), NOW());
    `);

        // 6. Insert Items
        console.log('🛍️  Inserting items...');
        await sequelize.query(`
      INSERT INTO items (
        spec_no, item_name, description, category_id, unit_type, notes,
        location, ship_from, unit_price, markup_percentage, total_price,
        quantity, vendor_id, vendor_address_id, customer_id, customer_address_id,
        phase, upload, created_at, updated_at
      ) VALUES
      (
        'SOFA-001', 'Leather Sofa', 'Premium Italian leather 3-seater', 1, 'each', 'Handle with care',
        'Warehouse A', 'New York', 150000, 25.00, 187500,
        50, 1, 2, 1, 7,
        0, NULL, NOW(), NOW()
      ),
      (
        'LAMP-001', 'Crystal Chandelier', 'Handcrafted crystal chandelier', 2, 'each', 'Fragile - Special packaging required',
        'Warehouse B', 'Los Angeles', 75000, 30.00, 97500,
        25, 2, 3, 1, 8,
        1, NULL, NOW(), NOW()
      ),
      (
        'ART-001', 'Modern Canvas Print', 'Limited edition abstract art', 3, 'piece', 'Signed by artist',
        'Gallery Storage', 'San Francisco', 35000, 40.00, 49000,
        100, 3, 5, 2, 9,
        1, NULL, NOW(), NOW()
      ),
      (
        'RUG-001', 'Persian Rug', 'Hand-woven wool rug 8x10', 4, 'each', 'Professional cleaning recommended',
        'Warehouse C', 'Dallas', 200000, 20.00, 240000,
        30, 2, 4, 2, 10,
        2, NULL, NOW(), NOW()
      ),
      (
        'TV-001', 'Smart TV 75"', '4K OLED display with smart features', 5, 'each', 'Wall mount included',
        'Electronics Hub', 'Seattle', 120000, 15.00, 138000,
        75, 1, 1, 3, 11,
        2, NULL, NOW(), NOW()
      ),
      (
        'CURT-001', 'Blackout Curtains', 'Thermal insulated blackout curtains', 4, 'pair', NULL,
        'Warehouse A', 'Chicago', 18000, 30.00, 23400,
        100, 1, 2, 2, 9,
        2, NULL, NOW(), NOW()
      );
    `);

        // 7. Insert Order Planning
        console.log('📋 Inserting order planning...');
        await sequelize.query(`
      INSERT INTO order_planning (
        item_id, sample_approved_date, pi_send_date, pi_approved_date, initial_payment_date,
        created_at, updated_at
      ) VALUES
      (1, '2025-01-15', '2025-01-20', '2025-01-25', '2025-01-30', NOW(), NOW()),
      (2, '2025-02-01', '2025-02-05', '2025-02-10', '2025-02-15', NOW(), NOW()),
      (3, '2025-02-20', '2025-02-25', '2025-03-01', '2025-03-05', NOW(), NOW());
    `);

        // 8. Insert Order Production
        console.log('🏭 Inserting order production...');
        await sequelize.query(`
      INSERT INTO order_production (
        item_id, cfa_shops_send, cfa_shops_approved, cfa_shops_delivered,
        created_at, updated_at
      ) VALUES
      (2, '2025-03-01', '2025-03-10', '2025-03-20', NOW(), NOW()),
      (3, '2025-03-15', '2025-03-25', '2025-04-05', NOW(), NOW()),
      (4, '2025-04-01', '2025-04-10', '2025-04-20', NOW(), NOW());
    `);

        // 9. Insert Order Logistics
        console.log('🚚 Inserting order logistics...');
        await sequelize.query(`
      INSERT INTO order_logistics (
        item_id, ordered_date, shipped_date, delivered_date, shipping_notes,
        created_at, updated_at
      ) VALUES
      (4, '2025-05-01', '2025-05-10', '2025-05-20', 'Express shipping required', NOW(), NOW()),
      (5, '2025-05-15', '2025-05-25', '2025-06-05', 'Standard shipping', NOW(), NOW()),
      (6, '2025-06-01', '2025-06-10', NULL, 'In transit', NOW(), NOW());
    `);

        // 10. Insert Uploads
        console.log('📎 Inserting uploads...');
        await sequelize.query(`
      INSERT INTO uploads (item_id, name, url, created_at, updated_at) VALUES
      (1, 'sofa-image-1.jpg', 'https://example.com/uploads/sofa-1.jpg', NOW(), NOW()),
      (1, 'sofa-image-2.jpg', 'https://example.com/uploads/sofa-2.jpg', NOW(), NOW()),
      (2, 'chandelier-specs.pdf', 'https://example.com/uploads/chandelier-specs.pdf', NOW(), NOW()),
      (3, 'art-certificate.pdf', 'https://example.com/uploads/art-cert.pdf', NOW(), NOW()),
      (4, 'rug-pattern.jpg', 'https://example.com/uploads/rug-pattern.jpg', NOW(), NOW()),
      (5, 'tv-manual.pdf', 'https://example.com/uploads/tv-manual.pdf', NOW(), NOW());
    `);

        console.log('✅ Seed completed successfully!');
        console.log('📊 Summary:');
        console.log('   - 5 Categories');
        console.log('   - 3 Vendors');
        console.log('   - 3 Customers');
        console.log('   - 12 Addresses (6 vendor + 6 customer)');
        console.log('   - 6 Items');
        console.log('   - 3 Order Planning records');
        console.log('   - 3 Order Production records');
        console.log('   - 3 Order Logistics records');
        console.log('   - 6 Upload records');

    } catch (error) {
        console.error('❌ Seed failed:', error);
        throw error;
    } finally {
        await sequelize.close();
    }
}

seed();