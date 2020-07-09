import Joi from "@hapi/joi";

export const CreateTicketSchema = Joi.object({
    subject: Joi.string().required(),
    content: Joi.string().required(),
});

export const UpdateTicketCommentSchema = Joi.object({
    comment: Joi.string().required().min(1)
});