const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId, } = require('mongodb');
const { query } = require('express');
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


        //categories

        app.get('/brandsCategories', async (req, res) => {
            const query = {};
            const category = await categoriesCollection.find(query).toArray();
            res.send(category);

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
            const email = req.query.email;
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

        //users

        app.post('/users', async (req, res) => {
            const myUser = req.body
            const result = await usersCollection.insertOne(myUser)
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