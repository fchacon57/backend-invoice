import { body } from 'express-validator';

export const createInvoiceValidator = [
  body('sellerName')
    .notEmpty().withMessage('Seller name is required'),

  body('sellerAddress')
    .notEmpty().withMessage('Seller address is required'),

  body('customerName')
    .notEmpty().withMessage('Customer name is required'),

  body('customerAddress')
    .notEmpty().withMessage('Customer address is required'),

  body('items')
    .isArray({ min: 1 })
    .withMessage('Invoice must have at least one item'),

  body('items.*.description')
    .notEmpty().withMessage('Item description is required'),

  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Item quantity must be greater than 0'),

  body('items.*.price')
    .isFloat({ min: 0 })
    .withMessage('Item price must be greater or equal to 0'),

  body('finalPrice')
    .isFloat({ min: 0 })
    .withMessage('Final price must be greater or equal to 0')
];
