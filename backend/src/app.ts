require("dotenv").config();
import express, { Application, Request, Response } from "express";
import notFoundError from "./middleware/notFound";
import { connectDb } from "./db/connect";
import userAuth from "./routes/auth";

const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use('/auth', userAuth)

app.use(notFoundError);

app.get("/", (req: Request, res: Response)=>{
    res.send("hello world")
})

const start = async (): Promise<void> => {
    try {
        await connectDb();
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    } catch (error) {
        console.error("Error starting server", error);
    }
};

start();