const { MongoClient } = require('mongodb');

const PLACEHOLDER_IMAGE =
  'https://res.cloudinary.com/dqbre9j3o/image/upload/v1765026400/ecommerce/h0s3zygdovjif8dkepty.jpg';

// These are the broken image IDs that return 404
const BROKEN_IMAGE_IDS = [
  'iepgkawjlafrbfnqisel',
  'regrzcwcnom9au8kuntj',
  'ulmb5ivtkfgh1tdbffwn',
  'oedqsaybuajgyjcppvbm',
  'zty4vxnz9oqyfymmkcys',
  'ugv0tpmknjynhi2ewnb8',
  'hewoyp76cfqccykiliuc',
  'zyr4v8qxpxvjrqw10vhk',
  'a1d7msjewxxvuxntbklf',
  'giepij2twbxmppmie14a',
  'sqyioz3myozha58mjufe',
  'cwvqmllh4zpvomureswl',
  'yzwnys7cz125uxxssq4e',
  'ugpjd7hbxpk7l7rghejw',
  'axeobhuv6lqykrqfi8dv',
  'qtdleofi37qirrd5nxnv',
  'tmvp6nvzaswr7br1o3kb',
];

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
        let str = JSON.stringify(doc);
        let hasChanges = false;

        // Check if any broken image ID exists in this document
        for (const brokenId of BROKEN_IMAGE_IDS) {
          if (str.includes(brokenId)) {
            // Replace any URL containing this broken image ID with the placeholder
            const regex = new RegExp(
              `https://res\\.cloudinary\\.com/[^/]+/image/upload/[^"]*${brokenId}[^"]*`,
              'g',
            );
            str = str.replace(regex, PLACEHOLDER_IMAGE);
            hasChanges = true;
          }
        }

        if (hasChanges) {
          const newDoc = JSON.parse(str);
          delete newDoc._id;
          await collection.updateOne({ _id: originalId }, { $set: newDoc });
          count++;
        }
      }

      if (count > 0) {
        console.log(`${colName}: ${count} documents updated`);
      }
    }

    console.log('Done!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

run();
