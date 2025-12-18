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

        // 1. Categories
        console.log('🌱 Seeding categories...');
        await sequelize.query(`
      INSERT INTO item_categories (name) 
      VALUES 
        ('Furniture'),
        ('Lighting'),
        ('Decor'),
        ('Textiles'),
        ('Artwork'),
        ('Office Equipment'),
        ('Kitchen & Dining'),
        ('Outdoor')
      ON CONFLICT (name) DO NOTHING;
    `);
        console.log('✅ Seeded 8 categories\n');

        // 2. Vendors
        console.log('🌱 Seeding vendors...');
        await sequelize.query(`
      INSERT INTO vendors (vendor_name) 
      VALUES 
        ('ACME Corporation'),
        ('Global Furniture Ltd'),
        ('Premium Decor Inc'),
        ('Modern Living Co'),
        ('Classic Interiors'),
        ('Urban Design Group')
      ON CONFLICT (vendor_name) DO NOTHING;
    `);
        console.log('✅ Seeded 6 vendors\n');

        // 3. Customers
        console.log('🌱 Seeding customers...');
        await sequelize.query(`
      INSERT INTO customers (name, address) 
      VALUES 
        ('Hotel California', '1 Beach Road, Los Angeles, CA 90001'),
        ('Grand Resort & Spa', '200 Ocean Drive, Miami, FL 33139'),
        ('Downtown Business Center', '500 5th Avenue, New York, NY 10110'),
        ('Luxury Suites Hotel', '100 Park Lane, Chicago, IL 60601'),
        ('Seaside Inn', '75 Coastal Highway, San Diego, CA 92101')
      ON CONFLICT DO NOTHING;
    `);
        console.log('✅ Seeded 5 customers\n');

        // 4. Items
        console.log('🌱 Seeding items...');
        await sequelize.query(`
      INSERT INTO items (
        category_id, item_name, spec_no, unit_price, markup_percentage, 
        total_price, location, ship_from, notes
      )
      SELECT 
        category_id, item_name, spec_no, unit_price, markup_percentage,
        (unit_price * (1 + markup_percentage / 100.0))::integer as total_price,
        location, ship_from, notes
      FROM (
        SELECT (SELECT category_id FROM item_categories WHERE name = 'Furniture') as category_id,
               'Modern Sofa' as item_name, 'SF-2024-001' as spec_no,
               150000 as unit_price, 20 as markup_percentage,
               'Warehouse A' as location, 'Factory 1' as ship_from, 
               'Premium leather, 3-seater' as notes
        UNION ALL
        SELECT (SELECT category_id FROM item_categories WHERE name = 'Furniture'),
               'Office Chair', 'OC-2024-002', 75000, 25,
               'Warehouse B', 'Factory 2', 'Ergonomic, adjustable height'
        UNION ALL
        SELECT (SELECT category_id FROM item_categories WHERE name = 'Lighting'),
               'LED Ceiling Light', 'CL-2024-003', 35000, 30,
               'Warehouse A', 'Factory 3', 'Energy efficient, dimmable'
        UNION ALL
        SELECT (SELECT category_id FROM item_categories WHERE name = 'Decor'),
               'Wall Art Canvas', 'WA-2024-004', 25000, 40,
               'Warehouse C', 'Studio 1', 'Abstract design, 60x80cm'
        UNION ALL
        SELECT (SELECT category_id FROM item_categories WHERE name = 'Textiles'),
               'Luxury Curtain', 'LC-2024-005', 12000, 35,
               'Warehouse B', 'Factory 4', 'Blackout fabric, custom length'
        UNION ALL
        SELECT (SELECT category_id FROM item_categories WHERE name = 'Office Equipment'),
               'Standing Desk', 'SD-2024-006', 95000, 22,
               'Warehouse A', 'Factory 2', 'Electric adjustable, 120x60cm'
        UNION ALL
        SELECT (SELECT category_id FROM item_categories WHERE name = 'Kitchen & Dining'),
               'Dining Table Set', 'DT-2024-007', 200000, 18,
               'Warehouse C', 'Factory 1', 'Solid wood, seats 6'
        UNION ALL
        SELECT (SELECT category_id FROM item_categories WHERE name = 'Outdoor'),
               'Patio Lounge Chair', 'PL-2024-008', 55000, 28,
               'Warehouse B', 'Factory 5', 'Weather resistant, reclining'
        UNION ALL
        SELECT (SELECT category_id FROM item_categories WHERE name = 'Lighting'),
               'Table Lamp', 'TL-2024-009', 18000, 35,
               'Warehouse A', 'Factory 3', 'Modern design, touch control'
      ) as seed_data
      ON CONFLICT DO NOTHING;
    `);
        console.log('✅ Seeded 9 items\n');

        // 5. Vendor Addresses
        console.log('🌱 Seeding vendor addresses...');
        await sequelize.query(`
      INSERT INTO vendor_addresses (vendor_id, address)
      SELECT vendor_id, address
      FROM (
        SELECT (SELECT vendor_id FROM vendors WHERE vendor_name = 'ACME Corporation') as vendor_id,
               '123 Business Park, New York, NY 10001' as address
        UNION ALL
        SELECT (SELECT vendor_id FROM vendors WHERE vendor_name = 'ACME Corporation'),
               '456 Industrial Ave, Los Angeles, CA 90001'
        UNION ALL
        SELECT (SELECT vendor_id FROM vendors WHERE vendor_name = 'Global Furniture Ltd'),
               '789 Trade Center, Chicago, IL 60601'
        UNION ALL
        SELECT (SELECT vendor_id FROM vendors WHERE vendor_name = 'Premium Decor Inc'),
               '321 Design District, Miami, FL 33139'
        UNION ALL
        SELECT (SELECT vendor_id FROM vendors WHERE vendor_name = 'Modern Living Co'),
               '654 Innovation Hub, San Francisco, CA 94102'
        UNION ALL
        SELECT (SELECT vendor_id FROM vendors WHERE vendor_name = 'Classic Interiors'),
               '987 Heritage Lane, Boston, MA 02101'
      ) as seed_data
      ON CONFLICT DO NOTHING;
    `);
        console.log('✅ Seeded 6 vendor addresses\n');

        // 6. Order Items (using correct column names)
        console.log('🌱 Seeding order items...');
        await sequelize.query(`
      INSERT INTO order_items (
        item_id, vendor_id, vendor_address, ship_to, phase, unit_price, total_price
      )
      SELECT 
        item_id, vendor_id, vendor_address, ship_to, phase, unit_price, total_price
      FROM (
        SELECT 
          (SELECT item_id FROM items WHERE item_name = 'Modern Sofa') as item_id,
          (SELECT vendor_id FROM vendors WHERE vendor_name = 'ACME Corporation') as vendor_id,
          '123 Business Park, New York, NY 10001' as vendor_address,
          (SELECT id FROM customers WHERE name = 'Hotel California') as ship_to,
          3 as phase,
          150000 as unit_price,
          2700000 as total_price
        UNION ALL
        SELECT 
          (SELECT item_id FROM items WHERE item_name = 'Office Chair'),
          (SELECT vendor_id FROM vendors WHERE vendor_name = 'Global Furniture Ltd'),
          '789 Trade Center, Chicago, IL 60601',
          (SELECT id FROM customers WHERE name = 'Downtown Business Center'),
          2,
          75000,
          3750000
        UNION ALL
        SELECT 
          (SELECT item_id FROM items WHERE item_name = 'LED Ceiling Light'),
          (SELECT vendor_id FROM vendors WHERE vendor_name = 'Modern Living Co'),
          '654 Innovation Hub, San Francisco, CA 94102',
          (SELECT id FROM customers WHERE name = 'Grand Resort & Spa'),
          1,
          35000,
          1050000
      ) as seed_data
      ON CONFLICT DO NOTHING;
    `);
        console.log('✅ Seeded 3 order items\n');

        // 7. Order Planning
        console.log('🌱 Seeding order planning...');
        await sequelize.query(`
      INSERT INTO order_planning (
        order_item_id, sample_approved_date, pi_send_date, pi_approved_date, initial_payment_date
      )
      SELECT 
        order_item_id,
        NOW() - INTERVAL '30 days' as sample_approved_date,
        NOW() - INTERVAL '25 days' as pi_send_date,
        NOW() - INTERVAL '20 days' as pi_approved_date,
        NOW() - INTERVAL '15 days' as initial_payment_date
      FROM order_items
      WHERE phase >= 1
      LIMIT 3
      ON CONFLICT (order_item_id) DO NOTHING;
    `);
        console.log('✅ Seeded order planning\n');

        // 8. Order Production
        console.log('🌱 Seeding order production...');
        await sequelize.query(`
      INSERT INTO order_production (
        order_item_id, cfa_shops_send, cfa_shops_approved, cfa_shops_delivered
      )
      SELECT 
        order_item_id,
        NOW() - INTERVAL '10 days' as cfa_shops_send,
        NOW() - INTERVAL '7 days' as cfa_shops_approved,
        NOW() - INTERVAL '3 days' as cfa_shops_delivered
      FROM order_items
      WHERE phase >= 2
      LIMIT 2
      ON CONFLICT (order_item_id) DO NOTHING;
    `);
        console.log('✅ Seeded order production\n');

        // 9. Order Logistics
        console.log('🌱 Seeding order logistics...');
        await sequelize.query(`
      INSERT INTO order_logistics (
        order_item_id, ordered_date, shipped_date, delivered_date, shipping_notes
      )
      SELECT 
        order_item_id,
        NOW() - INTERVAL '5 days' as ordered_date,
        NOW() - INTERVAL '2 days' as shipped_date,
        NULL as delivered_date,
        'Express shipping requested' as shipping_notes
      FROM order_items
      WHERE phase >= 3
      LIMIT 1
      ON CONFLICT (order_item_id) DO NOTHING;
    `);
        console.log('✅ Seeded order logistics\n');

        // 10. Uploads
        console.log('🌱 Seeding uploads...');
        await sequelize.query(`
      INSERT INTO uploads (item_id, name, url)
      SELECT 
        order_item_id,
        'Sample Document ' || order_item_id || '.pdf' as name,
        '/uploads/sample-' || order_item_id || '.pdf' as url
      FROM order_items
      LIMIT 3
      ON CONFLICT DO NOTHING;
    `);
        console.log('✅ Seeded uploads\n');

        console.log('🎉 ✅ All seed data completed successfully!');
        console.log('📊 Summary:');
        console.log('   - 8 Categories');
        console.log('   - 6 Vendors');
        console.log('   - 5 Customers');
        console.log('   - 9 Items');
        console.log('   - 6 Vendor Addresses');
        console.log('   - 3 Order Items');
        console.log('   - Order Planning, Production, Logistics');
        console.log('   - 3 Upload records\n');

        await sequelize.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Seed failed:', error.message);
        console.error(error);
        process.exit(1);
    }
}

seed();