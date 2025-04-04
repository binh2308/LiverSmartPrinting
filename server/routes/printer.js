import express from "express";
import Printer from "../models/printer.js";
import multer from "multer";
import path from "path";

const router = express.Router();

//View printers
router.get('/', async (req, res) => {
    try {
        const printers = await Printer.find();
        res.json({ success: true, printers });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
});

//View printer by printerId
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const printer = await Printer.findById(id);
        if (!printer) {
            return res.status(404).json({
              success: false,
              message: 'Printer not found',
            });
          }
        res.json({ success: true, printer });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
});

//Add a printer
router.post('/create', async (req, res) => {
    const { name, price, type, image, information } = req.body;
    if (!name || !price || !type || !information) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }
    try {
        const newPrinter = new Printer({ name, price, type, image, status : "Enable", information })
        await newPrinter.save()
        res.status(200).json({ success: true, message: 'Create success', printer: newPrinter })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
});

// Update a printer
router.put('/:id', async (req, res) => {
    const { name, price, type, image, information, status } = req.body;
    try {
        let updatedPrinter = { name, price, type, image, information };
        // Nếu status được truyền vào thì cập nhật status, nếu không thì giữ nguyên status cũ
        if (status !== undefined) {
            updatedPrinter.status = status;
        }
        const postUpdateCondition = { _id: req.params.id };
        updatedPrinter = await Printer.findOneAndUpdate(postUpdateCondition, updatedPrinter, { new: true });
        // Nếu không tìm thấy máy in
        if (!updatedPrinter) {
            return res.status(401).json({ success: false, message: 'Printer not found or user not authorized' });
        }
        res.json({ success: true, message: 'Update successful!', updatedPrinter });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

//Delete a printer
router.delete('/:id', async (req, res) => {
    try {
        const postDeleteCondition = { _id: req.params.id };
        const deletedPrinter = await Printer.findOneAndDelete(postDeleteCondition);
        //User not authorised or printer not found
        if (!deletedPrinter)
            return res.status(401).json({ success: false, message: 'Printer not found or user not authorise' })
        res.json({ success: true, printer: deletedPrinter });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
});

export default router;

