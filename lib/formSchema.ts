import z from "zod";

export const formSchemaLogin = z.object({
    email: z.string().email(),
    password: z.string().min(6, { message: "Password minimum 6 karakter" }),
})

export const formSchemaRegister = z.object({
    username: z.string().min(3, { message: "Username minimum 3 karakter" }),
    email: z.string().email(),
    password: z.string().min(6, { message: "Password minimum 6 karakter" }),
    confirmPassword: z.string().min(6, { message: "Password minimum 6 karakter" }),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Password tidak sama',
    path: ['confirmPassword'],
})

export const formSchemaCluster = z.object({
    name: z.string().min(3, { message: "Name minimum 3 karakter" }),
    description: z.string().min(3, { message: "Description minimum 3 karakter" }),
    system_prompt: z.string().min(3, { message: "System Prompt minimum 3 karakter" }),
});
