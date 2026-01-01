const Resource = require('../models/Resource');
const User = require('../models/User');

// Get dashboard statistics for regular users
module.exports.getUserDashboardStats = async (req, res) => {
    try {
        const userId = req.userdata.id;
        
        // Get total resources count
        const totalResources = await Resource.countDocuments();
        
        // Get available resources count
        const availableResources = await Resource.countDocuments({ availability: true });
        
        // TODO: Get user's bookings count when booking model is implemented
        const myBookings = 0; // Placeholder for future implementation
        
        // Get recent resources (last 5)
        const recentResources = await Resource.find()
            .sort({ createdAt: -1 })
            .limit(5);
        
        res.status(200).json({
            stats: {
                totalResources,
                availableResources,
                myBookings
            },
            recentResources
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get dashboard statistics for admin users
module.exports.getAdminDashboardStats = async (req, res) => {
    try {
        // Get total resources count
        const totalResources = await Resource.countDocuments();
        
        // Get available resources count
        const availableResources = await Resource.countDocuments({ availability: true });
        
        // Get total users count
        const totalUsers = await User.countDocuments();
        
        // TODO: Get total bookings count when booking model is implemented
        const totalBookings = 0; // Placeholder for future implementation
        
        // Get recent resources (last 5)
        const recentResources = await Resource.find()
            .sort({ createdAt: -1 })
            .limit(5);
        
        // Get resources by category
        const resourcesByCategory = await Resource.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 }
                }
            }
        ]);
        
        // Get recent users (last 5)
        const recentUsers = await User.find()
            .select('name email userType department year createdAt')
            .sort({ createdAt: -1 })
            .limit(5);
        
        res.status(200).json({
            stats: {
                totalResources,
                availableResources,
                totalUsers,
                totalBookings
            },
            recentResources,
            resourcesByCategory,
            recentUsers
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get user profile information
module.exports.getUserProfile = async (req, res) => {
    try {
        const userId = req.userdata.id;
        
        // If admin, return admin info
        if (req.userdata.role === 'admin') {
            return res.status(200).json({
                user: {
                    name: 'Admin',
                    email: req.userdata.email,
                    role: 'admin'
                }
            });
        }
        
        // Get user from database
        const user = await User.findById(userId).select('-password');
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get quick overview data
module.exports.getQuickOverview = async (req, res) => {
    try {
        const totalResources = await Resource.countDocuments();
        const availableResources = await Resource.countDocuments({ availability: true });
        const totalUsers = await User.countDocuments();
        
        res.status(200).json({
            overview: {
                totalResources,
                availableResources,
                unavailableResources: totalResources - availableResources,
                totalUsers
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
