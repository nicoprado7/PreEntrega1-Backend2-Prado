import { Router } from "express";
import ProductManager from "../../managers/product.manager.js";
import uploader from "../../utils/uploader.js";

import {
    ERROR_INVALID_ID,
    ERROR_NOT_FOUND_ID,
} from "../../constants/messages.constant.js";

const router = Router();
const productManager = new ProductManager();

const handleError = (res, message) => {
    if (message === ERROR_INVALID_ID) return res.status(400).json({ status: false, message: ERROR_INVALID_ID });
    if (message === ERROR_NOT_FOUND_ID) return res.status(404).json({ status: false, message: ERROR_NOT_FOUND_ID });
    return res.status(500).json({ status: false, message });
};

router.get("/", async (req, res) => {
    try {
        const products = await productManager.getAll(req.query);
        res.status(200).json({ status: true, payload: products });
    } catch (error) {
        handleError(res, error.message);
    }
});

router.get("/:id", async (req, res) => {
    try {
        const product = await productManager.getOneById(req.params.id);
        res.status(200).json({ status: true, payload: product });
    } catch (error) {
        handleError(res, error.message);
    }
});

router.post("/", uploader.single("file"), async (req, res) => {
    try {
        const { file } = req;
        const product = await productManager.insertOne(req.body, file?.filename);
        res.status(201).json({ status: true, payload: product });
    } catch (error) {
        handleError(res, error.message);
    }
});

router.put("/:id", uploader.single("file"), async (req, res) => {
    try {
        const { file } = req;
        const product = await productManager.updateOneById(req.params.id, req.body, file?.filename);
        res.status(200).json({ status: true, payload: product });
    } catch (error) {
        handleError(res, error.message);
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const product = await productManager.deleteOneById(req.params.id);
        res.status(200).json({ status: true, payload: product });
    } catch (error) {
        handleError(res, error.message);
    }
});

export default router;