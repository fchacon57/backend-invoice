import { Router } from 'express';
import {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
  changeInvoiceStatus
} from '../controllers/invoice.controller.js';

import { createInvoiceValidator } from '../validators/invoice.validator.js';
import { validateRequest } from '../middlewares/validateRequest.js';

const router = Router();

router.post(
  '/',
  createInvoiceValidator,
  validateRequest,
  createInvoice,
  changeInvoiceStatus

);

router.get('/', getInvoices);
router.get('/:id', getInvoiceById);
router.put('/:id', updateInvoice);
router.delete('/:id', deleteInvoice);
router.post('/:id/status', changeInvoiceStatus);

export default router;
