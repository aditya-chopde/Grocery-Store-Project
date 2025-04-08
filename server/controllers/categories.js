const Category = require("../models/categories");

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

// Add new category
exports.addCategory = async (req, res) => {
  try {
    const newCategory = new Category(req.body);
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ error: 'Failed to add category', details: error.message });
  }
};

// Update category
exports.updateCategory = async (req, res) => {
  try {
    const updated = await Category.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Category not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update category', details: error.message });
  }
};

// Delete category
exports.deleteCategory = async (req, res) => {
  try {
    const deleted = await Category.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ error: 'Category not found' });
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
};
