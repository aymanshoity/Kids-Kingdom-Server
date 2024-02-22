const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;

// middleware
const corsConfig = {
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
}
app.use(cors(corsConfig))
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.je93mhd.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});





async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const toysCollection = client.db("Kids-Kindom").collection("toys");
        const productCollection = client.db("Kids-Kindom").collection("Cart");

        app.get('/', (req, res) => {
            res.send('Kids-Kingdom is opening')
        })

        app.get('/toys', async (req, res) => {
            const toys = await toysCollection.find().toArray()
            res.send(toys)
        })
        app.get('/toys/:brand', async (req, res) => {
            const brandName=req.params.brand
            const query={brandName:brandName}
            const toys = await toysCollection.find(query).toArray()
            res.send(toys)
        })
        app.get('/toys/:brand/:id', async (req, res) => {
            const id=req.params.id
            const query={_id:new ObjectId(id)}
            const toy = await toysCollection.findOne(query)
            res.send(toy)
        })
        app.post('/toys',async(req,res)=>{
            const toys=req.body;
            const result=await toysCollection.insertOne(toys)
            res.send(result)
        })
        app.post('/Cart',async(req,res)=>{
            const product=req.body;
            const result=await productCollection.insertOne(product)
            res.send(result)
        })
        app.get('/Cart/:email',async(req,res)=>{
            const email=req.params.email;
            const query={ClientEmail: email}
            const result=await productCollection.find(query).toArray()
            res.send(result)

        })





        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);






app.listen(port, () => {
    console.log(`Kids Kindom Server is running on port ${port}`)
})