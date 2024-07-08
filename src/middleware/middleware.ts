import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'

export const blogMiddleware = (req:Request,res:Response,next:NextFunction)=>{
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];
    if(!token){
        return res.status(401).json({message:'No token, authorization denied!'})
    }
    jwt.verify(token,'your-256-bit-secret',(err: any,user: any)=>{
        if(err){
            return res.status(401).json({message:'Token is not valid!'})
        }
        next();
    })
}