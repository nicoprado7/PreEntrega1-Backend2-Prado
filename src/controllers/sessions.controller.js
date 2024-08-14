import jwt from "jsonwebtoken";
import User from "../models/user.models.js";

// Función para iniciar sesión y generar un token JWT
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Verificar si el usuario existe
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Credenciales incorrectas" });
        }

        // Verificar la contraseña
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Credenciales incorrectas" });
        }

        // Generar el token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" },
        );

        res.status(200).json({ token });
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

// Función para obtener el usuario actual basado en el token
export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Error al obtener usuario actual:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

// Desloguearse
export const logoutUser = (req, res) => {
    try {
        // Elimina el token del lado del cliente
        res.clearCookie("token");

        res.status(200).json({ message: "Cierre de sesión exitoso" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};