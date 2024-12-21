import express from "express";
import morgan from "morgan";
import fileUpload from "express-fileupload";
import cors from "cors";
import { dirname } from "path";
import { fileURLToPath } from "url";
import postRoutes from "./routes/posts.routes.js";

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
const FRONTEND_URL = process.env.FRONTEND_URL || "https://front-mern-context-crud.vercel.app";

// Middlewares
app.use(morgan("dev")); // Logger para las solicitudes
app.use(express.json()); // Parseo de JSON
app.use(express.urlencoded({ extended: false })); // Parseo de datos de formularios

// Configura CORS para permitir solicitudes desde tu frontend
app.use(
  cors({
    origin: FRONTEND_URL, // URL dinámica desde variable de entorno
    methods: ["GET", "POST", "PUT", "DELETE"], // Métodos HTTP permitidos
    allowedHeaders: ["Content-Type", "Authorization"], // Headers permitidos
  })
);

// Configuración para manejo de archivos
app.use(
  fileUpload({
    tempFileDir: "./upload",
    useTempFiles: true,
  })
);

// Ruta para la raíz del backend
app.get("/", (req, res) => {
  res.send("Bienvenido al backend en producción"); // Mensaje para verificar que el servidor está activo
});

// Rutas de la API
app.use("/api", postRoutes);

// Exporta la aplicación
export { app };
