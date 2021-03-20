/* global db print */
/* eslint no-restricted-globals: "off" */

db.products.remove({});

const productsDB = [
  {
    id: 1,
    name: 'Everlane Slim Fit Jeans',
    pricePerUnit: 15,
    category: 'Jeans',
    imageUrl: 'https://media.gq-magazine.co.uk/photos/5eb40b3aa7a089b1a9138b86/master/w_1024%2cc_limit/20200507-jeans-14.jpg',
  },
  {
    id: 2,
    name: 'Blue Mountain Shirt',
    pricePerUnit: 50,
    category: 'Shirts',
    imageUrl: 'https://media.tractorsupply.com/is/image/TractorSupplyCompany/1497240?$456$',
  },
  {
    id: 3,
    name: 'Puma Ferrari Jacket',
    pricePerUnit: 60,
    category: 'Jackets',
    imageUrl: 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_1750,h_1750/global/595615/02/fnd/IND/fmt/png/Ferrari-Hooded-Kids\'-Sweat-Jacket',
  },
];

db.products.insertMany(productsDB);
const count = db.products.count();
print('Inserted', count, 'products');
db.counters.remove({ _id: 'products' });
db.counters.insert({ _id: 'products', current: count });
db.products.createIndex({ id: 1 }, { unique: true });
db.products.createIndex({ status: 1 });
db.products.createIndex({ owner: 1 });
db.products.createIndex({ created: 1 });
