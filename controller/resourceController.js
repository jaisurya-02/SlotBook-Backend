const Resource = require('../models/Resource');

// Get all resources
module.exports.getAllResources = async (req, res) => {
    try {
        const resources = await Resource.find();
        res.status(200).json({ resources });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single resource by ID
module.exports.getResourceById = async (req, res) => {
    try {
        const { id } = req.params;
        const resource = await Resource.findById(id);
        
        if (!resource) {
            return res.status(404).json({ error: "Resource not found" });
        }
        
        res.status(200).json({ resource });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create a new resource
module.exports.createResource = async (req, res) => {
    try {
        const { name, description, category, location, capacity, features, imageUrl } = req.body;
        
        const resource = await Resource.create({
            name,
            description,
            category,
            location,
            capacity,
            features,
            imageUrl
        });
        
        res.status(201).json({ message: "Resource created successfully", resource });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update a resource
module.exports.updateResource = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        const resource = await Resource.findByIdAndUpdate(id, updates, { 
            new: true, 
            runValidators: true 
        });
        
        if (!resource) {
            return res.status(404).json({ error: "Resource not found" });
        }
        
        res.status(200).json({ message: "Resource updated successfully", resource });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a resource
module.exports.deleteResource = async (req, res) => {
    try {
        const { id } = req.params;
        
        const resource = await Resource.findByIdAndDelete(id);
        
        if (!resource) {
            return res.status(404).json({ error: "Resource not found" });
        }
        
        res.status(200).json({ message: "Resource deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get resources by category
module.exports.getResourcesByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const resources = await Resource.find({ category });
        
        res.status(200).json({ resources });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get available resources
module.exports.getAvailableResources = async (req, res) => {
    try {
        const resources = await Resource.find({ availability: true });
        res.status(200).json({ resources });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
