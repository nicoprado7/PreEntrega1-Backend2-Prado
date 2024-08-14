import express from "express";
import jwt from "jsonwebtoken";
import passport from "passport";
import User from "../../models/user.models.js"; // Asegúrate de que la ruta sea correcta
import { logoutUser } from "../../controllers/sessions.controller.js";

const router = express.Router();

// Ruta para mostrar la vista de login
router.get("/login", (req, res) => {
    res.render("login");
});

// Ruta para mostrar la vista de registro
router.get("/register", (req, res) => {
    res.render("register");
});

// Ruta para manejar el inicio de sesión
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Busca al usuario en la base de datos
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "Credenciales incorrectas" });
        }

        // Verifica la contraseña
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ message: "Credenciales incorrectas" });
        }

        // Genera el token JWT
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        // Almacena el token en una cookie
        res.cookie("jwt", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });

        // Redirige al perfil del usuario
        res.redirect("/profile");
    } catch (error) {
        console.error("Error en el inicio de sesión:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

// Ruta para manejar el registro de usuario
router.post("/register", async (req, res) => {
    const { firstName, lastName, email, password, age } = req.body;

    try {
        // Verifica si el usuario ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "El usuario ya existe" });
        }

        // Crea un nuevo usuario
        const newUser = new User({ firstName, lastName, email, password, age });
        await newUser.save();

        res.redirect("/login");
    } catch (error) {
        console.error("Error en el registro:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

// Ruta para obtener la información del usuario actual
router.get("/current", passport.authenticate("jwt", { session: false }), (req, res) => {
    res.json({
        user: req.user,
        message: "Usuario autenticado correctamente",
    });
});

// Ruta para mostrar la vista del perfil del usuario
router.get("/profile", passport.authenticate("jwt", { session: false }), (req, res) => {
    res.render("profile", { user: req.user });
});

// Ruta para manejar el cierre de sesión
router.post("/logout", logoutUser);

export default router;