const { Sequelize } = require('sequelize-typescript');

async function seed() {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
        console.error('❌ DATABASE_URL not found');
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
        console.log('✅ Seeded 8 categories\n');

        // 2. Vendors
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
            INSERT INTO vendor_addresses (vendor_id, title, address, created_at, updated_at)
            SELECT 
                vendor_id,
                title,
                address,
                NOW(),
                NOW()
            FROM (
                SELECT 
                    (SELECT vendor_id FROM vendors WHERE vendor_name = 'ACME Corporation') as vendor_id,
                    'Main Office' as title,
                    '123 Business Park, NY' as address
                UNION ALL
                SELECT 
                    (SELECT vendor_id FROM vendors WHERE vendor_name = 'ACME Corporation'),
                    'Warehouse - East Coast',
                    '456 Industrial Blvd, NJ'
                UNION ALL
                SELECT 
                    (SELECT vendor_id FROM vendors WHERE vendor_name = 'Global Furniture Ltd'),
                    'Headquarters',
                    '789 Commerce St, Chicago'
                UNION ALL
                SELECT 
                    (SELECT vendor_id FROM vendors WHERE vendor_name = 'Global Furniture Ltd'),
                    'Distribution Center',
                    '321 Logistics Way, Gary'
            ) as seed_data
            WHERE vendor_id IS NOT NULL
            ON CONFLICT DO NOTHING;
        `);
        console.log('✅ Seeded 4 vendor addresses\n');

        // 5. Items
        console.log('🌱 Seeding items...');
        await sequelize.query(`
            INSERT INTO items (
                spec_no, item_name, category_id, unit_price, markup_percentage, 
                total_price, location, ship_from, unit_type, created_at, updated_at
            )
            SELECT 
                spec_no,
                item_name,
                category_id,
                unit_price,
                markup_percentage,
                total_price,
                location,
                ship_from,
                unit_type,
                NOW(),
                NOW()
            FROM (
                SELECT 
                    'SOFA-001' as spec_no,
                    'Premium Leather Sofa' as item_name,
                    (SELECT category_id FROM item_categories WHERE name = 'Furniture') as category_id,
                    150000 as unit_price,
                    20.00 as markup_percentage,
                    180000 as total_price,
                    'Warehouse A' as location,
                    'New York' as ship_from,
                    'each' as unit_type
                UNION ALL
                SELECT 
                    'CHAIR-001',
                    'Executive Office Chair',
                    (SELECT category_id FROM item_categories WHERE name = 'Furniture'),
                    45000,
                    25.00,
                    56250,
                    'Warehouse A',
                    'Chicago',
                    'each'
                UNION ALL
                SELECT 
                    'TABLE-001',
                    'Conference Table',
                    (SELECT category_id FROM item_categories WHERE name = 'Furniture'),
                    280000,
                    15.00,
                    322000,
                    'Warehouse B',
                    'New York',
                    'each'
                UNION ALL
                SELECT 
                    'LAMP-001',
                    'Crystal Chandelier',
                    (SELECT category_id FROM item_categories WHERE name = 'Lighting'),
                    95000,
                    30.00,
                    123500,
                    'Warehouse C',
                    'LA',
                    'each'
                UNION ALL
                SELECT 
                    'LAMP-002',
                    'LED Desk Lamp',
                    (SELECT category_id FROM item_categories WHERE name = 'Lighting'),
                    8000,
                    40.00,
                    11200,
                    'Warehouse A',
                    'Chicago',
                    'each'
                UNION ALL
                SELECT 
                    'DECOR-001',
                    'Modern Wall Art',
                    (SELECT category_id FROM item_categories WHERE name = 'Decor'),
                    35000,
                    50.00,
                    52500,
                    'Warehouse B',
                    'New York',
                    'each'
                UNION ALL
                SELECT 
                    'VASE-001',
                    'Ceramic Floor Vase',
                    (SELECT category_id FROM item_categories WHERE name = 'Decor'),
                    12000,
                    35.00,
                    16200,
                    'Warehouse C',
                    'LA',
                    'each'
                UNION ALL
                SELECT 
                    'CURT-001',
                    'Blackout Curtains',
                    (SELECT category_id FROM item_categories WHERE name = 'Textiles'),
                    18000,
                    30.00,
                    23400,
                    'Warehouse A',
                    'Chicago',
                    'pair'
                UNION ALL
                SELECT 
                    'RUG-001',
                    'Persian Area Rug',
                    (SELECT category_id FROM item_categories WHERE name = 'Textiles'),
                    450000,
                    20.00,
                    540000,
                    'Warehouse B',
                    'New York',
                    'each'
            ) as seed_data
            WHERE category_id IS NOT NULL
            ON CONFLICT (spec_no) DO NOTHING;
        `);
        console.log('✅ Seeded 9 items\n');

        // 6. Order Items
        console.log('🌱 Seeding order items...');
        await sequelize.query(`
            INSERT INTO order_items (
                vendor_id, vendor_address, item_id, quantity, unit_price, 
                markup_percentage, total_price, ship_to, phase, created_at, updated_at
            )
            SELECT 
                vendor_id,
                vendor_address,
                item_id,
                quantity,
                unit_price,
                markup_percentage,
                total_price,
                ship_to,
                phase,
                NOW(),
                NOW()
            FROM (
                SELECT 
                    (SELECT vendor_id FROM vendors WHERE vendor_name = 'ACME Corporation') as vendor_id,
                    (SELECT id FROM vendor_addresses 
                     WHERE title = 'Main Office' 
                     AND vendor_id = (SELECT vendor_id FROM vendors WHERE vendor_name = 'ACME Corporation')
                     LIMIT 1) as vendor_address,
                    (SELECT item_id FROM items WHERE spec_no = 'SOFA-001') as item_id,
                    15 as quantity,
                    150000 as unit_price,
                    20.00 as markup_percentage,
                    2700000 as total_price,
                    (SELECT id FROM customers WHERE name = 'Hotel California') as ship_to,
                    1 as phase
                UNION ALL
                SELECT 
                    (SELECT vendor_id FROM vendors WHERE vendor_name = 'ACME Corporation'),
                    (SELECT id FROM vendor_addresses 
                     WHERE title = 'Main Office' 
                     AND vendor_id = (SELECT vendor_id FROM vendors WHERE vendor_name = 'ACME Corporation')
                     LIMIT 1),
                    (SELECT item_id FROM items WHERE spec_no = 'CHAIR-001'),
                    30,
                    45000,
                    25.00,
                    1687500,
                    (SELECT id FROM customers WHERE name = 'Hotel California'),
                    2
                UNION ALL
                SELECT 
                    (SELECT vendor_id FROM vendors WHERE vendor_name = 'ACME Corporation'),
                    (SELECT id FROM vendor_addresses 
                     WHERE title = 'Main Office' 
                     AND vendor_id = (SELECT vendor_id FROM vendors WHERE vendor_name = 'ACME Corporation')
                     LIMIT 1),
                    (SELECT item_id FROM items WHERE spec_no = 'SOFA-001'),
                    20,
                    150000,
                    20.00,
                    3600000,
                    (SELECT id FROM customers WHERE name = 'Grand Resort & Spa'),
                    3
            ) as seed_data
            WHERE vendor_id IS NOT NULL 
                AND vendor_address IS NOT NULL 
                AND item_id IS NOT NULL 
                AND ship_to IS NOT NULL
            ON CONFLICT DO NOTHING;
        `);
        console.log('✅ Seeded 3 order items\n');

        // 7. Order Planning
        console.log('🌱 Seeding order planning...');
        await sequelize.query(`
            INSERT INTO order_planning (
                order_item_id, po_approval_date, hotel_need_by_date, 
                expected_delivery, created_at, updated_at
            )
            SELECT 
                order_item_id,
                po_approval_date,
                hotel_need_by_date,
                expected_delivery,
                NOW(),
                NOW()
            FROM (
                SELECT 
                    (SELECT order_item_id FROM order_items 
                     WHERE item_id = (SELECT item_id FROM items WHERE spec_no = 'SOFA-001')
                     AND ship_to = (SELECT id FROM customers WHERE name = 'Hotel California')
                     AND phase = 1
                     LIMIT 1) as order_item_id,
                    '2024-01-10'::date as po_approval_date,
                    '2024-02-15'::date as hotel_need_by_date,
                    '2024-02-10'::date as expected_delivery
                UNION ALL
                SELECT 
                    (SELECT order_item_id FROM order_items 
                     WHERE item_id = (SELECT item_id FROM items WHERE spec_no = 'CHAIR-001')
                     AND ship_to = (SELECT id FROM customers WHERE name = 'Hotel California')
                     AND phase = 2
                     LIMIT 1),
                    '2024-01-12'::date,
                    '2024-02-20'::date,
                    '2024-02-15'::date
            ) as seed_data
            WHERE order_item_id IS NOT NULL
            ON CONFLICT (order_item_id) DO NOTHING;
        `);
        console.log('✅ Seeded 2 order planning records\n');

        // 8. Order Production
        console.log('🌱 Seeding order production...');
        await sequelize.query(`
            INSERT INTO order_production (
                order_item_id, cfa_shops_send, cfa_shops_approved, 
                created_at, updated_at
            )
            SELECT 
                order_item_id,
                cfa_shops_send,
                cfa_shops_approved,
                NOW(),
                NOW()
            FROM (
                SELECT 
                    (SELECT order_item_id FROM order_items 
                     WHERE item_id = (SELECT item_id FROM items WHERE spec_no = 'SOFA-001')
                     AND ship_to = (SELECT id FROM customers WHERE name = 'Hotel California')
                     AND phase = 1
                     LIMIT 1) as order_item_id,
                    '2024-01-20'::date as cfa_shops_send,
                    '2024-01-25'::date as cfa_shops_approved
            ) as seed_data
            WHERE order_item_id IS NOT NULL
            ON CONFLICT (order_item_id) DO NOTHING;
        `);
        console.log('✅ Seeded 1 order production record\n');

        // 9. Order Logistics
        console.log('🌱 Seeding order logistics...');
        await sequelize.query(`
            INSERT INTO order_logistics (
                order_item_id, ordered_date, shipped_date, 
                shipping_notes, created_at, updated_at
            )
            SELECT 
                order_item_id,
                ordered_date,
                shipped_date,
                shipping_notes,
                NOW(),
                NOW()
            FROM (
                SELECT 
                    (SELECT order_item_id FROM order_items 
                     WHERE item_id = (SELECT item_id FROM items WHERE spec_no = 'SOFA-001')
                     AND ship_to = (SELECT id FROM customers WHERE name = 'Hotel California')
                     AND phase = 1
                     LIMIT 1) as order_item_id,
                    '2024-02-06'::date as ordered_date,
                    '2024-02-08'::date as shipped_date,
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