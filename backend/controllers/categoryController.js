import categorySchema from "../models/CategoryModel.js";

// ================ CREATE CATEGORY ================
export async function createCategory(req, res) {
  try {
    const { name, slug } = req.body;
    if (!name || !slug) {
      return res.status(400).json({ message: "Name and Slug are required" });
    }

    const category = await categorySchema.create({
      name,
      slug,
    });

    return res.status(201).json({
      message: "Category created successfully",
      category,
    });
  }
  catch (error) {
    return res.status(500).json({ message: error.message });
  }
} 

// ================ GET ALL CATEGORIES ================
export async function getAllCategories(req, res) {
  try {
    const categories = await categorySchema.find().sort({ createdAt: -1 });
    return res.status(200).json({ categories });
  }
  catch(error)
  {res.status(500).json({message:error.message})}
}