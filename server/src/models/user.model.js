import mongoose, {Mongoose, Schema} from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema(
{
    username: {
        type: String, 
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index:true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match:[/^\S+@\S+\.\S+$/,"please enter a valid email schema"],
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        index:true
    },
    adharNo:{
        type: String,
        required:true,
        minlength: 12,
        maxlength: 12,
        match: [/^\d{12}$/, "Aadhaar must be 12 digits"],
    },
    userType:{
        type: String,
        required: true,
        lowercase: true,
    },
    avatar: {
        type: String, // cloudinary url
        required: true,
    },
    coverImage: {
        type: String, // cloudinary url
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6,
    },
    contact:{
        type: String,
        required:true,
        minlength: 10,
        maxlength: 10,
        match: [/^\d{10}$/, "Contact Number must be 10 digits"],
    },
    refreshToken: {
        type: String
    }
}, 
{
    timestamps: true
}
)

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName,
            adharNo: this.adharNo
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)
