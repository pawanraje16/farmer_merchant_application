import { io, userSocketMap } from "../index.js";
import Message from "../models/message.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

 const getUsersForSidebar = async (req, res) => {
    try {
        console.log("hello");
        const userId = req.user._id;
        const filteredUsers = await User.find({_id: {$ne: userId}}).select("-password -refreshToken");

        // count number of messages not seen 
        const unseenMessages = {}
        const promises =  filteredUsers.map(async (user) => {
            const message = await Message.find({senderId: user._id, receiverId: userId, seen: false})
            if(message.length>0){
                unseenMessages[user._id] = message.length;
            }
        })
        console.log(filteredUsers);
        await Promise.all(promises);
        res.json({success: true, users: filteredUsers, unseenMessages})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
 } 

 // Get all messages for selected user
 const getMessage = async (req, res) => {
    try {
        const {id: selectedUserId} = req.params;
        const myId = req.user._id;
        console.log("we aree getMessage");
        
        const messages = await Message.find({
            $or: [
                {senderId: myId, receiverId: selectedUserId},
                {senderId: selectedUserId, receiverId: myId},
            ]
        })
        await Message.updateMany({senderId: selectedUserId, receiverId: myId}, {seen: true});
        
        res.json({success: true, messages})
    } catch (error) {
        console.log(error.message);
        res.json({success:false, message: error.message})
    }
 }

 // api to mark message as seen using message id
 const markMessageAsSeen = async (req, res) => {
    try {
        const { id  } = req.params;
        await Message.findByIdAndUpdate(id, {seen: true})
        res.json({success: true})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
 }

 // Send message to selected user

 const sendMessage = async (req, res) => {
    try {
        const {text} = req.body;
        const receiverId = req.params.id;
        const senderId = req.user._id;

        const file = req.file ?? req.files?.image?.[0];

        if (!text && !file?.buffer) {
        throw new ApiError(400, "Profile Photo(Avatar) is required");
        }

        let imageUrl;
        if (file?.buffer) {
        const image = await uploadOnCloudinary(file.buffer, file.mimetype, "messages");
        if (!image?.secure_url) {
            throw new ApiError(400, "Image upload failed");
        }
        imageUrl = image.secure_url;
        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });

        // Emit the new message to the receiver's socket
        const receiverSocketId = userSocketMap[receiverId];
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage)
        }

        res.json({success: true, newMessage});

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
 };



 export {
    getUsersForSidebar,
    getMessage,
    markMessageAsSeen,
    sendMessage
 }