const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = 5000;

// middleWare
app.use(cors());

app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zbpbuag.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const travelCollection = client.db("travelDB").collection("travel");
    const blocCollection = client.db("travelDB").collection("blog");
    const countryCollection = client.db("travelDB").collection("countries");
    app.get("/countriesData", async (req, res) => {
      const cursor = countryCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/blogs", async (req, res) => {
      const cursor = blocCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/travels", async (req, res) => {
      const cursor = travelCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/myProduct/:email", async (req, res) => {
      const result = await travelCollection
        .find({ email: req.params.email })
        .toArray();
      res.send(result);
    });

    app.get("/singleProduct/:id", async (req, res) => {
      console.log(req.params.id);
      result = await travelCollection.findOne({
        _id: new ObjectId(req.params.id),
      });
      res.send(result);
    });

    app.post("/travels", async (req, res) => {
      const newTravel = req.body;
      console.log(newTravel);
      const result = await travelCollection.insertOne(newTravel);
      res.send(result);
    });

    // app.get("/travels/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: new ObjectId(id) };
    //   const result = await travelCollection.findOne(query);
    //   res.send(result);
    // });

    app.put("/updateProduct/:id", async (req, res) => {
      const travelId = req.params.id;

      // Convert the string ID to ObjectId
      const filter = { _id: new ObjectId(travelId) };
      const options = { upsert: true };
      const updatedTravel = req.body;
      const travel = {
        $set: {
          country: updatedTravel.country,
          touristSport: updatedTravel.touristSport,
          location: updatedTravel.location,
          averageCost: updatedTravel.averageCost,
          description: updatedTravel.description,
          image: updatedTravel.image,
          travelTime: updatedTravel.travelTime,
          visitors: updatedTravel.visitors,
          seasonality: updatedTravel.seasonality,
          email: updatedTravel.email,
          name: updatedTravel.name,
        },
      };
      const result = await travelCollection.updateOne(filter, travel, options);
      res.send(result);
    });

    app.delete("/deleteData/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await travelCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hero is created");
});

app.listen(port, () => {
  console.log(`Traveler hero is running on : ${port}`);
});
