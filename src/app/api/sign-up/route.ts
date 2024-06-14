import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/models/User";
import bcrypt from "bcryptjs"

import { sendVerificationEmail } from "@/src/helpers/sendVerificationEmail";

export async function POST(request: Request){
    await dbConnect()

    try {
        const {username, email, password} = await request.json()
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })

        if (existingUserVerifiedByUsername) {
            return Response.json({
                success: false,
                message: "Username is already taken"
            }, {status: 400})
        }

        const existingUserByEmail = await UserModel.findOne({email})

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: "User already exist with this email"
                }, {status: 400})
            }else {
                const hasedPassword = await bcrypt.hash(password, 10)
                existingUserByEmail.password = hasedPassword
                existingUserByEmail.verifyCode = verifyCode
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
            }
        }else{
            const hasedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

           const newUser = new UserModel({
                username,
                email,
                password: hasedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isAcceptingMessage: true,
                messages: [],
            })

            await newUser.save()
        }

        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        )

        if (emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message
            }, {status: 500})
        }

        return Response.json({
            success: true,
            message: "User registered successfully"
        }, {status: 201})

    } catch (error) {
        console.error("Error registering user", error)
        return Response.json({
            success: false,
            message: "Error registering user"
        },
    {
        status: 500
    })
    }
}