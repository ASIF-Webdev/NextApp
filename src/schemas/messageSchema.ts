import {z} from 'zod'

export const MessageSchema = z.object({
    content: z
    .string()
    .min(10, 'mussage must must be at least 10 charecters')
    .max(300, 'message must be no longer than 300 charecters')
})