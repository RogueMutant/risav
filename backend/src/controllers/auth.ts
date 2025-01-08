import { customRequest } from "../types/custom";
import { Request, Response } from "express";
import User from "../model/User";
import { IUser } from "../types/custom";

const createUser = async(req:customRequest, res:Response): Promise<void> =>{
    const existingAdmin = await User.find({role: "admin"})
    const role = existingAdmin.length === 0 ? "super_admin" : "user"

    const {name, email, password} = req.body
    if(name && email){
        const user = await User.create({
            name,
            email,
            password,
            role
        })
        const token = user.createJwt()
        res.status(200).json({message: "Succesfully created a user", status: "success", userDetails: user, token})
    }
    res.status(404).json({message: "failed to create a user", status: "Failed"})
}

const login = async (req:customRequest, res:Response): Promise<void> =>{
    const {email, password} = req.body
    if(!email && !password){
        res.status(400).json({message: "Please provide email and password", status: "Failed"})
    }
    const user = await User.findOne({email})
    if(!user){
        res.status(400).json({message: "there is no matching email, please sign up", status: "Failed"})
    }
    const isValid = user && await user.comparePassword(password)
    const token = user?.createJwt()
    if(user && !isValid){
        res.status(400).json({message: "Wrong password provided", status: "Failed"})
    }
    res.status(200).json({message: "welcome back", status: "success", token})
}

const setFallBackAdmin = async (req:customRequest, res:Response): Promise<void> =>{
    try {
        const { id } = req.params;
        const { isFallbackAdmin } = req.body;

        const user: IUser | null = await User.findById(id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
        }

        if (user && user.role !== 'admin') {
            res.status(400).json({ message: 'Only admins can be fallback admins' });
        }

        if(user){
            user.isFallbackAdmin = isFallbackAdmin;
            await user.save();
            res.status(200).json({ message: `Fallback admin status updated`, user });
        }

    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'An error occurred' });
    }
}

const emergencyCode = async (req:customRequest, res:Response): Promise<void> =>{
    try {
        const { userId, emergencyCode }: { userId: string; emergencyCode: string } = req.body;

        // Validate emergency code
        if (emergencyCode !== process.env.EMERGENCY_CODE) {
            res.status(403).json({ message: 'Invalid emergency code' });
        }

        // Find the user by ID
        const user: IUser | null = await User.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
        }

        // Ensure the user is a fallback admin
        if (!user?.isFallbackAdmin) {
            res.status(403).json({ message: 'User is not a fallback admin' });
        }

        // Find the current super admin and demote them
        const currentSuperAdmin: IUser | null = await User.findOne({ role: 'super_admin' });
        if (currentSuperAdmin) {
            currentSuperAdmin.role = 'admin';
            await currentSuperAdmin.save();
        }

        // Promote the fallback admin to super admin
        if(user){
            user.role = 'super_admin';
            user.isFallbackAdmin = false; // Remove fallback status
            await user.save();
            res.status(200).json({ message: 'User promoted to super admin', user });
        }

    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'An error occurred' });
    }
}

const roleUpdate = async (req:customRequest, res:Response): Promise<void> =>{
    const { 
        body: {role}, 
        params:{id}
    } = req;

    if(req.user?.role !== "super_admin"){
        res.status(403).json({
            message: 'Only the super admin can update roles.',
            status: 'Forbidden'
        })
    }

     // Prevent granting super_admin role to anyone other than fallback admins
     if (role === 'super_admin') {
        const targetUser = await User.findById(id);

        if (!targetUser) {
            res.status(404).json({ message: 'User not found', status: 'Error' });
        }

        if (!targetUser?.isFallbackAdmin) {
            res.status(403).json({
                message: 'Only fallback admins can be promoted to super admin.',
                status: 'Forbidden'
            });
        }
    }

    // Update the user's role
    const updateUser = await User.findByIdAndUpdate(id, { role }, { new: true });

    res.status(200).json({
        message: `Successfully updated ${updateUser?.name}'s role to ${role}.`,
        status: 'Success'
    });
}

export {
    createUser,
    login,
    setFallBackAdmin,
    emergencyCode,
    roleUpdate
}