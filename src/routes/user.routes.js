import express from "express";
import {
    registerUser,
    getAllUsers,
    getUserById,
    deleteUserById,
    authenticateUser,
} from "../controllers/user.controller.js";

const router = express.Router();

// Ruta para registrar un usuario
router.post("/register", registerUser);

// Ruta para autenticar un usuario
router.post("/login", authenticateUser);

// Ruta para obtener todos los usuarios
router.get("/", getAllUsers);

// Ruta para obtener un usuario por ID
router.get("/:id", getUserById);

// Ruta para eliminar un usuario por ID
router.delete("/:id", deleteUserById);

export default router;