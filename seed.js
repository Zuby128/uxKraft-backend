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

        // 4. Vendor Addresses
        console.log('🌱 Seeding vendor addresses...');
        await sequelize.query(`
      INSERT INTO vendor_addresses (vendor_id, title, address)
      SELECT vendor_id, title, address
      FROM (
        SELECT (SELECT vendor_id FROM vendors WHERE vendor_name = 'ACME Corporation') as vendor_id,
               'Main Office' as title,
               '123 Business Park, NY' as address
        UNION ALL
        SELECT (SELECT vendor_id FROM vendors WHERE vendor_name = 'ACME Corporation'),
               'Warehouse - East Coast',
               '456 Industrial Blvd, NJ'
        UNION ALL
        SELECT (SELECT vendor_id FROM vendors WHERE vendor_name = 'Global Furniture Ltd'),
               'Headquarters',
               '789 Commerce St, Chicago'
        UNION ALL
        SELECT (SELECT vendor_id FROM vendors WHERE vendor_name = 'Global Furniture Ltd'),
               'Distribution Center',
               '321 Logistics Way, Gary'
      ) as seed_data
      ON CONFLICT DO NOTHING;
    `);
        console.log('✅ Seeded 4 vendor addresses\n');

        // 5. Items
        console.log('🌱 Seeding items...');
        await sequelize.query(`
      INSERT INTO items (
        category_id, item_name, spec_no, unit_price, markup_percentage, 
        total_price, unit_type, location, ship_from
      )
      SELECT 
        category_id, item_name, spec_no, unit_price, markup_percentage,
        (unit_price * (1 + markup_percentage / 100.0))::integer as total_price,
        unit_type, location, ship_from
      FROM (
        SELECT (SELECT category_id FROM item_categories WHERE name = 'Furniture') as category_id,
               'Premium Leather Sofa' as item_name, 'SOFA-001' as spec_no,
               150000 as unit_price, 20 as markup_percentage,
               'unit' as unit_type,
               'Warehouse A' as location, 'New York' as ship_from
        UNION ALL
        SELECT (SELECT category_id FROM item_categories WHERE name = 'Furniture'),
               'Executive Office Chair', 'CHAIR-001', 45000, 25,
               'unit',
               'Warehouse A', 'Chicago'
        UNION ALL
        SELECT (SELECT category_id FROM item_categories WHERE name = 'Furniture'),
               'Conference Table', 'TABLE-001', 280000, 15,
               'unit',
               'Warehouse B', 'New York'
        UNION ALL
        SELECT (SELECT category_id FROM item_categories WHERE name = 'Lighting'),
               'Crystal Chandelier', 'LAMP-001', 95000, 30,
               'unit',
               'Warehouse C', 'LA'
        UNION ALL
        SELECT (SELECT category_id FROM item_categories WHERE name = 'Lighting'),
               'LED Desk Lamp', 'LAMP-002', 8000, 40,
               'unit',
               'Warehouse A', 'Chicago'
        UNION ALL
        SELECT (SELECT category_id FROM item_categories WHERE name = 'Decor'),
               'Modern Wall Art', 'DECOR-001', 35000, 50,
               'unit',
               'Warehouse B', 'New York'
        UNION ALL
        SELECT (SELECT category_id FROM item_categories WHERE name = 'Decor'),
               'Ceramic Floor Vase', 'VASE-001', 12000, 35,
               'unit',
               'Warehouse C', 'LA'
        UNION ALL
        SELECT (SELECT category_id FROM item_categories WHERE name = 'Textiles'),
               'Blackout Curtains', 'CURT-001', 18000, 30,
               'pair',
               'Warehouse A', 'Chicago'
        UNION ALL
        SELECT (SELECT category_id FROM item_categories WHERE name = 'Textiles'),
               'Persian Area Rug', 'RUG-001', 450000, 20,
               'unit',
               'Warehouse B', 'New York'
      ) as seed_data
      ON CONFLICT DO NOTHING;
    `);
        console.log('✅ Seeded 9 items\n');

        // 6. Order Items
        console.log('🌱 Seeding order items...');
        await sequelize.query(`
      INSERT INTO order_items (
        item_id, quantity, vendor_id, vendor_address, ship_to, 
        phase, unit_price, markup_percentage, total_price
      )
      SELECT 
        item_id, quantity, vendor_id, vendor_address_id, ship_to,
        phase, unit_price, markup_percentage, total_price
      FROM (
        SELECT 
          (SELECT item_id FROM items WHERE spec_no = 'SOFA-001') as item_id,
          15 as quantity,
          (SELECT vendor_id FROM vendors WHERE vendor_name = 'ACME Corporation') as vendor_id,
          (SELECT vendor_address_id FROM vendor_addresses 
           WHERE vendor_id = (SELECT vendor_id FROM vendors WHERE vendor_name = 'ACME Corporation')
           AND title = 'Main Office') as vendor_address_id,
          (SELECT id FROM customers WHERE name = 'Hotel California') as ship_to,
          1 as phase,
          150000 as unit_price,
          20 as markup_percentage,
          (15 * 150000 * (1 + 20 / 100.0))::integer as total_price
        UNION ALL
        SELECT 
          (SELECT item_id FROM items WHERE spec_no = 'CHAIR-001'),
          30,
          (SELECT vendor_id FROM vendors WHERE vendor_name = 'ACME Corporation'),
          (SELECT vendor_address_id FROM vendor_addresses 
           WHERE vendor_id = (SELECT vendor_id FROM vendors WHERE vendor_name = 'ACME Corporation')
           AND title = 'Main Office'),
          (SELECT id FROM customers WHERE name = 'Hotel California'),
          2,
          45000,
          25,
          (30 * 45000 * (1 + 25 / 100.0))::integer
        UNION ALL
        SELECT 
          (SELECT item_id FROM items WHERE spec_no = 'SOFA-001'),
          20,
          (SELECT vendor_id FROM vendors WHERE vendor_name = 'ACME Corporation'),
          (SELECT vendor_address_id FROM vendor_addresses 
           WHERE vendor_id = (SELECT vendor_id FROM vendors WHERE vendor_name = 'ACME Corporation')
           AND title = 'Main Office'),
          (SELECT id FROM customers WHERE name = 'Grand Resort & Spa'),
          3,
          150000,
          20,
          (20 * 150000 * (1 + 20 / 100.0))::integer
      ) as seed_data
      ON CONFLICT DO NOTHING;
    `);
        console.log('✅ Seeded 3 order items\n');

        // 7. Order Planning
        console.log('🌱 Seeding order planning...');
        await sequelize.query(`
      INSERT INTO order_planning (
        order_item_id, po_approval_date, hotel_need_by_date, expected_delivery
      )
      SELECT 
        order_item_id,
        po_approval_date::date,
        hotel_need_by_date::date,
        expected_delivery::date
      FROM (
        SELECT 
          (SELECT order_item_id FROM order_items 
           WHERE item_id = (SELECT item_id FROM items WHERE spec_no = 'SOFA-001')
           AND ship_to = (SELECT id FROM customers WHERE name = 'Hotel California')
           AND phase = 1
           LIMIT 1) as order_item_id,
          '2024-01-10' as po_approval_date,
          '2024-02-15' as hotel_need_by_date,
          '2024-02-10' as expected_delivery
        UNION ALL
        SELECT 
          (SELECT order_item_id FROM order_items 
           WHERE item_id = (SELECT item_id FROM items WHERE spec_no = 'CHAIR-001')
           AND phase = 2
           LIMIT 1),
          '2024-01-12',
          '2024-02-20',
          '2024-02-15'
      ) as seed_data
      WHERE order_item_id IS NOT NULL
      ON CONFLICT (order_item_id) DO NOTHING;
    `);
        console.log('✅ Seeded 2 order planning records\n');

        // 8. Order Production
        console.log('🌱 Seeding order production...');
        await sequelize.query(`
      INSERT INTO order_production (
        order_item_id, cfa_shops_send, cfa_shops_approved
      )
      SELECT 
        order_item_id,
        cfa_shops_send::date,
        cfa_shops_approved::date
      FROM (
        SELECT 
          (SELECT order_item_id FROM order_items 
           WHERE item_id = (SELECT item_id FROM items WHERE spec_no = 'SOFA-001')
           AND ship_to = (SELECT id FROM customers WHERE name = 'Hotel California')
           AND phase = 1
           LIMIT 1) as order_item_id,
          '2024-01-20' as cfa_shops_send,
          '2024-01-25' as cfa_shops_approved
      ) as seed_data
      WHERE order_item_id IS NOT NULL
      ON CONFLICT (order_item_id) DO NOTHING;
    `);
        console.log('✅ Seeded 1 order production record\n');

        // 9. Order Logistics
        console.log('🌱 Seeding order logistics...');
        await sequelize.query(`
      INSERT INTO order_logistics (
        order_item_id, ordered_date, shipped_date, shipping_notes
      )
      SELECT 
        order_item_id,
        ordered_date::date,
        shipped_date::date,
        shipping_notes
      FROM (
        SELECT 
          (SELECT order_item_id FROM order_items 
           WHERE item_id = (SELECT item_id FROM items WHERE spec_no = 'SOFA-001')
           AND ship_to = (SELECT id FROM customers WHERE name = 'Hotel California')
           AND phase = 1
           LIMIT 1) as order_item_id,
          '2024-02-06' as ordered_date,
          '2024-02-08' as shipped_date,
          'Standard shipping' as shipping_notes
      ) as seed_data
      WHERE order_item_id IS NOT NULL
      ON CONFLICT (order_item_id) DO NOTHING;
    `);
        console.log('✅ Seeded 1 order logistics record\n');

        // 10. Uploads
        console.log('🌱 Seeding uploads...');
        await sequelize.query(`
      INSERT INTO uploads (item_id, name, url)
      SELECT 
        item_id,
        name,
        url
      FROM (
        SELECT 
          (SELECT order_item_id FROM order_items 
           WHERE item_id = (SELECT item_id FROM items WHERE spec_no = 'SOFA-001')
           AND ship_to = (SELECT id FROM customers WHERE name = 'Hotel California')
           AND phase = 1
           LIMIT 1) as item_id,
          'PO_001.pdf' as name,
          'https://cdn.example.com/po_001.pdf' as url
        UNION ALL
        SELECT 
          (SELECT order_item_id FROM order_items 
           WHERE item_id = (SELECT item_id FROM items WHERE spec_no = 'SOFA-001')
           AND ship_to = (SELECT id FROM customers WHERE name = 'Hotel California')
           AND phase = 1
           LIMIT 1),
          'Invoice.pdf',
          'https://cdn.example.com/invoice.pdf'
      ) as seed_data
      WHERE item_id IS NOT NULL
      ON CONFLICT DO NOTHING;
    `);
        console.log('✅ Seeded 2 uploads\n');

        console.log('🎉 ✅ All seed data completed successfully!');
        console.log('📊 Summary:');
        console.log('   - 8 Categories');
        console.log('   - 6 Vendors');
        console.log('   - 5 Customers');
        console.log('   - 4 Vendor Addresses');
        console.log('   - 9 Items');
        console.log('   - 3 Order Items');
        console.log('   - 2 Order Planning records');
        console.log('   - 1 Order Production record');
        console.log('   - 1 Order Logistics record');
        console.log('   - 2 Upload records\n');

        await sequelize.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Seed failed:', error.message);
        console.error(error);
        process.exit(1);
    }
}

seed();