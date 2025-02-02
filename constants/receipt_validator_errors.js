/**
 * Constants for error messages in the receipt validator.
 * Used to consolidate test response message assertions.
 */
export const RETAILER_ERROR = 'Retailer is required and must be a string';
export const PURCHASE_DATE_ERROR = 'Purchase date is required and must be in the format YYYY-MM-DD';
export const PURCHASE_TIME_ERROR = 'Purchase time is required and must be in the format HH:MM';
export const TOTAL_ERROR = 'Purchase total is required and must be a number';
export const ITEMS_ERROR = 'Items are required and each item must have a shortDescription (string) and price (number)';
