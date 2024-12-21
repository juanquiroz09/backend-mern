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
const FRONTEND_URL = process.env.FRONTEND_URL || "https://front-mern-context-crud-atjzbe2lh-juanquiroz09s-projects.vercel.app/"

// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configuración básica para permitir todas las solicitudes
app.use(cors());

app.use(
  fileUpload({
    tempFileDir: "./upload",
    useTempFiles: true,
  })
);

// Routes
app.use("/api", postRoutes);

// Redirigir cualquier otra ruta al front-end
app.get('*', (req, res) => {
  res.redirect(`${FRONTEND_URL}${req.originalUrl}`);
});

export { app };
