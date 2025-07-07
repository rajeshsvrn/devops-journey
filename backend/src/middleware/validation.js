const Joi = require('joi');

const validateRegistration = (req, res, next) => {
    const schema = Joi.object({
        username: Joi.string()
            .alphanum()
            .min(3)
            .max(30)
            .required()
            .messages({
                'string.alphanum': 'Username must only contain letters and numbers',
                'string.min': 'Username must be at least 3 characters long',
                'string.max': 'Username cannot exceed 30 characters',
                'any.required': 'Username is required'
            }),
        email: Joi.string()
            .email()
            .required()
            .messages({
                'string.email': 'Please provide a valid email address',
                'any.required': 'Email is required'
            }),
        password: Joi.string()
            .min(6)
            .required()
            .messages({
                'string.min': 'Password must be at least 6 characters long',
                'any.required': 'Password is required'
            })
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            message: 'Validation error',
            details: error.details[0].message
        });
    }
    next();
};

const validateLogin = (req, res, next) => {
    const schema = Joi.object({
        username: Joi.string().required().messages({
            'any.required': 'Username or email is required'
        }),
        password: Joi.string().required().messages({
            'any.required': 'Password is required'
        })
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            message: 'Validation error',
            details: error.details[0].message
        });
    }
    next();
};

module.exports = {
    validateRegistration,
    validateLogin
};