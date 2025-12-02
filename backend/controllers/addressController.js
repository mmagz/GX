import Address from '../models/addressModel.js';

// Get all addresses for a user
const getUserAddresses = async (req, res) => {
    try {
        const { userId } = req.body;
        
        if (!userId) {
            return res.status(400).json({ success: false, message: 'User ID is required' });
        }

        const addresses = await Address.find({ userId }).sort({ isDefault: -1, createdAt: -1 });
        
        res.json({ success: true, addresses });
    } catch (error) {
        console.error('Get user addresses error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Add a new address
const addAddress = async (req, res) => {
    try {
        const { 
            userId, 
            firstName, 
            lastName, 
            email, 
            phone, 
            address, 
            apartment, 
            city, 
            state, 
            pincode, 
            country = 'India',
            isDefault = false 
        } = req.body;

        // Validate required fields
        if (!userId || !firstName || !lastName || !email || !phone || !address || !city || !state || !pincode) {
            return res.status(400).json({ 
                success: false, 
                message: 'All required fields must be provided' 
            });
        }

        // If setting as default, unset other default addresses
        if (isDefault) {
            await Address.updateMany({ userId }, { isDefault: false });
        }

        const newAddress = new Address({
            userId,
            firstName,
            lastName,
            email,
            phone,
            address,
            apartment: apartment || '',
            city,
            state,
            pincode,
            country,
            isDefault
        });

        await newAddress.save();
        
        res.json({ success: true, message: 'Address added successfully', address: newAddress });
    } catch (error) {
        console.error('Add address error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update an address
const updateAddress = async (req, res) => {
    try {
        const { 
            addressId,
            firstName, 
            lastName, 
            email, 
            phone, 
            address, 
            apartment, 
            city, 
            state, 
            pincode, 
            country,
            isDefault 
        } = req.body;

        if (!addressId) {
            return res.status(400).json({ success: false, message: 'Address ID is required' });
        }

        const existingAddress = await Address.findById(addressId);
        if (!existingAddress) {
            return res.status(404).json({ success: false, message: 'Address not found' });
        }

        // If setting as default, unset other default addresses for this user
        if (isDefault && !existingAddress.isDefault) {
            await Address.updateMany({ userId: existingAddress.userId }, { isDefault: false });
        }

        const updateData = {
            firstName,
            lastName,
            email,
            phone,
            address,
            apartment: apartment || '',
            city,
            state,
            pincode,
            country: country || 'India',
            isDefault,
            updatedAt: Date.now()
        };

        const updatedAddress = await Address.findByIdAndUpdate(
            addressId, 
            updateData, 
            { new: true, runValidators: true }
        );

        res.json({ success: true, message: 'Address updated successfully', address: updatedAddress });
    } catch (error) {
        console.error('Update address error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete an address
const deleteAddress = async (req, res) => {
    try {
        const { addressId } = req.body;

        if (!addressId) {
            return res.status(400).json({ success: false, message: 'Address ID is required' });
        }

        const address = await Address.findById(addressId);
        if (!address) {
            return res.status(404).json({ success: false, message: 'Address not found' });
        }

        await Address.findByIdAndDelete(addressId);
        
        res.json({ success: true, message: 'Address deleted successfully' });
    } catch (error) {
        console.error('Delete address error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Set default address
const setDefaultAddress = async (req, res) => {
    try {
        const { addressId, userId } = req.body;

        if (!addressId || !userId) {
            return res.status(400).json({ success: false, message: 'Address ID and User ID are required' });
        }

        // Unset all default addresses for this user
        await Address.updateMany({ userId }, { isDefault: false });

        // Set the selected address as default
        const updatedAddress = await Address.findByIdAndUpdate(
            addressId,
            { isDefault: true, updatedAt: Date.now() },
            { new: true }
        );

        if (!updatedAddress) {
            return res.status(404).json({ success: false, message: 'Address not found' });
        }

        res.json({ success: true, message: 'Default address updated successfully', address: updatedAddress });
    } catch (error) {
        console.error('Set default address error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export { getUserAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress };


