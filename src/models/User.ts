import mongoose, {Schema} from "mongoose";
import { Content } from "next/font/google";
import { boolean, date } from "zod";

export interface Message extends Document {
    Content: string,
    CreatedAt: Date
}
export interface User extends Document {
    username: string
    email: string
    password: string
    verifyCode: string
    verifyCodeExpiry: Date
    isAcceptingMessage: boolean
    messages: Message[]
}

const MessageSchema: Schema<Message> = new Schema({
    Content: {
        type: String,
        required: true
    },
    CreatedAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [/.+\@.+\..+/, 'Please use a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    verifyCode: {
        type: String,
        required: [true, 'Verify code is required'],
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, 'Verify Code Expiry is required'],
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true
    },
    messages: {
        type: [MessageSchema]
    },
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>('User', UserSchema))

export default UserModel;