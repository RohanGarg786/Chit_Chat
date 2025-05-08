import { NextFunction, Request, Response } from "express"
import { userSchemaValidation } from "../validations/userValidation";
import { prisma } from "../database/db";
import { createToken, verifyToken } from "../service/authentication";
import bcrypt from 'bcrypt'

export const registerUserController = async (req: Request, res: Response): Promise<any>=>{
   try {
    const {error} = userSchemaValidation.validate(req.body);

    if(error){
        return res.status(400).json({error:error});
    }

    const data = req.body;

    const existingUser =  await prisma.user.findUnique({
        where:{
            phone : data.phone
        }
    });

    if(existingUser){
        return res.status(409).json({
            success:false,
            message:"User already exists try another Phone number"
        })
    }

    const hashedPassword = await bcrypt.hash(data.password,10);

    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${data?.name}`;
	// const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${data?.name}`;
        
    const newUser = await prisma.user.create({
       data:{
        name:data.name,
        phone:data.phone,
        password:hashedPassword,
        avatar:data.avatar ? data.avatar : boyProfilePic
       }
    })

    return res.status(200).json({
        success:true,
        data:newUser
    })
   } catch (error) {
    res.status(500).json({
        success:false,
        error:error
    })
   }

    
}

export const loginUserController = async(req:Request, res: Response): Promise<any> =>{
    try {
        
        const {error} = req.body;
        if(error){
        return res.status(400).json({error:error.details[0].message});
        }

        const data = req.body;
        const user = await prisma.user.findUnique({
            where:{
                phone: data.phone,
            }
        });

        if(!user){
            return res.status(400).json({
                success:false,
                message:user
            })
        }

        const newPassword = await bcrypt.compare(data.password,user.password);

        if(!newPassword){
            return res.status(400).json({
                success:false,
                error:error
            })
        }

        const token = await createToken(data.phone);
        const options ={
            expires:new Date(Date.now()+1*24*60*60*1000),
        };

        return res.status(201).cookie("token",token,options).json({
            success:true,
            message:"User loggin successfully",
            token:token
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            error:error
        })
    }
}

export const userDetailsController = async (req:Request, res: Response):Promise<any>=>{
    const {token} = req.cookies;
    if(!token){
        return res.status(401).json({
            message:"Please login first",
        });
    }

    const phones = await verifyToken(token);

    if (phones && typeof phones === 'string') {
        const isExisting = await prisma.user.findUnique({
            where: {
                phone: phones,
            },
        });

        // Handle the found user here
        if (isExisting) {
            return res.status(200).json(isExisting);
        } else {
            return res.status(404).json({ message: "User not found" });
        }
    } else {
        return res.status(401).json({ message: "Invalid token" });
    }
}

export const isAutheticated =async(req: Request, res: Response,next: NextFunction): Promise<any>=>{
    const {token} = req.cookies;
    if(!token){
        return res.status(401).json({
            message:"Please login first",
        });
    }
    next();
}

export const addNewContact = async (req: any, res: any) => {
    try {
        const data = req.body
        const userId = req.params.userId
        const isPhoneExists = await prisma.user.findUnique({
            where: {
                phone: data?.phone
            }
        })
        if(!isPhoneExists){
            return res.status(400).send('This Phone Number does not have account on our application.')
        }
        const userFind = await prisma.userContacts.create({
            data :{
                name: data?.name,
                phoneNumber: data?.phone,
                userId: userId,
                contactId: isPhoneExists?.id
            }
        })

        if(userFind){
            return res.status(200).json({
                success: true,
                message: "New Contact Added Successfully"
            })
        }
        
        return res.status(400).json({
            success: false,
            message: "Unable to add contact"
        })

        // return res.status(200).json({
        //     success: true
        // })
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error
        })
    }
}

export const allContacts = async (req: any, res: any) => {
    try {
        const userId = req.params.userId
        const allContacts = await prisma.userContacts.findMany({
            where: {
                userId:userId
            }
        })
        return res.status(200).json({
            data: allContacts,
            message: "All contacts Fetched Successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error
        })
    }
}

export const allMessages = async (req: any, res: any) => {
    try {
        const a = await prisma.chats.findFirst({
            where:{
                AND: [
                    { memebers: { has: req.params.senderId} },
                    { memebers: { has: req.params.receiverId } },
                ],
            },
            include: {
                messages: {
                    orderBy: {
                        createdAt: 'asc'
                    }
                }
            }
        })

        if(a){
            return res.status(200).send(a)
        }

        return res.status(404).send('Not Found')
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error
        })
    }
}

export const deleteContact = async (req: any, res: any) => {
    try {
        const result = await prisma.userContacts.delete({
            where: {
                id: req.params.contactId
            }
        })
        
        if(result){
            return res.status(200).json({
                message: "Contact successfully deleted"
            })
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error
        })
    }
}