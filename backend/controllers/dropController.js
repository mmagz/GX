import dropModel from '../models/dropModel.js';
import productModel from '../models/productModel.js';

// Get current active drop
export const getCurrentDrop = async (req, res) => {
    try {
        const currentDrop = await dropModel.findOne({ isCurrent: true });
        
        if (!currentDrop) {
            return res.status(404).json({
                success: false,
                message: 'No current drop found'
            });
        }

        res.status(200).json({
            success: true,
            drop: currentDrop
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching current drop',
            error: error.message
        });
    }
};

// Get all drops (for admin)
export const getAllDrops = async (req, res) => {
    try {
        const drops = await dropModel.find().sort({ dropCode: -1 });
        
        res.status(200).json({
            success: true,
            drops
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching drops',
            error: error.message
        });
    }
};

// Create new drop
export const createDrop = async (req, res) => {
    try {
        const { dropCode, name, title, description, season, date, bannerUrl } = req.body;

        // Check if drop code already exists
        const existingDrop = await dropModel.findOne({ dropCode });
        if (existingDrop) {
            return res.status(400).json({
                success: false,
                message: 'Drop code already exists'
            });
        }

        const newDrop = new dropModel({
            dropCode,
            name,
            title,
            description,
            season,
            date,
            bannerUrl,
            isCurrent: true // New drop becomes current
        });

        await newDrop.save();

        res.status(201).json({
            success: true,
            message: 'Drop created successfully',
            drop: newDrop
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating drop',
            error: error.message
        });
    }
};

// Archive a drop (move to vault)
export const archiveDrop = async (req, res) => {
    try {
        const { dropCode } = req.params;

        const drop = await dropModel.findOne({ dropCode });
        if (!drop) {
            return res.status(404).json({
                success: false,
                message: 'Drop not found'
            });
        }

        // Check if all products in this drop are sold out
        const products = await productModel.find({ dropCode: parseInt(dropCode) });
        const hasStock = products.some(product => product.stock > 0);

        if (hasStock) {
            return res.status(400).json({
                success: false,
                message: 'Cannot archive drop - products still in stock'
            });
        }

        // Update drop status
        drop.status = 'ARCHIVED';
        drop.isCurrent = false;
        drop.archivedAt = new Date();
        await drop.save();

        res.status(200).json({
            success: true,
            message: 'Drop archived successfully',
            drop
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error archiving drop',
            error: error.message
        });
    }
};

// Get archived drops (for vault page)
export const getArchivedDrops = async (req, res) => {
    try {
        const archivedDrops = await dropModel.find({ status: 'ARCHIVED' }).sort({ dropCode: -1 });
        
        res.status(200).json({
            success: true,
            drops: archivedDrops
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching archived drops',
            error: error.message
        });
    }
};

// Update drop status
export const updateDropStatus = async (req, res) => {
    try {
        const { dropCode } = req.params;
        const { status } = req.body;

        const drop = await dropModel.findOne({ dropCode });
        if (!drop) {
            return res.status(404).json({
                success: false,
                message: 'Drop not found'
            });
        }

        drop.status = status;
        if (status === 'ARCHIVED') {
            drop.isCurrent = false;
            drop.archivedAt = new Date();
        }
        
        await drop.save();

        res.status(200).json({
            success: true,
            message: 'Drop status updated successfully',
            drop
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating drop status',
            error: error.message
        });
    }
};
