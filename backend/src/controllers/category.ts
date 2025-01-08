import Category from "../model/Category";
import Resource from "../model/Resource";
import { customRequest, ICategory } from "../types/custom";
import e, { Response } from "express";

const createCategory = async(req: customRequest, res: Response): Promise<void> =>{
    const {name} = req.body
    const createdBy = req.user?.userId

    if(req.user?.role !== "super_admin" && req.user?.role !== "admin"){
        res.status(403).json({message: "You do not have have the authority", status: "unauthorized"})
    }
    
    const existingCategory = await Category.findOne({name})
    if(existingCategory){
        res.status(400).json({ message: 'Category already exists' })
    }

    const category: ICategory = new Category({ name }, {createdBy});
    await category.save();
    res.status(201).json({ message: 'Category created', category, });
}

const getAllCategories = async(req: customRequest, res: Response): Promise<void> =>{
    const categories = await Category.find();
    if(categories){
        res.status(200).json(categories);
    }
    res.status(500).json({ message: "There are no categories", status: 'An error occurred' });
}   

const deleteCategory = async(req: customRequest, res: Response): Promise<void> =>{
    try {
        const { id } = req.params;

        // Check if the category is being used by equipment
        const isCategoryUsed = await Resource.findOne({ category: id });
        if (isCategoryUsed) {
            res.status(400).json({ message: 'Category is in use and cannot be deleted' });
        }

        await Category.findByIdAndDelete(id);
        res.status(200).json({ message: 'Category deleted' });
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'An error occurred' });
    }
}

export {
    createCategory,
    getAllCategories,
    deleteCategory
}