import mongoose, { Schema }  from "mongoose";
import { User } from "./user.model.js";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


const addressSchema =  new Schema ({
    village:{
        type: String
    },
    city: {
        type: String
    },
    district: {
        type: String,
    },
    state: {
        type: String
    },
    pincode: {
        type: String
    },
    user: {
    type: Schema.Types.ObjectId,
    ref: "User"
    }
});

addressSchema.plugin(mongooseAggregatePaginate)

export const Address = mongoose.model("Address",addressSchema)