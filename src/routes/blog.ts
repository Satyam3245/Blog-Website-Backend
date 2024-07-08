import express,{ Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import { blogMiddleware } from '../middleware/middleware';
import prisma from '../prisma/client';
import { title } from 'process';
const router = Router();
router.use(blogMiddleware)
const function1 = (req:Request)=>{  
        const authHeader = req.headers['authorization'];
        const token: string | undefined = authHeader?.split(' ')[1];
        if (!token) {
            return null; 
        }
        const encodedUserID = jwt.decode(token) as { userID: string }; 
        return encodedUserID?.userID || null; 
}
router.post('/',async (req: Request,res : Response)=>{
   const {title,content} = req.body;
   console.log(req.body);
    const userID = function1(req);
    if(!title||!content){
        res.status(400).send('Bad Request or Send Correct Information');
        return
    }
    try {
        const blog1 = await prisma.post.create({
            data:{
                title:title,
                content:content,
                published:true,
                authorId: userID ||'not know'
            }
        })
        console.log(blog1)
        res.json({msg:"Your Blog is Created",blogID:blog1.id});
    } catch (e) {
        res.send("Something Happen to our Database Comeback Few Hours Later");
        return
    }
   
})
router.put('/',async (req: Request,res : Response)=>{
    const body = req.body;
    if(!body.title||!body.content||!body.id){
        res.status(400).send('Bad Request or Send Correct Information');
        return;
    }
    try {
        const blog1 = await prisma.post.update({
            where:{id:body.id},
            data:{
                title:body.title,
                content:body.content
            }

        })
        console.log(blog1);
        res.json({
            msg:"Your Blog is Updated",
            id:blog1.id
        })
    } catch (e) {
        console.log(e);
        res.send("Something Happen to our Database Comeback Few Hours Later");
        return
    }
})
router.get('/posts',async(req: Request,res:Response)=>{
    const userID = function1(req);
    try {
        const getBlog = await prisma.post.findMany({
            where:{authorId:userID||'null'}
        })
        // There is a drawback that map function take memory because it will create a new array and for 
        // loop doesn't take any memory
        if(getBlog.length===0){
            res.send("You Don't Have any Blogs")
        }else{
            res.json({
                msg:"Your Blogs",
                blogs: getBlog.map(blog=>({
                    title:blog.title,
                    content:blog.content
                }))
            })
        }
    } catch (e) {
        res.status(400).send("Something is Happened please come back soon !")
    }
})
router.get('/bulk',async(req: Request,res:Response)=>{
    try {
        const allBlogs = await prisma.post.findMany();
        res.json({
            msg:"All Blogs",
            blogs:allBlogs.map(blog=>({
                title:blog.title,
                content:blog.content
            }))
        })
    } catch (e) {
        res.status(400).send("Something is Happened please come back soon !")
    }

})
export default router;