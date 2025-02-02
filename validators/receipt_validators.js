import { ITEMS_ERROR, PURCHASE_DATE_ERROR, PURCHASE_TIME_ERROR, RETAILER_ERROR, TOTAL_ERROR } from "../constants/receipt_validator_errors.js";

/**
 * Used in:
 *  - controllers -> receipt_controller.js file 
 *      > processReceiptById function to validate the receipt body.
 * 
 * @param {Object} req - The request object with the receipt parameters
 * @returns {Object} - The status and message of the validation
 */
export const validateReceiptBody = (req) => {
    const { retailer, purchaseDate, purchaseTime, total, items } = req.body;

    if (!req.body.hasOwnProperty('retailer') || !retailer || typeof retailer !== 'string') {
        return { status: 400, message: RETAILER_ERROR };
    }
    if (!req.body.hasOwnProperty('purchaseDate') || !purchaseDate || !/^\d{4}-\d{2}-\d{2}$/.test(purchaseDate)) {
        return { status: 400, message: PURCHASE_DATE_ERROR };
    }
    if (!req.body.hasOwnProperty('purchaseTime') || !purchaseTime || !/^\d{2}:\d{2}$/.test(purchaseTime)) {
        return { status: 400, message: PURCHASE_TIME_ERROR };
    }
    if (!req.body.hasOwnProperty('total') || !total || isNaN(total)) {
        return { status: 400, message: TOTAL_ERROR };
    }
    if (!req.body.hasOwnProperty('items') || !Array.isArray(items) || items.some(item => !item.shortDescription || !item.price || typeof item.shortDescription !== 'string' || isNaN(item.price))) {
        return { status: 400, message: ITEMS_ERROR };
    }
    return { status: 200, message: 'Receipt body is valid' };
}

