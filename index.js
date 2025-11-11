const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xmhcw4e.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// ------midlware------------

app.use(cors());
app.use(express.json());

//......................................

app.get("/", (req, res) => {
  res.send("Habit Tracker server is running");
});

// mongo db funtion

async function run() {
  try {
    await client.connect();
    const db = client.db("habit_tracker");
    const habitsCollection = db.collection("habits");
    // ------for---users--------------
    app.get("/habits", async (req, res) => {
      const cursor = habitsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/latest-habits", async (req, res) => {
      const cursor = habitsCollection.find().sort({ createdAt: -1 }).limit(6);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/habits", async (req, res) => {
      const newHabit = req.body;
      newHabit.createdAt = new Date();
      const result = await habitsCollection.insertOne(newHabit);
      res.send(result);
    });

    app.get("/habits/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await habitsCollection.findOne(query);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`habit tracker server is running on port : ${port}`);
});
