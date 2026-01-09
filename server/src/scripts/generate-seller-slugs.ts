/**
 * Seller Slugs Migration Script
 *
 * ეს სკრიპტი მიანიჭებს უნიკალურ სლაგებს ყველა სელერს, ვისაც ჯერ არ აქვს
 * სლაგი გენერირდება storeName-დან ან name-დან თუ storeName არ არსებობს
 *
 * გაშვება: npx ts-node src/scripts/generate-seller-slugs.ts
 */

import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || '';

/**
 * Generate a slug from a name
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Generate a random slug if name produces empty result
 */
function generateRandomSlug(): string {
  return `store-${Math.random().toString(36).substring(2, 8)}`;
}

async function migrateSellersWithSlugs() {
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI არ არის მითითებული .env ფაილში');
    process.exit(1);
  }

  const client = new MongoClient(MONGODB_URI);

  try {
    console.log('🔗 MongoDB-თან დაკავშირება...');
    await client.connect();
    console.log('✅ წარმატებით დაკავშირდა!');

    const db = client.db();
    const usersCollection = db.collection('users');

    // Find all sellers without a storeSlug
    console.log('\n📊 სელერების ძებნა, რომლებსაც არ აქვთ storeSlug...');
    const sellersWithoutSlug = await usersCollection
      .find({
        role: 'seller',
        $or: [
          { storeSlug: { $exists: false } },
          { storeSlug: null },
          { storeSlug: '' },
        ],
      })
      .toArray();

    console.log(`📋 ნაპოვნია ${sellersWithoutSlug.length} სელერი სლაგის გარეშე`);

    if (sellersWithoutSlug.length === 0) {
      console.log('✅ ყველა სელერს უკვე აქვს სლაგი!');
      return;
    }

    // Get all existing slugs to ensure uniqueness
    const existingSlugs = await usersCollection.distinct('storeSlug', {
      storeSlug: { $exists: true, $nin: [null, ''] },
    });
    const usedSlugs = new Set<string>(existingSlugs as string[]);

    console.log(`📝 არსებული უნიკალური სლაგები: ${usedSlugs.size}`);

    let successCount = 0;
    let errorCount = 0;

    for (const seller of sellersWithoutSlug) {
      try {
        // Use storeName first, then name as fallback
        const baseName = seller.storeName || seller.name || '';
        let slug = generateSlug(baseName);

        // If slug is empty, generate random
        if (!slug) {
          slug = generateRandomSlug();
        }

        // Make it unique
        let uniqueSlug = slug;
        let counter = 1;
        while (usedSlugs.has(uniqueSlug)) {
          uniqueSlug = `${slug}-${counter}`;
          counter++;
          if (counter > 1000) {
            uniqueSlug = `${slug}-${Date.now()}`;
            break;
          }
        }

        // Update the seller
        await usersCollection.updateOne(
          { _id: seller._id },
          { $set: { storeSlug: uniqueSlug } },
        );

        // Add to used slugs
        usedSlugs.add(uniqueSlug);

        console.log(
          `✅ ${seller.email}: "${seller.storeName || seller.name}" -> ${uniqueSlug}`,
        );
        successCount++;
      } catch (error) {
        console.error(`❌ შეცდომა სელერისთვის ${seller.email}:`, error);
        errorCount++;
      }
    }

    console.log('\n📊 მიგრაციის შედეგები:');
    console.log(`   ✅ წარმატებული: ${successCount}`);
    console.log(`   ❌ შეცდომები: ${errorCount}`);
    console.log(`   📋 სულ: ${sellersWithoutSlug.length}`);
  } catch (error) {
    console.error('❌ მიგრაციის შეცდომა:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n🔒 MongoDB კავშირი დახურულია');
  }
}

// Run the migration
migrateSellersWithSlugs()
  .then(() => {
    console.log('\n✨ მიგრაცია დასრულდა!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ მიგრაცია ვერ დასრულდა:', error);
    process.exit(1);
  });
