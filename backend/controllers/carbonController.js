// ============================================
// CarbonTrack - Carbon Controller
// File: controllers/carbonController.js
// Purpose: Handle adding, retrieving, updating,
//          and deleting carbon entries.
// ============================================

const {
    createEntry,
    getEntriesByUser,
    updateEntry,
    deleteEntry
} = require("../models/carbonModel");

const { validateCarbonEntryInput } = require("../utils/validation");
const FACTORS = require("../utils/carbonFactors");

// Helper: Calculate total carbon from inputs
function calculateTotalCarbon(data) {

    const cCar = (parseFloat(data.transportCar) || 0) * FACTORS.transport.car;
    const cBus = (parseFloat(data.transportBus) || 0) * FACTORS.transport.bus;
    const cBike = (parseFloat(data.transportBike) || 0) * FACTORS.transport.bike;
    const cTrain = (parseFloat(data.transportTrain) || 0) * FACTORS.transport.train;
    
    const cElec = (parseFloat(data.electricity) || 0) * FACTORS.electricity;
    const cFood = (parseFloat(data.food) || 0) * FACTORS.food;
    const cWater = (parseFloat(data.water) || 0) * FACTORS.water;
    const cWaste = (parseFloat(data.waste) || 0) * FACTORS.waste;

    return cCar + cBus + cBike + cTrain + cElec + cFood + cWater + cWaste;

}

// ============================================
// ADD ENTRY (Module 3)
// ============================================

async function addEntry(req, res) {

    try {

        const userId = req.user.id;
        const data = req.body;

        // Validation
        const validationError = validateCarbonEntryInput(data);
        if (validationError) {
            return res.status(400).json({
                success: false,
                message: validationError
            });
        }

        // Set entry date to today if not provided
        if (!data.entryDate) {
            data.entryDate = new Date().toISOString().split('T')[0];
        }

        // Calculate total carbon
        data.totalCarbon = calculateTotalCarbon(data);

        // Store in DB
        await createEntry(userId, data);

        return res.status(201).json({
            success: true,
            message: "Carbon entry added successfully",
            totalCarbon: data.totalCarbon
        });

    } catch (error) {
        console.error("Add Entry Error:", error);
        return res.status(500).json({
            success: false,
            message: "Server Error adding entry"
        });
    }

}

// ============================================
// GET HISTORY (Module 4)
// ============================================

async function getHistory(req, res) {

    try {

        const userId = req.user.id;
        
        const entries = await getEntriesByUser(userId);

        return res.status(200).json({
            success: true,
            entries
        });

    } catch (error) {
        console.error("Get History Error:", error);
        return res.status(500).json({
            success: false,
            message: "Server Error loading history"
        });
    }

}

// ============================================
// UPDATE ENTRY (Module 4)
// ============================================

async function updateCarbonEntry(req, res) {

    try {

        const userId = req.user.id;
        const entryId = req.params.id;
        const data = req.body;

        // Validation
        const validationError = validateCarbonEntryInput(data);
        if (validationError) {
            return res.status(400).json({
                success: false,
                message: validationError
            });
        }

        // Recalculate total carbon
        data.totalCarbon = calculateTotalCarbon(data);

        await updateEntry(entryId, userId, data);

        return res.status(200).json({
            success: true,
            message: "Carbon entry updated successfully",
            totalCarbon: data.totalCarbon
        });

    } catch (error) {
        console.error("Update Entry Error:", error);
        return res.status(500).json({
            success: false,
            message: "Server Error updating entry"
        });
    }

}

// ============================================
// DELETE ENTRY (Module 4)
// ============================================

async function deleteCarbonEntry(req, res) {

    try {

        const userId = req.user.id;
        const entryId = req.params.id;

        await deleteEntry(entryId, userId);

        return res.status(200).json({
            success: true,
            message: "Carbon entry deleted successfully"
        });

    } catch (error) {
        console.error("Delete Entry Error:", error);
        return res.status(500).json({
            success: false,
            message: "Server Error deleting entry"
        });
    }

}

module.exports = {
    addEntry,
    getHistory,
    updateCarbonEntry,
    deleteCarbonEntry
};
