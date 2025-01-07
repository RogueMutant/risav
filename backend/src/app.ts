require("dotenv").config();
import express, { Application, Request, Response } from "express";
import notFoundError from "./errors/notFound";
const {connectDb} = require("./db/connect");


const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.static("uploads"));
app.use(notFoundError)


app.get("/", (req:Request, res:Response) => {
    res.send("Hello World");
})

const start = async (): Promise<void> => {
    try {
        await connectDb();
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    } catch (error) {
        console.error(error);
    }
}

start()