import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  STAGE: Joi.string().valid('dev', 'prod', 'test').required(),
  DB_HOST: Joi.string().hostname().required(),
  DB_PORT: Joi.number().default(5432).required(),
  DB_USERNAME: Joi.string().min(3).required(),
  DB_PASSWORD: Joi.string().min(8).required(),
  DB_DATABASE: Joi.string().min(3).required(),
  PORT: Joi.number().default(3000),
  JWT_SECRET: Joi.string().min(32).required(),
});
