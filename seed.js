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
            WITH vendor_refs AS (
                SELECT vendor_id, vendor_name FROM vendors
            )
            INSERT INTO vendor_addresses (vendor_id, title, address, created_at, updated_at)
            SELECT 
                vr.vendor_id,
                data.title,
                data.address,
                NOW(),
                NOW()
            FROM vendor_refs vr
            CROSS JOIN LATERAL (
                VALUES
                    ('Main Office', '123 Business Park, NY'),
                    ('Warehouse - East Coast', '456 Industrial Blvd, NJ')
            ) AS data(title, address)
            WHERE vr.vendor_name = 'ACME Corporation'
            UNION ALL
            SELECT 
                vr.vendor_id,
                data.title,
                data.address,
                NOW(),
                NOW()
            FROM vendor_refs vr
            CROSS JOIN LATERAL (
                VALUES
                    ('Headquarters', '789 Commerce St, Chicago'),
                    ('Distribution Center', '321 Logistics Way, Gary')
            ) AS data(title, address)
            WHERE vr.vendor_name = 'Global Furniture Ltd'
            ON CONFLICT DO NOTHING;
        `);
        console.log('✅ Seeded 4 vendor addresses\n');

        // 5. Items
        console.log('🌱 Seeding items...');
        await sequelize.query(`
            WITH category_refs AS (
                SELECT category_id, name FROM item_categories
            )
            INSERT INTO items (
                spec_no, item_name, category_id, unit_price, markup_percentage, 
                total_price, location, ship_from, unit_type, created_at, updated_at
            )
            SELECT 
                spec_no,
                item_name,
                cr.category_id,
                unit_price,
                markup_percentage,
                total_price,
                location,
                ship_from,
                unit_type,
                NOW(),
                NOW()
            FROM (VALUES
                ('SOFA-001', 'Premium Leather Sofa', 'Furniture', 150000, 20.00, 180000, 'Warehouse A', 'New York', 'each'),
                ('CHAIR-001', 'Executive Office Chair', 'Furniture', 45000, 25.00, 56250, 'Warehouse A', 'Chicago', 'each'),
                ('TABLE-001', 'Conference Table', 'Furniture', 280000, 15.00, 322000, 'Warehouse B', 'New York', 'each'),
                ('LAMP-001', 'Crystal Chandelier', 'Lighting', 95000, 30.00, 123500, 'Warehouse C', 'LA', 'each'),
                ('LAMP-002', 'LED Desk Lamp', 'Lighting', 8000, 40.00, 11200, 'Warehouse A', 'Chicago', 'each'),
                ('DECOR-001', 'Modern Wall Art', 'Decor', 35000, 50.00, 52500, 'Warehouse B', 'New York', 'each'),
                ('VASE-001', 'Ceramic Floor Vase', 'Decor', 12000, 35.00, 16200, 'Warehouse C', 'LA', 'each'),
                ('CURT-001', 'Blackout Curtains', 'Textiles', 18000, 30.00, 23400, 'Warehouse A', 'Chicago', 'pair'),
                ('RUG-001', 'Persian Area Rug', 'Textiles', 450000, 20.00, 540000, 'Warehouse B', 'New York', 'each')
            ) AS data(spec_no, item_name, category_name, unit_price, markup_percentage, total_price, location, ship_from, unit_type)
            JOIN category_refs cr ON cr.name = data.category_name
            ON CONFLICT (spec_no) DO NOTHING;
        `);
        console.log('✅ Seeded 9 items\n');

        // 6. Order Items
        console.log('🌱 Seeding order items...');
        await sequelize.query(`
            WITH refs AS (
                SELECT 
                    v.vendor_id,
                    va.id as vendor_address_id,
                    i_sofa.item_id as sofa_id,
                    i_chair.item_id as chair_id,
                    c_hotel.id as hotel_id,
                    c_resort.id as resort_id
                FROM vendors v
                JOIN vendor_addresses va ON va.vendor_id = v.vendor_id AND va.title = 'Main Office'
                CROSS JOIN (SELECT item_id FROM items WHERE spec_no = 'SOFA-001') i_sofa
                CROSS JOIN (SELECT item_id FROM items WHERE spec_no = 'CHAIR-001') i_chair
                CROSS JOIN (SELECT id FROM customers WHERE name = 'Hotel California') c_hotel
                CROSS JOIN (SELECT id FROM customers WHERE name = 'Grand Resort & Spa') c_resort
                WHERE v.vendor_name = 'ACME Corporation'
            )
            INSERT INTO order_items (
                vendor_id, vendor_address, item_id, quantity, unit_price, 
                markup_percentage, total_price, ship_to, phase, created_at, updated_at
            )
            SELECT 
                vendor_id,
                vendor_address_id,
                item_id,
                quantity,
                unit_price,
                markup_percentage,
                total_price,
                ship_to,
                phase,
                NOW(),
                NOW()
            FROM refs
            CROSS JOIN LATERAL (VALUES
                (refs.sofa_id, 15, 150000, 20.00, 2700000, refs.hotel_id, 1),
                (refs.chair_id, 30, 45000, 25.00, 1687500, refs.hotel_id, 2),
                (refs.sofa_id, 20, 150000, 20.00, 3600000, refs.resort_id, 3)
            ) AS data(item_id, quantity, unit_price, markup_percentage, total_price, ship_to, phase)
            ON CONFLICT DO NOTHING;
        `);
        console.log('✅ Seeded 3 order items\n');

        // 7. Order Planning
        console.log('🌱 Seeding order planning...');
        await sequelize.query(`
            WITH order_refs AS (
                SELECT 
                    oi.order_item_id,
                    oi.phase
                FROM order_items oi
                JOIN items i ON i.item_id = oi.item_id
                JOIN customers c ON c.id = oi.ship_to
                WHERE c.name = 'Hotel California'
                    AND i.spec_no IN ('SOFA-001', 'CHAIR-001')
                    AND oi.phase IN (1, 2)
            )
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
            FROM order_refs
            CROSS JOIN LATERAL (VALUES
                ('2024-01-10'::date, '2024-02-15'::date, '2024-02-10'::date),
                ('2024-01-12'::date, '2024-02-20'::date, '2024-02-15'::date)
            ) AS data(po_approval_date, hotel_need_by_date, expected_delivery)
            WHERE (order_refs.phase = 1 AND data.po_approval_date = '2024-01-10'::date)
               OR (order_refs.phase = 2 AND data.po_approval_date = '2024-01-12'::date)
            ON CONFLICT (order_item_id) DO NOTHING;
        `);
        console.log('✅ Seeded 2 order planning records\n');

        // 8. Order Production
        console.log('🌱 Seeding order production...');
        await sequelize.query(`
            WITH order_ref AS (
                SELECT oi.order_item_id
                FROM order_items oi
                JOIN items i ON i.item_id = oi.item_id
                JOIN customers c ON c.id = oi.ship_to
                WHERE i.spec_no = 'SOFA-001'
                    AND c.name = 'Hotel California'
                    AND oi.phase = 1
                LIMIT 1
            )
            INSERT INTO order_production (
                order_item_id, cfa_shops_send, cfa_shops_approved, 
                created_at, updated_at
            )
            SELECT 
                order_item_id,
                '2024-01-20'::date,
                '2024-01-25'::date,
                NOW(),
                NOW()
            FROM order_ref
            ON CONFLICT (order_item_id) DO NOTHING;
        `);
        console.log('✅ Seeded 1 order production record\n');

        // 9. Order Logistics
        console.log('🌱 Seeding order logistics...');
        await sequelize.query(`
            WITH order_ref AS (
                SELECT oi.order_item_id
                FROM order_items oi
                JOIN items i ON i.item_id = oi.item_id
                JOIN customers c ON c.id = oi.ship_to
                WHERE i.spec_no = 'SOFA-001'
                    AND c.name = 'Hotel California'
                    AND oi.phase = 1
                LIMIT 1
            )
            INSERT INTO order_logistics (
                order_item_id, ordered_date, shipped_date, 
                shipping_notes, created_at, updated_at
            )
            SELECT 
                order_item_id,
                '2024-02-06'::date,
                '2024-02-08'::date,
                'Standard shipping',
                NOW(),
                NOW()
            FROM order_ref
            ON CONFLICT (order_item_id) DO NOTHING;
        `);
        console.log('✅ Seeded 1 order logistics record\n');

        // 10. Uploads
        console.log('🌱 Seeding uploads...');
        await sequelize.query(`
            WITH order_ref AS (
                SELECT oi.order_item_id
                FROM order_items oi
                JOIN items i ON i.item_id = oi.item_id
                JOIN customers c ON c.id = oi.ship_to
                WHERE i.spec_no = 'SOFA-001'
                    AND c.name = 'Hotel California'
                    AND oi.phase = 1
                LIMIT 1
            )
            INSERT INTO uploads (item_id, name, url)
            SELECT 
                order_item_id,
                name,
                url
            FROM order_ref
            CROSS JOIN LATERAL (VALUES
                ('PO_001.pdf', 'https://cdn.example.com/po_001.pdf'),
                ('Invoice.pdf', 'https://cdn.example.com/invoice.pdf')
            ) AS data(name, url)
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