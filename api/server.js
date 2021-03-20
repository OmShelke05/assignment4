/* eslint linebreak-style: ["error", "windows"] */

const fs = require('fs');
require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { MongoClient } = require('mongodb');

const url = process.env.DB_URL || 'mongodb+srv://test:test123@freecluster.qty0x.mongodb.net/inventorydb?retryWrites=true&w=majority';
const port = process.env.API_SERVER_PORT || 3000;

let db;

async function getNextSequence(name) {
  const result = await db.collection('counters').findOneAndUpdate(
    { _id: name },
    { $inc: { current: 1 } },
    { returnOriginal: false },
  );
  return result.value.current;
}

async function productList() {
  const products = await db.collection('products').find({}).toArray();
  return products;
}

async function addProduct(_, { product }) {
  const newProduct = Object.assign({}, product);
  newProduct.id = await getNextSequence('products');
  const result = await db.collection('products').insertOne(newProduct);
  const savedProduct = await db.collection('products')
    .findOne({ _id: result.insertedId });
  return savedProduct;
}

const resolvers = {
  Query: {
    productList,
  },
  Mutation: {
    addProduct,
  },
};

async function connectToDb() {
  const client = new MongoClient(url, { useNewUrlParser: true });
  await client.connect();
  console.log('Connected to MongoDB at', url);
  db = client.db();
}

const server = new ApolloServer({
  typeDefs: fs.readFileSync('schema.graphql', 'utf-8'),
  resolvers,
});

const app = express();

server.applyMiddleware({ app, path: '/graphql' });

(async function start() {
  try {
    await connectToDb();
    app.listen(port, () => {
      console.log(`API server started on port ${port}`);
    });
  } catch (err) {
    console.log('ERROR:', err);
  }
}());
