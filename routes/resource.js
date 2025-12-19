const express = require('express');
const router = express.Router();
const {
    getAllResources,
    getResourceById,
    createResource,
    updateResource,
    deleteResource,
    getResourcesByCategory,
    getAvailableResources
} = require('../controller/resourceController');
const { verifyToken } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllResources);
router.get('/available', getAvailableResources);
router.get('/category/:category', getResourcesByCategory);
router.get('/:id', getResourceById);

// Protected routes (require authentication)
router.post('/', verifyToken, createResource);
router.put('/:id', verifyToken, updateResource);
router.delete('/:id', verifyToken, deleteResource);

module.exports = router;
