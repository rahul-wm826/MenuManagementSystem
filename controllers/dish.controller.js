const Dish = require('../models/dish.model');
const Category = require('../models/category.model');

// Create a new dish
exports.createDish = async (req, res) => {
  try {
    const { name, description, images, category } = req.body;
    if (!name || !category) {
      return res.status(400).json({ message: 'Name and category are required' });
    }
    // Check if category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({ message: 'Category not found' });
    }
    const newDish = new Dish({ name, description, images, category });
    const savedDish = await newDish.save();
    res.status(201).json(savedDish);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.', error: error.message });
  }
};

// Get all dishes
exports.getAllDishes = async (req, res) => {
  try {
    const dishes = await Dish.find().populate('category');
    res.status(200).json(dishes);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.', error: error.message });
  }
};

// Get a single dish by ID
exports.getDishById = async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id).populate('category');
    if (!dish) {
      return res.status(404).json({ message: 'Dish not found' });
    }
    res.status(200).json(dish);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.', error: error.message });
  }
};

// Update a dish by ID
exports.updateDish = async (req, res) => {
  try {
    const { name, description, images, category } = req.body;
    if (category) {
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return res.status(404).json({ message: 'Category not found' });
        }
    }
    const updatedDish = await Dish.findByIdAndUpdate(
      req.params.id,
      { name, description, images, category },
      { new: true, runValidators: true }
    );
    if (!updatedDish) {
      return res.status(404).json({ message: 'Dish not found' });
    }
    res.status(200).json(updatedDish);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.', error: error.message });
  }
};

// Delete a dish by ID
exports.deleteDish = async (req, res) => {
  try {
    const deletedDish = await Dish.findByIdAndDelete(req.params.id);
    if (!deletedDish) {
      return res.status(404).json({ message: 'Dish not found' });
    }
    res.status(200).json({ message: 'Dish deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.', error: error.message });
  }
};

// Get all dishes in a specific category
exports.getDishesByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const dishes = await Dish.find({ category: categoryId }).populate('category');
        res.status(200).json(dishes);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong.', error: error.message });
    }
};
