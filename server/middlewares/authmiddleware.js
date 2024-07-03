import { verifyAccessToken } from "../utils/tokenService.js";

export const accessTokenMiddleware = async(req,res,next) => {
    
    try {
       // console.log("block got executed?");
        const { accessToken } = req.cookies;
        if (!accessToken) {
            throw new Error();
        }
        const userData = await verifyAccessToken(accessToken);
        if (!userData) {
            throw new Error();
        }
        req.user = userData;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};