import productModel from "../models/productModel.js";

// Dynamic search with filters
const searchProducts = async (req, res) => {
    try {
        const {
            query = '',
            category = '',
            subCategory = '',
            price_min = 0,
            price_max = 1000000,
            color = '',
            size = '',
            sort = 'newest',
            page = 1,
            limit = 20,
            inStock = false
        } = req.query;

        // Build the base query
        let mongoQuery = {};

        // Text search in name, description, category, subCategory
        if (query.trim()) {
            mongoQuery.$or = [
                { name: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { category: { $regex: query, $options: 'i' } },
                { subCategory: { $regex: query, $options: 'i' } }
            ];
        }

        // Category filter
        if (category && category !== 'all') {
            mongoQuery.category = { $regex: category, $options: 'i' };
        }

        // Sub-category filter
        if (subCategory && subCategory !== 'all') {
            mongoQuery.subCategory = { $regex: subCategory, $options: 'i' };
        }

        // Price range filter
        mongoQuery.price = {
            $gte: parseInt(price_min),
            $lte: parseInt(price_max)
        };

        // Color filter
        if (color && color !== 'all') {
            mongoQuery['variants.colorName'] = { $regex: color, $options: 'i' };
        }

        // Size filter
        if (size && size !== 'all') {
            mongoQuery.sizes = size;
        }

        // Stock filter
        if (inStock === 'true') {
            mongoQuery.stock = { $gt: 0 };
        }

        // Sort options
        let sortOption = {};
        switch (sort) {
            case 'newest':
                sortOption = { date: -1 };
                break;
            case 'oldest':
                sortOption = { date: 1 };
                break;
            case 'price_asc':
                sortOption = { price: 1 };
                break;
            case 'price_desc':
                sortOption = { price: -1 };
                break;
            case 'name_asc':
                sortOption = { name: 1 };
                break;
            case 'name_desc':
                sortOption = { name: -1 };
                break;
            case 'popular':
                sortOption = { bestseller: -1, date: -1 };
                break;
            default:
                sortOption = { date: -1 };
        }

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Execute query with pagination
        const products = await productModel
            .find(mongoQuery)
            .sort(sortOption)
            .skip(skip)
            .limit(parseInt(limit))
            .lean();

        // Get total count for pagination
        const totalProducts = await productModel.countDocuments(mongoQuery);

        // Get filter options for UI
        const filterOptions = await getFilterOptions(mongoQuery);

        res.json({
            success: true,
            products,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalProducts / parseInt(limit)),
                totalProducts,
                hasNext: skip + products.length < totalProducts,
                hasPrev: parseInt(page) > 1
            },
            filters: filterOptions,
            appliedFilters: {
                query,
                category,
                subCategory,
                price_min: parseInt(price_min),
                price_max: parseInt(price_max),
                color,
                size,
                sort,
                inStock: inStock === 'true'
            }
        });

    } catch (error) {
        console.error('Search products error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to search products',
            error: error.message
        });
    }
}

// Get filter options based on current query
const getFilterOptions = async (baseQuery) => {
    try {
        // Get all unique categories
        const categories = await productModel.distinct('category', baseQuery);
        
        // Get all unique sub-categories
        const subCategories = await productModel.distinct('subCategory', baseQuery);
        
        // Get all unique colors from variants
        const colorAggregation = await productModel.aggregate([
            { $match: baseQuery },
            { $unwind: '$variants' },
            { $group: { _id: '$variants.colorName' } },
            { $sort: { _id: 1 } }
        ]);
        const colors = colorAggregation.map(item => item._id).filter(Boolean);
        
        // Get all unique sizes
        const sizeAggregation = await productModel.aggregate([
            { $match: baseQuery },
            { $unwind: '$sizes' },
            { $group: { _id: '$sizes' } },
            { $sort: { _id: 1 } }
        ]);
        const sizes = sizeAggregation.map(item => item._id).filter(Boolean);
        
        // Get price range
        const priceRange = await productModel.aggregate([
            { $match: baseQuery },
            {
                $group: {
                    _id: null,
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' }
                }
            }
        ]);

        return {
            categories: categories.sort(),
            subCategories: subCategories.sort(),
            colors: colors.sort(),
            sizes: sizes.sort(),
            priceRange: priceRange.length > 0 ? {
                min: priceRange[0].minPrice,
                max: priceRange[0].maxPrice
            } : { min: 0, max: 1000000 }
        };
    } catch (error) {
        console.error('Get filter options error:', error);
        return {
            categories: [],
            subCategories: [],
            colors: [],
            sizes: [],
            priceRange: { min: 0, max: 1000000 }
        };
    }
}

export { searchProducts, getFilterOptions };

