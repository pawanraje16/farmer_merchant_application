import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const postSchema = new Schema(
    {   
        cropType: {
            type: String,
            index: true,
            trim: true,
            required: true,
        },
        category: {
            type: String,
            index: true,
            required: true,
        },
        images: {
            type: [String], // cloudinary url
            required: true,
        },
        title: {
            type: String, 
            required: true,
            trim: true,
        },
        description: {
            type: String, 
            required: true,
            trim: true,
        },
        price: {
            type: Number,
            required: true,
        },
        priceUnit: {
            type: String,
            required: true,
        },
        quantity: {
            type: String,
            required: true,
        },
        location:{
            state:{
                type: String,
                required: true,
                index: true,
            },
            district:{
                type: String,
                required: true,
                index: true,
            },
            city:{
                type: String,
                required: true,
                index: true,
            },
            village: {
                type: String,
                index: true,
                required: true,

            },
            pincode: {
                type: String,
            }
        },
        tags: {
            type: [String],
        },
        specifications: {
            variety: {
                type: String, 
            },
            shelLife:{
                type: String,
                required: true,
            },
            packaging: {
                type: String,
            },
            minorderQunatity:{
                type: String,
            },
        },
        likes: {
            type: Number,
            default: 0
        },
        comments: {
            type: String, 
        },
        author:{
            type: Schema.Types.ObjectId,
            ref:"User",
            required: true,
        },

    },
    {
        timestamps: true
    }
);

// Add aggregate pagination plugin
postSchema.plugin(mongooseAggregatePaginate)

export const Post = mongoose.model("Post", postSchema);