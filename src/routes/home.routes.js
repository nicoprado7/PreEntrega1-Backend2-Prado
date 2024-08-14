import { Router } from "express";
import ProductManager from "../managers/product.manager.js";
import { ERROR_SERVER } from "../constants/messages.constant.js";

const router = Router();
const productManager = new ProductManager();
const currentCartId = "66afb410c37231583bdbf367"; // ID del carrito actual

// Ruta para obtener todos los productos con opciones de consulta y mostrar la vista principal
router.get("/", async (req, res) => {
    try {
    // Obtener todos los productos según los parámetros de consulta
        const data = await productManager.getAll(req.query);

        // Manejar el parámetro de ordenamiento si está presente
        const sort = req.query?.sort ? `&sort=${req.query.sort}` : "";

        // Asignar el ID del carrito actual a los datos de respuesta
        data.sort = sort;
        data.currentCartId = currentCartId;

        // Añadir el ID del carrito actual a cada producto en la lista de productos
        data.docs = data.docs.map((doc) => ({ ...doc, currentCartId }));

        // Renderizar la vista principal con los datos
        res.status(200).render("index", { title: "Inicio", data });
    } catch (error) {
    // Manejo de errores
        console.error("Error en la ruta principal:", error);
        res.status(500).json({ status: false, message: ERROR_SERVER });
    }
});

// Ruta para renderizar la vista de productos en tiempo real
router.get("/real-time-products", async (req, res) => {
    try {
    // Renderizar la vista de productos en tiempo real
        res.status(200).render("realTimeProducts", { title: "Tiempo Real" });
    } catch (error) {
    // Manejo de errores
        console.error("Error al renderizar productos en tiempo real:", error);
        res.status(500).json({ status: false, message: ERROR_SERVER });
    }
});

export default router;