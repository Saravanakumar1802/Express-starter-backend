import express from "express";
import { MongoClient } from "mongodb";
import * as dotenv from 'dotenv'

dotenv.config()
const app = express();

const PORT = process.env.PORT;
app.get("/", function (request, response) {
    response.send("🙋‍♂️, 🌏 🎊✨🤩");
});

// const MONGO_URL = "mongodb://127.0.0.1"; 
const MONGO_URL = process.env.MONGO_URL;
const client = new MongoClient(MONGO_URL); //Dial

//!Top-level await  
await client.connect(); //Call
console.log("Mongo is connected! ");

// app.use(express.json());

app.use(express.json()); //Middleware

//! Get Data -> mongodb 
app.get("/movies", async function (request, response) {
    //db.users.find({})
    //!cursor->Pagination || cursor -> array | toArray();
    if (request.query.rating) {
        // request.query.rating = Number(request.query.rating)
        request.query.rating = +(request.query.rating)
    }
    const movies = await client
        .db('samdb')
        .collection('users')
        .find(request.query)
        .toArray();

    console.log(movies);
    response.send(movies);
});

//! Find by id -> mongodb 
app.get("/movies/:id", async function (request, response) {
    const { id } = request.params;
    //db.movies.findOne({id:"100"})

    const movie = await client
        .db("samdb")
        .collection("users")
        .findOne({ id: id })

    // const movie = movies.find((mv) => mv.id === id);
    console.log(movie);

    movie ? response.send(movie) : response.status(404).send({ message: "Movie not Found" })
});

//!Post - Method -> mongodb 
app.post("/movies", async function (request, response) {
    const data = request.body;
    console.log(data);
    //db.samdb.insertMany(data); => Mongodb query

    const res = await client.db('samdb').collection('users').insertMany(data);
    response.send(res);
});


app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨✨`));


//! PUT 
app.put("/movies/:id", async function (request, response) {
    const { id } = request.params;
    const data = request.body;
    // db.movies.updateOne({ id: "100" }, { $set: { rating: 7 } })
    const updateMovie = await client
        .db("samdb")
        .collection("users")
        .updateOne({ id: id }, { $set: data });

    console.log(updateMovie);

    updateMovie
        ? response.send(`Movie Updated Successfully`)
        : response.status(404).send({ message: "Movie not Found" })
});



//!Delete data by ID
app.delete("/movies/:id", async function (request, response) {
    const { id } = request.params;
    //db.movies.deleteOne({id:"100"})

    const deleteMovie = await client
        .db("samdb")
        .collection("users")
        .deleteOne({ id: id })

    console.log(deleteMovie);

    deleteMovie.deletedCount > 0
        ? response.send(`Movie Deleted Successfully`)
        : response.status(404).send({ message: "Movie not Found" })
});