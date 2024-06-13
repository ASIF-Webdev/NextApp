import {z} from 'zod'

export const userValidation = z
.string()
.min(2, 'Username must be atleast of 2 charecters')
.max(20, 'Username must not be more than 20 charecters')
.regex(/^[a-zA-Z0-9]+$/, 'Username must not contain special charecter')

export const signUpSchema = z.object({
    username: userValidation,
    email: z.string().email({message: 'Invalid email address'}),
    password: z.string().min(6, 'Password must be at least 6 charecters')
})