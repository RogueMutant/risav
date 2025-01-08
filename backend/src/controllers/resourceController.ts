import express, { Request, Response } from 'express';
import Category from '../model/Category';
import Resource from '../model/Resource';
import { IResource } from '../types/custom';

const router = express.Router();

// Create a new resource
const createResource = async (req: Request, res: Response) => {
    try {
        const { name, category, description, status, imageUrl, location } = req.body;

        // Validate category
        const validCategory = await Category.findById(category);
        if (!validCategory) {
            return res.status(400).json({ message: 'Invalid category' });
        }

        const resource: IResource = new Resource({
            name,
            category,
            description,
            status,
            imageUrl,
            location
        });

        await resource.save();

        res.status(201).json({ message: 'Resource created successfully', resource });
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'An error occurred' });
    }
}

// Update an existing resource
const updateResource =  async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, category, description, status, imageUrl, location } = req.body;

        // Validate category if it's being updated
        if (category) {
            const validCategory = await Category.findById(category);
            if (!validCategory) {
                return res.status(400).json({ message: 'Invalid category' });
            }
        }

        const updatedResource = await Resource.findByIdAndUpdate(
            id,
            { name, category, description, status, imageUrl, location },
            { new: true }
        );

        if (!updatedResource) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        res.status(200).json({ message: 'Resource updated successfully', resource: updatedResource });
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'An error occurred' });
    }
}

// Delete a resource
const deleteResource = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const deletedResource = await Resource.findByIdAndDelete(id);

        if (!deletedResource) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        res.status(200).json({ message: 'Resource deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'An error occurred' });
    }
}

export {
    createResource,
    updateResource,
    deleteResource
}
