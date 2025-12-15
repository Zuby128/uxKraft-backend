import { execSync } from 'child_process';

async function setup() {
  console.log('🚀 Starting complete database setup...\n');

  try {
    // Step 1: Create Database
    console.log('📦 Step 1/3: Creating database...');
    execSync(
      'ts-node -r tsconfig-paths/register src/database/create-database.ts',
      {
        stdio: 'inherit',
      },
    );
    console.log('');

    // Step 2: Run Migrations
    console.log('📦 Step 2/3: Running migrations...');
    execSync('ts-node -r tsconfig-paths/register src/database/migrate.ts', {
      stdio: 'inherit',
    });
    console.log('');

    // Step 3: Seed Data
    console.log('📦 Step 3/3: Seeding data...');
    execSync('ts-node -r tsconfig-paths/register src/database/seed.ts', {
      stdio: 'inherit',
    });
    console.log('');

    console.log('🎉 ✅ Complete setup finished successfully!');
    console.log('');
    console.log('📊 Database ready with:');
    console.log('  - All tables created');
    console.log('  - Sample data seeded');
    console.log('');
    console.log('🚀 You can now start the application with: npm run start:dev');
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
  }
}

setup();
