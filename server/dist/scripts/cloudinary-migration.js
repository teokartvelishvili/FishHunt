/**
 * Cloudinary Migration Script
 *
 * ძველი Cloudinary (dsufx8uzd) -> ახალი Cloudinary (dqbre9j3o) მიგრაცია
 *
 * გაშვება: npx ts-node src/scripts/cloudinary-migration.ts
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _cloudinary = require("cloudinary");
const _mongodb = require("mongodb");
const _dotenv = /*#__PURE__*/ _interop_require_wildcard(require("dotenv"));
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
_dotenv.config();
// ძველი Cloudinary კონფიგურაცია
const OLD_CLOUDINARY = {
    cloud_name: 'dsufx8uzd',
    api_key: '526676916676116',
    api_secret: 'oG_mVmeJJ6kT6QleyottU2YPL9Q'
};
// ახალი Cloudinary კონფიგურაცია
const NEW_CLOUDINARY = {
    cloud_name: 'dqbre9j3o',
    api_key: '933351519728752',
    api_secret: 'FOXqjJV3S4bxlP6ul4QucpP5xf8'
};
const MONGODB_URI = process.env.MONGODB_URI || '';
// URL-ის შეცვლის ფუნქცია
function replaceCloudinaryUrl(url, newCloudName) {
    if (!url || typeof url !== 'string') return url;
    // შეამოწმე თუ ეს ძველი cloudinary URL არის
    if (url.includes('dsufx8uzd')) {
        return url.replace('dsufx8uzd', newCloudName);
    }
    return url;
}
// სურათის გადატანა ახალ Cloudinary-ზე
async function migrateImage(oldUrl) {
    if (!oldUrl || !oldUrl.includes('dsufx8uzd')) {
        return {
            oldUrl,
            newUrl: oldUrl,
            success: true
        };
    }
    try {
        // კონფიგურაცია ახალი Cloudinary-სთვის
        _cloudinary.v2.config(NEW_CLOUDINARY);
        // ძველი URL-დან ატვირთვა ახალ Cloudinary-ზე
        const result = await _cloudinary.v2.uploader.upload(oldUrl, {
            folder: 'migrated'
        });
        console.log(`✅ Migrated: ${oldUrl} -> ${result.secure_url}`);
        return {
            oldUrl,
            newUrl: result.secure_url,
            success: true
        };
    } catch (error) {
        console.error(`❌ Failed to migrate: ${oldUrl}`, error.message);
        return {
            oldUrl,
            newUrl: oldUrl,
            success: false,
            error: error.message
        };
    }
}
// მთავარი მიგრაციის ფუნქცია
async function runMigration() {
    console.log('🚀 Starting Cloudinary Migration...\n');
    console.log(`📦 Old Cloudinary: ${OLD_CLOUDINARY.cloud_name}`);
    console.log(`📦 New Cloudinary: ${NEW_CLOUDINARY.cloud_name}\n`);
    const client = new _mongodb.MongoClient(MONGODB_URI);
    try {
        await client.connect();
        console.log('✅ Connected to MongoDB\n');
        const db = client.db();
        // 1. Products კოლექციის მიგრაცია
        console.log('📸 Migrating Products...');
        const products = await db.collection('products').find({}).toArray();
        let productsUpdated = 0;
        for (const product of products){
            let needsUpdate = false;
            const newImages = [];
            // images მასივის განახლება
            if (product.images && Array.isArray(product.images)) {
                for (const image of product.images){
                    if (image && image.includes('dsufx8uzd')) {
                        const migrated = await migrateImage(image);
                        newImages.push(migrated.newUrl);
                        needsUpdate = true;
                    } else {
                        newImages.push(image);
                    }
                }
            }
            // brandLogo-ს განახლება
            let newBrandLogo = product.brandLogo;
            if (product.brandLogo && product.brandLogo.includes('dsufx8uzd')) {
                const migrated = await migrateImage(product.brandLogo);
                newBrandLogo = migrated.newUrl;
                needsUpdate = true;
            }
            if (needsUpdate) {
                await db.collection('products').updateOne({
                    _id: product._id
                }, {
                    $set: {
                        images: newImages,
                        brandLogo: newBrandLogo
                    }
                });
                productsUpdated++;
            }
        }
        console.log(`✅ Products updated: ${productsUpdated}\n`);
        // 2. Banners კოლექციის მიგრაცია
        console.log('🖼️ Migrating Banners...');
        const banners = await db.collection('banners').find({}).toArray();
        let bannersUpdated = 0;
        for (const banner of banners){
            if (banner.imageUrl && banner.imageUrl.includes('dsufx8uzd')) {
                const migrated = await migrateImage(banner.imageUrl);
                await db.collection('banners').updateOne({
                    _id: banner._id
                }, {
                    $set: {
                        imageUrl: migrated.newUrl
                    }
                });
                bannersUpdated++;
            }
        }
        console.log(`✅ Banners updated: ${bannersUpdated}\n`);
        // 3. Users კოლექციის მიგრაცია
        console.log('👤 Migrating Users...');
        const users = await db.collection('users').find({}).toArray();
        let usersUpdated = 0;
        for (const user of users){
            let needsUpdate = false;
            const updates = {};
            if (user.storeLogo && user.storeLogo.includes('dsufx8uzd')) {
                const migrated = await migrateImage(user.storeLogo);
                updates.storeLogo = migrated.newUrl;
                needsUpdate = true;
            }
            if (user.profileImagePath && user.profileImagePath.includes('dsufx8uzd')) {
                const migrated = await migrateImage(user.profileImagePath);
                updates.profileImagePath = migrated.newUrl;
                needsUpdate = true;
            }
            if (needsUpdate) {
                await db.collection('users').updateOne({
                    _id: user._id
                }, {
                    $set: updates
                });
                usersUpdated++;
            }
        }
        console.log(`✅ Users updated: ${usersUpdated}\n`);
        // 4. Orders კოლექციაში თუ არის სურათები
        console.log('📦 Checking Orders...');
        const orders = await db.collection('orders').find({}).toArray();
        let ordersUpdated = 0;
        for (const order of orders){
            let needsUpdate = false;
            const newOrderItems = [];
            if (order.orderItems && Array.isArray(order.orderItems)) {
                for (const item of order.orderItems){
                    const newItem = {
                        ...item
                    };
                    if (item.image && item.image.includes('dsufx8uzd')) {
                        newItem.image = replaceCloudinaryUrl(item.image, NEW_CLOUDINARY.cloud_name);
                        needsUpdate = true;
                    }
                    newOrderItems.push(newItem);
                }
            }
            if (needsUpdate) {
                await db.collection('orders').updateOne({
                    _id: order._id
                }, {
                    $set: {
                        orderItems: newOrderItems
                    }
                });
                ordersUpdated++;
            }
        }
        console.log(`✅ Orders updated: ${ordersUpdated}\n`);
        // 5. Cart კოლექციაში თუ არის სურათები
        console.log('🛒 Checking Carts...');
        const carts = await db.collection('carts').find({}).toArray();
        let cartsUpdated = 0;
        for (const cart of carts){
            let needsUpdate = false;
            const newItems = [];
            if (cart.items && Array.isArray(cart.items)) {
                for (const item of cart.items){
                    const newItem = {
                        ...item
                    };
                    if (item.image && item.image.includes('dsufx8uzd')) {
                        newItem.image = replaceCloudinaryUrl(item.image, NEW_CLOUDINARY.cloud_name);
                        needsUpdate = true;
                    }
                    newItems.push(newItem);
                }
            }
            if (needsUpdate) {
                await db.collection('carts').updateOne({
                    _id: cart._id
                }, {
                    $set: {
                        items: newItems
                    }
                });
                cartsUpdated++;
            }
        }
        console.log(`✅ Carts updated: ${cartsUpdated}\n`);
        console.log('🎉 Migration completed successfully!');
        console.log('\n📊 Summary:');
        console.log(`   Products: ${productsUpdated}`);
        console.log(`   Banners: ${bannersUpdated}`);
        console.log(`   Users: ${usersUpdated}`);
        console.log(`   Orders: ${ordersUpdated}`);
        console.log(`   Carts: ${cartsUpdated}`);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        throw error;
    } finally{
        await client.close();
        console.log('\n✅ MongoDB connection closed');
    }
}
// ალტერნატიული: მარტივი URL replacement (სურათების გადატანის გარეშე)
async function runSimpleUrlReplacement() {
    console.log('🚀 Starting Simple URL Replacement...\n');
    console.log('⚠️ This will only replace URLs in database without re-uploading images\n');
    const client = new _mongodb.MongoClient(MONGODB_URI);
    try {
        await client.connect();
        console.log('✅ Connected to MongoDB\n');
        const db = client.db();
        // Products
        const productsResult = await db.collection('products').updateMany({
            images: {
                $regex: 'dsufx8uzd'
            }
        }, [
            {
                $set: {
                    images: {
                        $map: {
                            input: '$images',
                            as: 'img',
                            in: {
                                $replaceAll: {
                                    input: '$$img',
                                    find: 'dsufx8uzd',
                                    replacement: 'dqbre9j3o'
                                }
                            }
                        }
                    }
                }
            }
        ]);
        console.log(`Products updated: ${productsResult.modifiedCount}`);
        // Banners
        const bannersResult = await db.collection('banners').updateMany({
            imageUrl: {
                $regex: 'dsufx8uzd'
            }
        }, [
            {
                $set: {
                    imageUrl: {
                        $replaceAll: {
                            input: '$imageUrl',
                            find: 'dsufx8uzd',
                            replacement: 'dqbre9j3o'
                        }
                    }
                }
            }
        ]);
        console.log(`Banners updated: ${bannersResult.modifiedCount}`);
        // Users storeLogo
        const usersLogoResult = await db.collection('users').updateMany({
            storeLogo: {
                $regex: 'dsufx8uzd'
            }
        }, [
            {
                $set: {
                    storeLogo: {
                        $replaceAll: {
                            input: '$storeLogo',
                            find: 'dsufx8uzd',
                            replacement: 'dqbre9j3o'
                        }
                    }
                }
            }
        ]);
        console.log(`Users (storeLogo) updated: ${usersLogoResult.modifiedCount}`);
        // Users profileImagePath
        const usersProfileResult = await db.collection('users').updateMany({
            profileImagePath: {
                $regex: 'dsufx8uzd'
            }
        }, [
            {
                $set: {
                    profileImagePath: {
                        $replaceAll: {
                            input: '$profileImagePath',
                            find: 'dsufx8uzd',
                            replacement: 'dqbre9j3o'
                        }
                    }
                }
            }
        ]);
        console.log(`Users (profileImagePath) updated: ${usersProfileResult.modifiedCount}`);
        console.log('\n🎉 Simple URL replacement completed!');
    } catch (error) {
        console.error('❌ Replacement failed:', error);
        throw error;
    } finally{
        await client.close();
    }
}
// არგუმენტის მიხედვით გაშვება
const args = process.argv.slice(2);
if (args.includes('--simple')) {
    runSimpleUrlReplacement();
} else {
    runMigration();
}

//# sourceMappingURL=cloudinary-migration.js.map