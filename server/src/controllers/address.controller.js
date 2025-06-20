import { Address } from "../models/address.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";



const updateOrCreateAddress = asyncHandler (async (req, res) => {
    const userId = req.user?._id;

    const {village, city, district, state, pincode} =req.body;

    if(!state || !district || !city){
        throw new ApiError(400, "All address fields are requires");
    }

    const existingAddress = await Address.findOne({user: userId});

    if(existingAddress){
        // Update existing address

        await Address.findOneAndUpdate({ user: userId}, {
            village,
            city,
            district,
            state,
            pincode,
        });
    }
    else {
        //Create new address
        await Address.create({
            user: userId,
            village,
            city,
            district,
            state,
            pincode
        });
    }

    return res
    .status(200)
    .json(new ApiResponse(200, null, "Address updated successfully"));
});


export {
    updateOrCreateAddress
}