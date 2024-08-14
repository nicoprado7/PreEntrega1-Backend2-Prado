import User from "../models/user.models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// Función para registrar un nuevo usuario
export const registerUser = async (req, res) => {
    const { firstName, lastName, email, password, age } = req.body;

    try {
        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "El usuario ya existe" });
        }

        // Encriptar contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear nuevo usuario
        const newUser = new User({ firstName, lastName, email, password: hashedPassword, age });
        await newUser.save();

        res.status(201).json({ message: "Usuario creado exitosamente" });
    } catch (error) {
        console.error("Error al registrar el usuario:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

// Función para autenticar un usuario
export const authenticateUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Buscar usuario por email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Credenciales incorrectas" });
        }

        // Comparar contraseñas
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }

        // Generar token JWT
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

        // Responder con el perfil del usuario y el token
        res.status(200).json({
            message: "Autenticación exitosa",
            token,
            userProfile: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                age: user.age,
            },
        });
    } catch (error) {
        console.error("Error al autenticar al usuario:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

// Función para obtener todos los usuarios
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

// Función para obtener un usuario por ID
export const getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        // Verificar si el ID es válido
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "ID de usuario inválido" });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Error al obtener usuario por ID:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

// Función para eliminar un usuario por ID
export const deleteUserById = async (req, res) => {
    const { id } = req.params;

    try {
        // Verificar si el ID es válido
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "ID de usuario inválido" });
        }

        // Eliminar el usuario
        const result = await User.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.status(200).json({ message: "Usuario eliminado exitosamente" });
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        res.status(500).json({ message: "Error al eliminar el usuario" });
    }
};