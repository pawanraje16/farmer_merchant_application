import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { updateOrCreateAddress } from "../controllers/address.controller.js";


const addressRouter = Router();

addressRouter.route('/update-address').patch(verifyJWT,updateOrCreateAddress);


export{
    addressRouter,
}