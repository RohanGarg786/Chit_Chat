import jwt from 'jsonwebtoken'

const JWT_SECRET = "12345678"
export const createToken = async (phone:string)=>{

    const token = jwt.sign(phone,JWT_SECRET);
    
    return token;
}

export const verifyToken = async(token:any)=>{
    const decoded = await jwt.verify(token ,JWT_SECRET);
    return decoded;
}