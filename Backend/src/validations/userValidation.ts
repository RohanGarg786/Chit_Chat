import Joi from "joi";

export const userSchemaValidation = Joi.object({
    name: Joi.string().min(3).required(),
    phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .message('Phone number must be a 10-digit number').required(),
    password: Joi.string().min(8).required(),
    avatar: Joi.string().optional()
});