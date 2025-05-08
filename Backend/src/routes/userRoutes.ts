import express from 'express';
import { registerUserController ,loginUserController, userDetailsController, addNewContact, allContacts, allMessages, deleteContact, checkAuthentication } from '../controller/registerController';

const userRouter = express.Router();

userRouter.get("/",userDetailsController)
userRouter.post("/register",registerUserController);
userRouter.post("/login",loginUserController);
userRouter.post('/addNewContact/:userId',addNewContact);
userRouter.get('/allContacts/:userId',allContacts);
userRouter.get('/allMessages/:senderId/:receiverId', allMessages)
userRouter.delete('/deleteContact/:contactId', deleteContact)
userRouter.get('/me', checkAuthentication)

export default userRouter;