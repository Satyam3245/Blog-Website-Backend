import express, { Request, Response, Router } from 'express';
import prisma from '../prisma/client';
import jwt from 'jsonwebtoken';
import { loginSchema, userSchema } from '../schema/schema';
const router = Router();
const generateToken = (userID: string) => {
    return jwt.sign({ userID }, 'your-256-bit-secret', { algorithm: 'HS256', expiresIn: '8h' });
};
router.post('/signup',async(req: Request,res : Response)=>{
    const body = req.body;
    if (!body.name || !body.email || !body.password) {
        res.status(400).send("All fields (name, email, password) are required.");
        return;
    }
    const parseData = userSchema.safeParse(body);
    if(!parseData.success){
        res.status(400).send("Invalid data");
        return
    }
    try {
        const user1 = await prisma.user.create({
            data:{
                name:body.name,
                email:body.email,
                password:body.password
            }
        })
        const token = generateToken(user1.id);
        
        res.json({msg:`Hello ${body.name}, You are Successfully Signed Up !!`,token:token});
    } catch (e) {
        res.status(500).send("Something is Wrong")
        return
    }
   
})
router.post('/login',async(req: Request,res : Response)=>{
    const body = req.body;
    if (!body.email || !body.password) {
        res.status(400).send("All fields (email, password) are required.");
        return
    }
    const parseData = loginSchema.safeParse(body);
    if(!parseData.success){
        res.status(400).send("Invalid data");
        return
    }
    try {
        const signUser = await prisma.user.findFirst({
            where:{
                email:body.email,
                password:body.password
            }
        })
        if(!signUser){
            res.status(400).send("Invalid Credentials")
            return
        }
        const token = generateToken(signUser.id)
     
        res.json({
            msg:`Hello ${signUser.name}, You are Successfully Logged In !!`,
            token:token
        })
    } catch (e) {
        res.status(500).send("Something is Wrong with your email and password")
        return
    }
   
})
export default router;