const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateURL = (value,helpers) => {
  if(validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri")
};

module.exports.validateClothingItemBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    imageUrl: Joi.string().required().custom(validateURL).messages({
      'string.empty': 'The "imageUrl" field must be filled in',
      'string.uri': 'the "imageUrl" field must be a valid url',
    }),
    weather: Joi.string().required().valid("hot", "warm", "cold").messages({
      'string.empty': 'The "weather" field must be filled in',
    }),
  }),
});

module.exports.validateUserBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      'string.empty': 'The "avatar" field must be filled in',
      'string.uri': 'the "avatar" field must be a valid url',
    }),
    email: Joi.string().required().email().messages({
      'string.empty': 'The "email" field must be filled in',
      'string.email': 'the "email" field must be a valid email address',
    }),
    password: Joi.string().required().messages({
      'string.empty': 'The "password" field must be filled in',
    }),
  }),
});

module.exports.validateLogIn = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      'string.empty': 'The "email" field must be filled in',
      'string.email': 'the "email" field must be a valid email address',
    }),
    password: Joi.string().required().messages({
      'string.empty': 'The "password" field must be filled in',
    }),
  }),
});

module.exports.validateId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().hex().length(24).messages({
      "string.length": 'The "itemId" must be exactly 24 characters long',
      "string.hex": 'The "itemId" must be a valid hexadecimal value',
      "string.empty": 'The "itemId" field must be filled in',
    }),
    // userId: Joi.string().hex().length(24).messages({
    //   "string.length": 'The "userId" must be exactly 24 characters long',
    //   "string.hex": 'The "userId" must be a valid hexadecimal value',
    //   "string.empty": 'The "userId" field must be filled in',
    // }),
  }),
});

module.exports.validateUserUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    avatar: Joi.string().custom(validateURL).messages({
      'string.empty': 'The "avatar" field must be filled in',
      'string.uri': 'The "avatar" field must be a valid URL',
    }),
  }),
});

// NOTE TO SELF BEFORE I FORGET:
// ERROR 400 FOR UPDATE USER,
//  ITEM ID IS FOR SURE GETING VALIDATED AS I CAN LIKE,DISLIKE AND DELTE ITEM.
// CODE REQUIREMENT, SPECIFIED "USE PARAMETERS TO EXTRACT AND VALDIATE ITEM AND USER ID"
// https://www.npmjs.com/package/celebrate - CELEBRATE DOCUMENTATION
// Segments
// An enum containing all the segments of req objects that celebrate can
// validate against.

// {
//   BODY: 'body',
//   COOKIES: 'cookies',
//   HEADERS: 'headers',
//   PARAMS: 'params',
//   QUERY: 'query',
//   SIGNEDCOOKIES: 'signedCookies',
// }


// 4. Validate data from other sources
// On top of validating the request body, celebrate also **allows you to validate headers, parameters, or req.query. Use parameters to extract and validate the item and user IDs:
// module.exports.validateId = celebrate({
//   params: Joi.object().keys({
//     // ...
//   }),
// });