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
        console.log('🌱 Starting complete seed process...');
        console.log('⚠️  This will reset the entire database structure and data!');

        // ============================================
        // STEP 1: DROP ALL TABLES
        // ============================================
        console.log('\n🗑️  Dropping all existing tables...');

        await sequelize.query('DROP TABLE IF EXISTS uploads CASCADE;');
        await sequelize.query('DROP TABLE IF EXISTS order_logistics CASCADE;');
        await sequelize.query('DROP TABLE IF EXISTS order_production CASCADE;');
        await sequelize.query('DROP TABLE IF EXISTS order_planning CASCADE;');
        await sequelize.query('DROP TABLE IF EXISTS items CASCADE;');
        await sequelize.query('DROP TABLE IF EXISTS addresses CASCADE;');
        await sequelize.query('DROP TABLE IF EXISTS customers CASCADE;');
        await sequelize.query('DROP TABLE IF EXISTS vendors CASCADE;');
        await sequelize.query('DROP TABLE IF EXISTS item_categories CASCADE;');

        console.log('✅ All tables dropped');

        // ============================================
        // STEP 2: CREATE ALL TABLES
        // ============================================
        console.log('\n🏗️  Creating all tables...');

        // Create item_categories table
        console.log('   Creating item_categories...');
        await sequelize.query(`
      CREATE TABLE item_categories (
        category_id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        deleted_at TIMESTAMP NULL
      );
    `);

        // Create vendors table
        console.log('   Creating vendors...');
        await sequelize.query(`
      CREATE TABLE vendors (
        vendor_id SERIAL PRIMARY KEY,
        vendor_name VARCHAR(100) NOT NULL UNIQUE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        deleted_at TIMESTAMP NULL
      );
      
      CREATE INDEX idx_vendors_name ON vendors(vendor_name);
    `);

        // Create customers table
        console.log('   Creating customers...');
        await sequelize.query(`
      CREATE TABLE customers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        deleted_at TIMESTAMP NULL
      );
    `);

        // Create addresses table
        console.log('   Creating addresses...');
        await sequelize.query(`
      CREATE TABLE addresses (
        address_id SERIAL PRIMARY KEY,
        title VARCHAR(255) NULL,
        address TEXT NOT NULL,
        type VARCHAR(50) NOT NULL,
        reference_id INTEGER NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        deleted_at TIMESTAMP NULL,
        CONSTRAINT chk_address_type CHECK (type IN ('vendor', 'customer'))
      );
      
      CREATE INDEX idx_address_type ON addresses(type);
      CREATE INDEX idx_address_reference ON addresses(type, reference_id);
    `);

        // Create items table
        console.log('   Creating items...');
        await sequelize.query(`
      CREATE TABLE items (
        item_id SERIAL PRIMARY KEY,
        spec_no VARCHAR(50) NOT NULL UNIQUE,
        item_name VARCHAR(100) NOT NULL,
        description TEXT NULL,
        category_id INTEGER NOT NULL,
        unit_type VARCHAR(20) NOT NULL DEFAULT 'each',
        notes TEXT NULL,
        location TEXT NULL,
        ship_from TEXT NULL,
        unit_price INTEGER NOT NULL,
        markup_percentage DECIMAL(5,2) NULL DEFAULT 0,
        total_price INTEGER NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 1,
        vendor_id INTEGER NULL,
        vendor_address_id INTEGER NULL,
        customer_id INTEGER NULL,
        customer_address_id INTEGER NULL,
        phase INTEGER NULL DEFAULT 0,
        upload TEXT[] NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        deleted_at TIMESTAMP NULL,
        
        CONSTRAINT fk_items_category FOREIGN KEY (category_id) 
          REFERENCES item_categories(category_id) ON DELETE RESTRICT,
        CONSTRAINT fk_items_vendor FOREIGN KEY (vendor_id) 
          REFERENCES vendors(vendor_id) ON DELETE SET NULL,
        CONSTRAINT fk_items_vendor_address FOREIGN KEY (vendor_address_id) 
          REFERENCES addresses(address_id) ON DELETE SET NULL,
        CONSTRAINT fk_items_customer FOREIGN KEY (customer_id) 
          REFERENCES customers(id) ON DELETE SET NULL,
        CONSTRAINT fk_items_customer_address FOREIGN KEY (customer_address_id) 
          REFERENCES addresses(address_id) ON DELETE SET NULL
      );
      
      CREATE UNIQUE INDEX idx_items_spec_no ON items(spec_no);
      CREATE INDEX idx_items_category ON items(category_id);
      CREATE INDEX idx_items_name ON items(item_name);
      CREATE INDEX idx_items_vendor ON items(vendor_id);
      CREATE INDEX idx_items_customer ON items(customer_id);
    `);

        // Create order_planning table
        console.log('   Creating order_planning...');
        await sequelize.query(`
      CREATE TABLE order_planning (
        planning_id SERIAL PRIMARY KEY,
        item_id INTEGER NOT NULL UNIQUE,
        sample_approved_date DATE NULL,
        pi_send_date DATE NULL,
        pi_approved_date DATE NULL,
        initial_payment_date DATE NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        deleted_at TIMESTAMP NULL,
        
        CONSTRAINT fk_order_planning_item FOREIGN KEY (item_id) 
          REFERENCES items(item_id) ON DELETE CASCADE
      );
    `);

        // Create order_production table
        console.log('   Creating order_production...');
        await sequelize.query(`
      CREATE TABLE order_production (
        production_id SERIAL PRIMARY KEY,
        item_id INTEGER NOT NULL UNIQUE,
        cfa_shops_send DATE NULL,
        cfa_shops_approved DATE NULL,
        cfa_shops_delivered DATE NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        deleted_at TIMESTAMP NULL,
        
        CONSTRAINT fk_order_production_item FOREIGN KEY (item_id) 
          REFERENCES items(item_id) ON DELETE CASCADE
      );
    `);

        // Create order_logistics table
        console.log('   Creating order_logistics...');
        await sequelize.query(`
      CREATE TABLE order_logistics (
        logistics_id SERIAL PRIMARY KEY,
        item_id INTEGER NOT NULL UNIQUE,
        ordered_date DATE NULL,
        shipped_date DATE NULL,
        delivered_date DATE NULL,
        shipping_notes TEXT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        deleted_at TIMESTAMP NULL,
        
        CONSTRAINT fk_order_logistics_item FOREIGN KEY (item_id) 
          REFERENCES items(item_id) ON DELETE CASCADE
      );
    `);

        // Create uploads table
        console.log('   Creating uploads...');
        await sequelize.query(`
      CREATE TABLE uploads (
        id SERIAL PRIMARY KEY,
        item_id INTEGER NULL,
        name TEXT NULL,
        url TEXT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        deleted_at TIMESTAMP NULL,
        
        CONSTRAINT fk_uploads_item FOREIGN KEY (item_id) 
          REFERENCES items(item_id) ON DELETE CASCADE
      );
    `);

        console.log('✅ All tables created successfully');

        // ============================================
        // STEP 3: INSERT SEED DATA
        // ============================================
        console.log('\n📝 Inserting seed data...');

        // Insert Categories
        console.log('   📦 Inserting categories...');
        await sequelize.query(`
      INSERT INTO item_categories (name, created_at, updated_at) VALUES
      ('Furniture', NOW(), NOW()),
      ('Lighting', NOW(), NOW()),
      ('Decorative', NOW(), NOW()),
      ('Textiles', NOW(), NOW()),
      ('Electronics', NOW(), NOW());
    `);

        // Insert Vendors
        console.log('   🏢 Inserting vendors...');
        await sequelize.query(`
      INSERT INTO vendors (vendor_name, created_at, updated_at) VALUES
      ('ACME Corporation', NOW(), NOW()),
      ('Global Supplies Ltd', NOW(), NOW()),
      ('Premium Goods Inc', NOW(), NOW());
    `);

        // Insert Customers
        console.log('   👥 Inserting customers...');
        await sequelize.query(`
      INSERT INTO customers (name, created_at, updated_at) VALUES
      ('Luxury Hotel Group', NOW(), NOW()),
      ('Grand Resort & Spa', NOW(), NOW()),
      ('Elite Properties LLC', NOW(), NOW());
    `);

        // Insert Addresses
        console.log('   📍 Inserting addresses...');
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

        // Insert Items
        console.log('   🛍️  Inserting items...');
        await sequelize.query(`
      INSERT INTO items (
        spec_no, item_name, description, category_id, unit_type, notes,
        location, ship_from, unit_price, markup_percentage, total_price,
        quantity, vendor_id, vendor_address_id, customer_id, customer_address_id,
        phase, created_at, updated_at
      ) VALUES
      (
        'SOFA-001', 'Leather Sofa', 'Premium Italian leather 3-seater', 1, 'each', 'Handle with care',
        'Warehouse A', 'New York', 150000, 25.00, 187500,
        50, 1, 2, 1, 7,
        0, NOW(), NOW()
      ),
      (
        'LAMP-001', 'Crystal Chandelier', 'Handcrafted crystal chandelier', 2, 'each', 'Fragile - Special packaging required',
        'Warehouse B', 'Los Angeles', 75000, 30.00, 97500,
        25, 2, 3, 1, 8,
        1, NOW(), NOW()
      ),
      (
        'ART-001', 'Modern Canvas Print', 'Limited edition abstract art', 3, 'piece', 'Signed by artist',
        'Gallery Storage', 'San Francisco', 35000, 40.00, 49000,
        100, 3, 5, 2, 9,
        1, NOW(), NOW()
      ),
      (
        'RUG-001', 'Persian Rug', 'Hand-woven wool rug 8x10', 4, 'each', 'Professional cleaning recommended',
        'Warehouse C', 'Dallas', 200000, 20.00, 240000,
        30, 2, 4, 2, 10,
        2, NOW(), NOW()
      ),
      (
        'TV-001', 'Smart TV 75"', '4K OLED display with smart features', 5, 'each', 'Wall mount included',
        'Electronics Hub', 'Seattle', 120000, 15.00, 138000,
        75, 1, 1, 3, 11,
        2, NOW(), NOW()
      ),
      (
        'CURT-001', 'Blackout Curtains', 'Thermal insulated blackout curtains', 4, 'pair', NULL,
        'Warehouse A', 'Chicago', 18000, 30.00, 23400,
        100, 1, 2, 2, 9,
        2, NOW(), NOW()
      );
    `);

        // Insert Order Planning
        console.log('   📋 Inserting order planning...');
        await sequelize.query(`
      INSERT INTO order_planning (
        item_id, sample_approved_date, pi_send_date, pi_approved_date, initial_payment_date,
        created_at, updated_at
      ) VALUES
      (1, '2025-01-15', '2025-01-20', '2025-01-25', '2025-01-30', NOW(), NOW()),
      (2, '2025-02-01', '2025-02-05', '2025-02-10', '2025-02-15', NOW(), NOW()),
      (3, '2025-02-20', '2025-02-25', '2025-03-01', '2025-03-05', NOW(), NOW());
    `);

        // Insert Order Production
        console.log('   🏭 Inserting order production...');
        await sequelize.query(`
      INSERT INTO order_production (
        item_id, cfa_shops_send, cfa_shops_approved, cfa_shops_delivered,
        created_at, updated_at
      ) VALUES
      (2, '2025-03-01', '2025-03-10', '2025-03-20', NOW(), NOW()),
      (3, '2025-03-15', '2025-03-25', '2025-04-05', NOW(), NOW()),
      (4, '2025-04-01', '2025-04-10', '2025-04-20', NOW(), NOW());
    `);

        // Insert Order Logistics
        console.log('   🚚 Inserting order logistics...');
        await sequelize.query(`
      INSERT INTO order_logistics (
        item_id, ordered_date, shipped_date, delivered_date, shipping_notes,
        created_at, updated_at
      ) VALUES
      (4, '2025-05-01', '2025-05-10', '2025-05-20', 'Express shipping required', NOW(), NOW()),
      (5, '2025-05-15', '2025-05-25', '2025-06-05', 'Standard shipping', NOW(), NOW()),
      (6, '2025-06-01', '2025-06-10', NULL, 'In transit', NOW(), NOW());
    `);

        // Insert Uploads
        console.log('   📎 Inserting uploads...');
        await sequelize.query(`
      INSERT INTO uploads (item_id, name, url, created_at, updated_at) VALUES
      (1, 'sofa-image-1.jpg', 'https://example.com/uploads/sofa-1.jpg', NOW(), NOW()),
      (1, 'sofa-image-2.jpg', 'https://example.com/uploads/sofa-2.jpg', NOW(), NOW()),
      (2, 'chandelier-specs.pdf', 'https://example.com/uploads/chandelier-specs.pdf', NOW(), NOW()),
      (3, 'art-certificate.pdf', 'https://example.com/uploads/art-cert.pdf', NOW(), NOW()),
      (4, 'rug-pattern.jpg', 'https://example.com/uploads/rug-pattern.jpg', NOW(), NOW()),
      (5, 'tv-manual.pdf', 'https://example.com/uploads/tv-manual.pdf', NOW(), NOW());
    `);

        console.log('\n✅ Seed completed successfully!');
        console.log('\n📊 Database Summary:');
        console.log('═══════════════════════════════════════');
        console.log('📦 Tables Created: 9');
        console.log('   ├─ item_categories');
        console.log('   ├─ vendors');
        console.log('   ├─ customers');
        console.log('   ├─ addresses');
        console.log('   ├─ items');
        console.log('   ├─ order_planning');
        console.log('   ├─ order_production');
        console.log('   ├─ order_logistics');
        console.log('   └─ uploads');
        console.log('\n📝 Data Inserted:');
        console.log('   ├─ 5 Categories');
        console.log('   ├─ 3 Vendors');
        console.log('   ├─ 3 Customers');
        console.log('   ├─ 12 Addresses (6 vendor + 6 customer)');
        console.log('   ├─ 6 Items');
        console.log('   ├─ 3 Order Planning records');
        console.log('   ├─ 3 Order Production records');
        console.log('   ├─ 3 Order Logistics records');
        console.log('   └─ 6 Upload records');
        console.log('═══════════════════════════════════════');
        console.log('\n🎉 Your database is ready to use!');

    } catch (error) {
        console.error('\n❌ Seed failed:', error);
        console.error('Error details:', error.message);
        throw error;
    } finally {
        await sequelize.close();
    }
}

// Güvenlik kontrolü
const args = process.argv.slice(2);
if (!args.includes('--force')) {
    console.log('⚠️  WARNING: This will completely reset your database!');
    console.log('⚠️  All existing data will be permanently deleted!');
    console.log('\nTo proceed, run:');
    console.log('  node seed.js --force');
    console.log('\nOr to bypass this check, add --force flag');
    process.exit(0);
}

seed();