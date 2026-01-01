import Invoice from '../models/invoice.js';

/* =========================
   Helper function
========================= */
function calculateFinalPrice(items = []) {
  return items.reduce(
    (total, item) => total + item.quantity * item.price,
    0
  );
}

/* =========================
   Controllers
========================= */

export const createInvoice = async (req, res, next) => {
  try {
    const finalPrice = calculateFinalPrice(req.body.items);

    const invoice = new Invoice({
      ...req.body,
      finalPrice
    });

    const savedInvoice = await invoice.save();

    res.status(201).json({
      success: true,
      message: 'Invoice created successfully',
      data: savedInvoice
    });
  } catch (error) {
    next(error);
  }
};

export const getInvoices = async (req, res, next) => {
  try {
    const invoices = await Invoice.find();

    res.status(200).json({
      success: true,
      message: 'Invoices retrieved successfully',
      data: invoices
    });
  } catch (error) {
    next(error);
  }
};

export const getInvoiceById = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      const err = new Error('Invoice not found');
      err.statusCode = 404;
      throw err;
    }

    res.status(200).json({
      success: true,
      message: 'Invoice retrieved successfully',
      data: invoice
    });
  } catch (error) {
    next(error);
  }
};

export const updateInvoice = async (req, res, next) => {
  try {
    const finalPrice = calculateFinalPrice(req.body.items);
    const invoiceById = await Invoice.findById(req.params.id);

    if (!invoiceById) {
      const err = new Error('Invoice not found');
      err.statusCode = 404;
      throw err;
    }

    if (invoiceById.status !== 'draft') {
      const err = new Error('Only DRAFT invoices can be edited');
      err.statusCode = 409;
      throw err;
    }

    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        finalPrice
      },
      { new: true, runValidators: true }
    );

    if (!invoice) {
      const err = new Error('Invoice not found');
      err.statusCode = 404;
      throw err;
    }

    res.status(200).json({
      success: true,
      message: 'Invoice updated successfully',
      data: invoice
    });
  } catch (error) {
    next(error);
  }
};

export const deleteInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);

    if (!invoice) {
      const err = new Error('Invoice not found');
      err.statusCode = 404;
      throw err;
    }

    res.status(200).json({
      success: true,
      message: 'Invoice was successfully deleted from the database',
      data: { invoiceId: invoice._id }
    });
  } catch (error) {
    next(error);
  }
};

export const changeInvoiceStatus = async (req, res, next) => {
  try {
    const { status, paymentDate } = req.body;

    const allowedStatuses = ['draft', 'sent', 'paid', 'cancelled'];

    if (!allowedStatuses.includes(status)) {
      const err = new Error('Invalid status');
      err.statusCode = 400;
      throw err;
    }

    // VALIDAR ANTES DE TOCAR LA BD
    if (status === 'paid' && !paymentDate) {
      const err = new Error('Payment date is required when invoice is paid');
      err.statusCode = 400;
      throw err;
    }

    const updateData = { status };

    if (status === 'paid') {
      updateData.paymentDate = paymentDate;
    }

    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!invoice) {
      const err = new Error('Invoice not found');
      err.statusCode = 404;
      throw err;
    }

    res.status(200).json({
      success: true,
      data: invoice
    });
  } catch (error) {
    next(error);
  }
};
