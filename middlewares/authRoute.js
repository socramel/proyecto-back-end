const joi = require('@hapi/joi');

const authSchema = joi.object({
    name: joi.string().max(50).required(),
    email: joi.string().email().lowercase().required(),
    password: joi.string().min(4).required(),
});

module.exports = {
    authSchema
};


