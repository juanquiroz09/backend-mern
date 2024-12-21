import express from "express";
import morgan from "morgan";
import fileUpload from "express-fileupload";
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import postRoutes from "./routes/posts.routes.js";
import cors from 'cors';

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
const FRONTEND_URL = process.env.FRONTEND_URL || "https://front-mern-context-crud.vercel.app/"

// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configura CORS para permitir solicitudes desde tu frontend
app.use(cors({
  origin: 'https://front-mern-context-crud.vercel.app/'
}));

app.use(
  fileUpload({
    tempFileDir: "./upload",
    useTempFiles: true,
  })
);

// Routes
app.use("/api", postRoutes);

export { app };
