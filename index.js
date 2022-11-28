const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId, } = require('mongodb');
const { query } = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();


app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.9pyp5ct.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {

    try {

        const categoriesCollection = client.db('autoshop').collection('brandsCategories');
        const productCollection = client.db('autoshop').collection('products');
        const bookingCarCollection = client.db('autoshop').collection('bookings');
        const usersCollection = client.db('autoshop').collection('users');
        const addProductsCollection = client.db('autoshop').collection('addProducts');


        //categories

        app.get('/brandsCategories', async (req, res) => {
            const query = {};
            const category = await categoriesCollection.find(query).toArray();
            res.send(category);

        })


        app.get('/addProductsCategories', async (req, res) => {
            const query = {}
            const result = await categoriesCollection.find(query).project({ brands: 1 }).toArray()
            res.send(result)
        })


        //products

        app.get('/products-car', async (req, res) => {

            const brands = req.query.brands;
            const query = { brands: brands }
            const cursor = productCollection.find(query)
            const result = await cursor.toArray()
            res.send(result);

        })

        //bookings 

        app.get('/bookings', async (req, res) => {
            const email = req.query.email
            const query = { email: email }
            const bookings = await bookingCarCollection.find(query).toArray();
            res.send(bookings)

        })

        app.post('/bookings', async (req, res) => {
            const booking = req.body
            console.log(booking)
            const result = await bookingCarCollection.insertOne(booking)
            res.send(result)


        })



        //allUsers

        app.get('/users', async (req, res) => {
            const query = {}
            const users = await usersCollection.find(query).toArray();
            res.send(users);
        });

        //users

        app.get('/users/seller/:email', async (req, res) => {
            const email = req.params.email
            const query = { email }
            const user = await usersCollection.findOne(query);
            res.send({ isSeller: user?.seller === true });
        })



        app.post('/users', async (req, res) => {
            const user = req.body
            console.log(user)
            const result = await usersCollection.insertOne(user);
            res.send(result)


        });


        //admin


        app.get('/users/admin/:email', async (req, res) => {
            const email = req.params.email
            const query = { email }
            const user = await usersCollection.findOne(query);
            res.send({ isAdmin: user?.role === 'admin' });
        })


        app.put('/users/admin/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updateDocs = {
                $set: {
                    role: 'admin'
                }
            }

            const result = await usersCollection.updateOne(filter, updateDocs, options)
            res.send(result);
        })

        app.delete('/users/admin/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const result = await usersCollection.deleteOne(filter);
            res.send(result);
        })

        //add Products


        app.get('/addProducts', async (req, res) => {

            const query = {}
            const products = await addProductsCollection.find(query).toArray();
            res.send(products)

        })


        app.post('/addProducts', async (req, res) => {
            const product = req.body
            console.log(product)
            const result = await addProductsCollection.insertOne(product)
            res.send(result)

        })



    }

    finally {



    }

}

run().catch(console.log)


app.get('/', (req, res) => {
    res.send('THE SERVER IS RUNNING ON LOCALHOST 5000')
});

app.listen(port, () => {

    console.log(`server is running on ${port}`)
})