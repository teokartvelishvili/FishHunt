/**
 * Cloudinary Real Migration Script
 *
 * ეს სკრიპტი რეალურად გადაიტანს სურათებს ძველი Cloudinary-დან ახალზე
 *
 * გაშვება: npx ts-node src/scripts/cloudinary-real-migration.ts
 */

import { v2 as cloudinary } from 'cloudinary';
import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
import * as https from 'https';
import * as http from 'http';

dotenv.config();

// ძველი Cloudinary კონფიგურაცია (საიდანაც გადმოვწერთ)
const OLD_CLOUD_NAME = 'dsufx8uzd';

// ახალი Cloudinary კონფიგურაცია (სადაც ავტვირთავთ)
const NEW_CLOUDINARY = {
  cloud_name: 'dqbre9j3o',
  api_key: '933351519728752',
  api_secret: 'FOXqjJV3S4bxlP6ul4QucpP5xf8',
};

const MONGODB_URI = process.env.MONGODB_URI || '';

// URL-ში cloud_name-ის შეცვლა ძველზე რომ გადმოვწეროთ
function getOldUrl(newUrl: string): string {
  if (!newUrl || typeof newUrl !== 'string') return newUrl;
  return newUrl.replace('dqbre9j3o', OLD_CLOUD_NAME);
}

// სურათის public_id-ის ამოღება URL-დან
function extractPublicId(url: string): string | null {
  try {
    // მაგ: https://res.cloudinary.com/xxx/image/upload/v123/ecommerce/abc.jpg
    // public_id = ecommerce/abc
    const match = url.match(/\/v\d+\/(.+)\.(jpg|png|gif|webp|jpeg)/i);
    if (match) {
      return match[1];
    }
    return null;
  } catch {
    return null;
  }
}

// სურათის გადატანა
async function migrateImage(currentUrl: string): Promise<string> {
  if (!currentUrl || typeof currentUrl !== 'string') return currentUrl;

  // თუ უკვე ახალ cloudinary-ზეა და არ შეიცავს ძველის URL-ს
  if (!currentUrl.includes('dqbre9j3o') && !currentUrl.includes('dsufx8uzd')) {
    return currentUrl;
  }

  // ძველი URL-ის მიღება
  const oldUrl = currentUrl.includes('dqbre9j3o')
    ? getOldUrl(currentUrl)
    : currentUrl;

  // public_id-ის ამოღება
  const publicId = extractPublicId(oldUrl);

  try {
    // კონფიგურაცია ახალი Cloudinary-სთვის
    cloudinary.config(NEW_CLOUDINARY);

    // ატვირთვა ახალ Cloudinary-ზე, იგივე folder სტრუქტურით
    const result = await cloudinary.uploader.upload(oldUrl, {
      public_id: publicId || undefined,
      overwrite: true,
      resource_type: 'image',
    });

    console.log(`✅ Migrated: ${publicId || oldUrl}`);
    return result.secure_url;
  } catch (error: any) {
    console.error(`❌ Failed: ${publicId || oldUrl} - ${error.message}`);
    return currentUrl; // დავტოვოთ ძველი URL თუ ვერ გადავიტანეთ
  }
}

// მთავარი მიგრაციის ფუნქცია
async function runMigration() {
  console.log('🚀 Starting Real Cloudinary Migration...\n');
  console.log(`📦 From: ${OLD_CLOUD_NAME}`);
  console.log(`📦 To: ${NEW_CLOUDINARY.cloud_name}\n`);

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');

    const db = client.db();

    // 1. Products მიგრაცია
    console.log('📸 Migrating Products...');
    const products = await db.collection('products').find({}).toArray();
    let productsUpdated = 0;
    let imagesMigrated = 0;

    for (const product of products) {
      let needsUpdate = false;
      const newImages: string[] = [];

      // images მასივის მიგრაცია
      if (product.images && Array.isArray(product.images)) {
        for (const image of product.images) {
          if (
            image &&
            (image.includes('dqbre9j3o') || image.includes('dsufx8uzd'))
          ) {
            const newUrl = await migrateImage(image);
            newImages.push(newUrl);
            if (newUrl !== image) {
              needsUpdate = true;
              imagesMigrated++;
            }
          } else {
            newImages.push(image);
          }
        }
      }

      // brandLogo მიგრაცია
      let newBrandLogo = product.brandLogo;
      if (
        product.brandLogo &&
        (product.brandLogo.includes('dqbre9j3o') ||
          product.brandLogo.includes('dsufx8uzd'))
      ) {
        newBrandLogo = await migrateImage(product.brandLogo);
        if (newBrandLogo !== product.brandLogo) {
          needsUpdate = true;
          imagesMigrated++;
        }
      }

      if (needsUpdate) {
        await db
          .collection('products')
          .updateOne(
            { _id: product._id },
            { $set: { images: newImages, brandLogo: newBrandLogo } },
          );
        productsUpdated++;
      }
    }
    console.log(
      `✅ Products: ${productsUpdated} updated, ${imagesMigrated} images migrated\n`,
    );

    // 2. Banners მიგრაცია
    console.log('🖼️ Migrating Banners...');
    const banners = await db.collection('banners').find({}).toArray();
    let bannersUpdated = 0;

    for (const banner of banners) {
      if (
        banner.imageUrl &&
        (banner.imageUrl.includes('dqbre9j3o') ||
          banner.imageUrl.includes('dsufx8uzd'))
      ) {
        const newUrl = await migrateImage(banner.imageUrl);
        if (newUrl !== banner.imageUrl) {
          await db
            .collection('banners')
            .updateOne({ _id: banner._id }, { $set: { imageUrl: newUrl } });
          bannersUpdated++;
        }
      }
    }
    console.log(`✅ Banners: ${bannersUpdated} updated\n`);

    // 3. Users მიგრაცია
    console.log('👤 Migrating Users...');
    const users = await db.collection('users').find({}).toArray();
    let usersUpdated = 0;

    for (const user of users) {
      const updates: Record<string, string> = {};
      let needsUpdate = false;

      if (
        user.storeLogo &&
        (user.storeLogo.includes('dqbre9j3o') ||
          user.storeLogo.includes('dsufx8uzd'))
      ) {
        const newUrl = await migrateImage(user.storeLogo);
        if (newUrl !== user.storeLogo) {
          updates.storeLogo = newUrl;
          needsUpdate = true;
        }
      }

      if (
        user.profileImagePath &&
        (user.profileImagePath.includes('dqbre9j3o') ||
          user.profileImagePath.includes('dsufx8uzd'))
      ) {
        const newUrl = await migrateImage(user.profileImagePath);
        if (newUrl !== user.profileImagePath) {
          updates.profileImagePath = newUrl;
          needsUpdate = true;
        }
      }

      if (needsUpdate) {
        await db
          .collection('users')
          .updateOne({ _id: user._id }, { $set: updates });
        usersUpdated++;
      }
    }
    console.log(`✅ Users: ${usersUpdated} updated\n`);

    console.log('🎉 Migration completed!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await client.close();
    console.log('✅ MongoDB connection closed');
  }
}

runMigration();
