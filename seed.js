const { Sequelize } = require('sequelize-typescript');
const { ItemCategory } = require('./src/base/entities/item-category.entity');
const { Item } = require('./src/base/entities/item.entity');
const { Vendor } = require('./src/base/entities/vendor.entity');
const { Customer } = require('./src/base/entities/customer.entity');
const { Address } = require('./src/base/entities/address.entity');
const { OrderProduction } = require('./src/base/entities/order-production.entity');
const { OrderPlanning } = require('./src/base/entities/order-planning.entity');
const { OrderLogistics } = require('./src/base/entities/order-logistics.entity');
const { Upload } = require('./src/base/entities/upload.entity');

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
            models: [
                ItemCategory,
                Item,
                Vendor,
                Customer,
                Address,
                OrderProduction,
                OrderPlanning,
                OrderLogistics,
                Upload,
            ],
            logging: console.log,
        });

        await sequelize.authenticate();
        console.log('✅ Database connected\n');

        // CLEAN OLD SCHEMA
        console.log('🧹 Cleaning old schema...');
        // await sequelize.query(`DROP TABLE IF EXISTS uploads CASCADE;`);
        // await sequelize.query(`DROP TABLE IF EXISTS order_logistics CASCADE;`);
        // await sequelize.query(`DROP TABLE IF EXISTS order_production CASCADE;`);
        // await sequelize.query(`DROP TABLE IF EXISTS order_planning CASCADE;`);
        // await sequelize.query(`DROP TABLE IF EXISTS order_items CASCADE;`);
        // await sequelize.query(`DROP TABLE IF EXISTS vendor_addresses CASCADE;`);
        console.log('✅ Old tables dropped\n');

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
            INSERT INTO customers (name, created_at, updated_at)
            VALUES 
                ('Hotel California', NOW(), NOW()),
                ('Grand Resort & Spa', NOW(), NOW()),
                ('Downtown Business Center', NOW(), NOW()),
                ('Luxury Suites Hotel', NOW(), NOW()),
                ('Seaside Inn', NOW(), NOW())
            ON CONFLICT DO NOTHING;
        `);
        console.log('✅ Seeded 5 customers\n');

        // 4. Addresses (Vendor & Customer)
        console.log('🌱 Seeding addresses...');
        await sequelize.query(`
            WITH vendor_refs AS (
                SELECT vendor_id, vendor_name FROM vendors
            ),
            customer_refs AS (
                SELECT id, name FROM customers
            )
            INSERT INTO addresses (title, address, type, reference_id, created_at, updated_at)
            -- Vendor Addresses
            SELECT 'Main Office', '123 Business Park, NY', 'vendor', vr.vendor_id, NOW(), NOW()
            FROM vendor_refs vr WHERE vr.vendor_name = 'ACME Corporation'
            UNION ALL
            SELECT 'Warehouse - East Coast', '456 Industrial Blvd, NJ', 'vendor', vr.vendor_id, NOW(), NOW()
            FROM vendor_refs vr WHERE vr.vendor_name = 'ACME Corporation'
            UNION ALL
            SELECT 'Headquarters', '789 Commerce St, Chicago', 'vendor', vr.vendor_id, NOW(), NOW()
            FROM vendor_refs vr WHERE vr.vendor_name = 'Global Furniture Ltd'
            UNION ALL
            SELECT 'Distribution Center', '321 Logistics Way, Gary', 'vendor', vr.vendor_id, NOW(), NOW()
            FROM vendor_refs vr WHERE vr.vendor_name = 'Global Furniture Ltd'
            UNION ALL
            SELECT 'Design Studio', '555 Creative Blvd, Miami', 'vendor', vr.vendor_id, NOW(), NOW()
            FROM vendor_refs vr WHERE vr.vendor_name = 'Premium Decor Inc'
            UNION ALL
            SELECT 'Innovation Hub', '777 Tech Park, San Francisco', 'vendor', vr.vendor_id, NOW(), NOW()
            FROM vendor_refs vr WHERE vr.vendor_name = 'Modern Living Co'
            -- Customer Addresses
            UNION ALL
            SELECT 'Main Building', '1 Beach Road, Los Angeles, CA 90001', 'customer', cr.id, NOW(), NOW()
            FROM customer_refs cr WHERE cr.name = 'Hotel California'
            UNION ALL
            SELECT 'East Wing', '1-B Beach Road, Los Angeles, CA 90001', 'customer', cr.id, NOW(), NOW()
            FROM customer_refs cr WHERE cr.name = 'Hotel California'
            UNION ALL
            SELECT 'Reception', '200 Ocean Drive, Miami, FL 33139', 'customer', cr.id, NOW(), NOW()
            FROM customer_refs cr WHERE cr.name = 'Grand Resort & Spa'
            UNION ALL
            SELECT 'Office Building', '500 5th Avenue, New York, NY 10110', 'customer', cr.id, NOW(), NOW()
            FROM customer_refs cr WHERE cr.name = 'Downtown Business Center'
            UNION ALL
            SELECT 'Main Entrance', '100 Park Lane, Chicago, IL 60601', 'customer', cr.id, NOW(), NOW()
            FROM customer_refs cr WHERE cr.name = 'Luxury Suites Hotel'
            ON CONFLICT DO NOTHING;
        `);
        console.log('✅ Seeded 10 addresses (6 vendor + 4 customer)\n');

        // 5. Items (with order fields)
        console.log('🌱 Seeding items...');
        await sequelize.query(`
            WITH category_refs AS (
                SELECT category_id, name FROM item_categories
            ),
            vendor_refs AS (
                SELECT vendor_id, vendor_name FROM vendors
            ),
            customer_refs AS (
                SELECT id, name FROM customers
            ),
            vendor_addr_refs AS (
                SELECT address_id, reference_id, title FROM addresses WHERE type = 'vendor'
            ),
            customer_addr_refs AS (
                SELECT address_id, reference_id, title FROM addresses WHERE type = 'customer'
            )
            INSERT INTO items (
                spec_no, item_name, category_id, unit_price, markup_percentage, 
                total_price, location, ship_from, unit_type,
                quantity, vendor_id, vendor_address_id, customer_id, customer_address_id, phase,
                created_at, updated_at
            )
            SELECT 
                data.spec_no,
                data.item_name,
                cr.category_id,
                data.unit_price,
                data.markup_percentage,
                data.total_price,
                data.location,
                data.ship_from,
                data.unit_type,
                data.quantity,
                vr.vendor_id,
                var.address_id as vendor_address_id,
                cust.id as customer_id,
                car.address_id as customer_address_id,
                data.phase,
                NOW(),
                NOW()
            FROM (VALUES
                ('SOFA-001', 'Premium Leather Sofa', 'Furniture', 150000, 20.00, 180000, 'Warehouse A', 'New York', 'each', 
                 15, 'ACME Corporation', 'Main Office', 'Hotel California', 'Main Building', 3),
                ('CHAIR-001', 'Executive Office Chair', 'Furniture', 45000, 25.00, 56250, 'Warehouse A', 'Chicago', 'each',
                 30, 'ACME Corporation', 'Main Office', 'Hotel California', 'Main Building', 2),
                ('TABLE-001', 'Conference Table', 'Furniture', 280000, 15.00, 322000, 'Warehouse B', 'New York', 'each',
                 10, 'Global Furniture Ltd', 'Headquarters', 'Downtown Business Center', 'Office Building', 1),
                ('LAMP-001', 'Crystal Chandelier', 'Lighting', 95000, 30.00, 123500, 'Warehouse C', 'LA', 'each',
                 20, 'Premium Decor Inc', 'Design Studio', 'Grand Resort & Spa', 'Reception', 2),
                ('LAMP-002', 'LED Desk Lamp', 'Lighting', 8000, 40.00, 11200, 'Warehouse A', 'Chicago', 'each',
                 50, 'Modern Living Co', 'Innovation Hub', 'Downtown Business Center', 'Office Building', 1),
                ('DECOR-001', 'Modern Wall Art', 'Decor', 35000, 50.00, 52500, 'Warehouse B', 'New York', 'each',
                 25, 'Premium Decor Inc', 'Design Studio', 'Hotel California', 'East Wing', 0),
                ('VASE-001', 'Ceramic Floor Vase', 'Decor', 12000, 35.00, 16200, 'Warehouse C', 'LA', 'each',
                 40, 'Premium Decor Inc', 'Design Studio', 'Luxury Suites Hotel', 'Main Entrance', 1),
                ('CURT-001', 'Blackout Curtains', 'Textiles', 18000, 30.00, 23400, 'Warehouse A', 'Chicago', 'pair',
                 100, 'ACME Corporation', 'Warehouse - East Coast', 'Grand Resort & Spa', 'Reception', 2),
                ('RUG-001', 'Persian Area Rug', 'Textiles', 450000, 20.00, 540000, 'Warehouse B', 'New York', 'each',
                 5, 'Global Furniture Ltd', 'Distribution Center', 'Hotel California', 'Main Building', 3)
            ) AS data(
                spec_no, item_name, category_name, unit_price, markup_percentage, total_price, 
                location, ship_from, unit_type, quantity, vendor_name, vendor_addr_title, 
                customer_name, customer_addr_title, phase
            )
            JOIN category_refs cr ON cr.name = data.category_name
            JOIN vendor_refs vr ON vr.vendor_name = data.vendor_name
            JOIN customer_refs cust ON cust.name = data.customer_name
            JOIN vendor_addr_refs var ON var.reference_id = vr.vendor_id AND var.title = data.vendor_addr_title
            JOIN customer_addr_refs car ON car.reference_id = cust.id AND car.title = data.customer_addr_title
            ON CONFLICT (spec_no) DO NOTHING;
        `);
        console.log('✅ Seeded 9 items with order details\n');

        // 6. Order Planning
        console.log('🌱 Seeding order planning...');
        await sequelize.query(`
            INSERT INTO order_planning (
                item_id, sample_approved_date, pi_send_date, 
                pi_approved_date, initial_payment_date, created_at, updated_at
            )
            SELECT 
                i.item_id,
                '2024-01-10'::date,
                '2024-01-15'::date,
                '2024-01-20'::date,
                '2024-01-25'::date,
                NOW(),
                NOW()
            FROM items i
            WHERE i.spec_no IN ('SOFA-001', 'CHAIR-001', 'TABLE-001', 'LAMP-001')
                AND i.phase >= 1
            ON CONFLICT (item_id) DO NOTHING;
        `);
        console.log('✅ Seeded 4 order planning records\n');

        // 7. Order Production
        console.log('🌱 Seeding order production...');
        await sequelize.query(`
            INSERT INTO order_production (
                item_id, cfa_shops_send, cfa_shops_approved, 
                cfa_shops_delivered, created_at, updated_at
            )
            SELECT 
                i.item_id,
                '2024-01-20'::date,
                '2024-01-25'::date,
                '2024-02-01'::date,
                NOW(),
                NOW()
            FROM items i
            WHERE i.spec_no IN ('SOFA-001', 'CHAIR-001', 'LAMP-001')
                AND i.phase >= 2
            ON CONFLICT (item_id) DO NOTHING;
        `);
        console.log('✅ Seeded 3 order production records\n');

        // 8. Order Logistics
        console.log('🌱 Seeding order logistics...');
        await sequelize.query(`
            INSERT INTO order_logistics (
                item_id, ordered_date, shipped_date, delivered_date,
                shipping_notes, created_at, updated_at
            )
            SELECT 
                i.item_id,
                '2024-02-06'::date,
                '2024-02-08'::date,
                '2024-02-12'::date,
                'Express shipping completed',
                NOW(),
                NOW()
            FROM items i
            WHERE i.spec_no IN ('SOFA-001', 'RUG-001')
                AND i.phase >= 3
            ON CONFLICT (item_id) DO NOTHING;
        `);
        console.log('✅ Seeded 2 order logistics records\n');

        // 9. Uploads
        console.log('🌱 Seeding uploads...');
        await sequelize.query(`
            INSERT INTO uploads (item_id, name, url, created_at, updated_at)
            SELECT 
                i.item_id,
                'PO_' || i.spec_no || '.pdf',
                'https://cdn.example.com/po_' || LOWER(i.spec_no) || '.pdf',
                NOW(),
                NOW()
            FROM items i
            WHERE i.spec_no IN ('SOFA-001', 'CHAIR-001', 'TABLE-001')
            UNION ALL
            SELECT 
                i.item_id,
                'Invoice_' || i.spec_no || '.pdf',
                'https://cdn.example.com/invoice_' || LOWER(i.spec_no) || '.pdf',
                NOW(),
                NOW()
            FROM items i
            WHERE i.spec_no IN ('SOFA-001', 'LAMP-001')
            ON CONFLICT DO NOTHING;
        `);
        console.log('✅ Seeded 5 upload records\n');

        console.log('🎉 ✅ All seed data completed successfully!');
        console.log('📊 Summary:');
        console.log('   - 8 Categories');
        console.log('   - 6 Vendors');
        console.log('   - 5 Customers');
        console.log('   - 10 Addresses (6 vendor + 4 customer)');
        console.log('   - 9 Items (with order details integrated)');
        console.log('   - 4 Order Planning records');
        console.log('   - 3 Order Production records');
        console.log('   - 2 Order Logistics records');
        console.log('   - 5 Upload records\n');

        await sequelize.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Seed failed:', error.message);
        console.error(error);
        process.exit(1);
    }
}

seed();