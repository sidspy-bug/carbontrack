// ============================================
// CarbonTrack - Carbon Emission Factors
// File: utils/carbonFactors.js
// Purpose: Store emission constants for calculations
// ============================================

// All factors are represented in kg CO2e per unit

const CARBON_FACTORS = {

    transport: {
        car: 0.192,   // per km (average petrol car)
        bus: 0.105,   // per km (local bus)
        bike: 0.0,    // zero emissions for bicycle
        train: 0.041  // per km (national rail)
    },

    electricity: 0.85, // per kWh (depends on grid, using a generic high estimate)

    food: 2.5, // per meal (average non-vegetarian meal estimate)

    water: 0.001, // per litre (treatment and pumping)

    waste: 0.5 // per kg of general waste

};

module.exports = CARBON_FACTORS;
