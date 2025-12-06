const { MongoClient } = require('mongodb');

async function run() {
  const client = new MongoClient(
    'mongodb+srv://fishhuntgeo:w4fc9PXQLDYwNUUe@ecommerce.ddxri.mongodb.net/?retryWrites=true&w=majority',
  );

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('test');
    const collections = [
      'products',
      'banners',
      'orders',
      'carts',
      'users',
      'categories',
      'subcategories',
    ];

    for (const colName of collections) {
      const collection = db.collection(colName);
      const docs = await collection.find({}).toArray();
      let count = 0;

      for (const doc of docs) {
        const originalId = doc._id;
        const str = JSON.stringify(doc);
        if (str.includes('dsufx8uzd')) {
          const newStr = str.replace(/dsufx8uzd/g, 'dqbre9j3o');
          const newDoc = JSON.parse(newStr);
          delete newDoc._id; // Remove _id to avoid immutable field error
          await collection.updateOne({ _id: originalId }, { $set: newDoc });
          count++;
        }
      }

      console.log(`${colName}: ${count} documents updated`);
    }

    console.log('Done!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

run();
