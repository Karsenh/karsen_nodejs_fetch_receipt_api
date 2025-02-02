import { PURCHASE_DATE_ERROR, RETAILER_ERROR } from '../constants/receipt_validator_errors';
import { validateReceiptBody } from '../validators/receipt_validators';

describe('validateReceiptBody', () => {
    it('should return status 200 for valid receipt data', () => {
        const req = {
            body: {
                retailer: 'Retailer Name',
                purchaseDate: '2023-10-01',
                purchaseTime: '12:00',
                total: '100.00',
                items: [
                    { shortDescription: 'Item 1', price: '50.00' },
                    { shortDescription: 'Item 2', price: '50.00' }
                ]
            }
        };
        const { status, message } = validateReceiptBody(req);
        expect(status).toBe(200);
        expect(message).toBe('Receipt body is valid');
    });
    // Everything below this should fail.
    it('should return status 400 for invalid `retailer` value type', () => {
        const req = {
            body: {
                retailer: 123,
                purchaseDate: '2023-10-01',
                purchaseTime: '12:00',
                total: '100.00',
                items: [
                    { shortDescription: 'Item 1', price: '50.00' },
                    { shortDescription: 'Item 2', price: '50.00' }
                ]
            }
        };
        const { status, message } = validateReceiptBody(req);
        expect(status).toBe(400);
        expect(message).toBe(RETAILER_ERROR);
    });
    it('should return status 400 for missing `retailer`', () => {
        const req = {
            body: {
                purchaseDate: '2023-10-01',
                purchaseTime: '12:00',
                total: '100.00',
                items: [
                    { shortDescription: 'Item 1', price: '50.00' },
                    { shortDescription: 'Item 2', price: '50.00' }
                ]
            }
        };
        const { status, message } = validateReceiptBody(req);
        expect(status).toBe(400);
        expect(message).toBe(RETAILER_ERROR);
    });
    it('should return status 400 for invalid `purchaseDate` type', () => {
        const req = {
            body: {
                retailer: "Target",
                purchaseDate: 2023,
                purchaseTime: '12:00',
                total: '100.00',
                items: [
                    { shortDescription: 'Item 1', price: '50.00' },
                    { shortDescription: 'Item 2', price: '50.00' }
                ]
            }
        };
        const { status, message } = validateReceiptBody(req);
        expect(status).toBe(400);
        expect(message).toBe('Purchase date is required and must be in the format YYYY-MM-DD');
    });
    it('should return status 400 for missing `purchaseDate`', () => {
        const req = {
            body: {
                retailer: "Target",
                purchaseTime: '12:00',
                total: '100.00',
                items: [
                    { shortDescription: 'Item 1', price: '50.00' },
                    { shortDescription: 'Item 2', price: '50.00' }
                ]
            }
        };
        const { status, message } = validateReceiptBody(req);
        expect(status).toBe(400);
        expect(message).toBe(PURCHASE_DATE_ERROR);
    });
    it('should return status 400 for invalid `purchaseTime` type', () => {
        const req = {
            body: {
                retailer: "Target",
                purchaseDate: '2023-10-01',
                purchaseTime: 12,
                total: '100.00',
                items: [
                    { shortDescription: 'Item 1', price: '50.00' },
                    { shortDescription: 'Item 2', price: '50.00' }
                ]
            }
        };
        const { status, message } = validateReceiptBody(req);
        expect(status).toBe(400);
        expect(message).toBe('Purchase time is required and must be in the format HH:MM');
    });
    it('should return status 400 for missing `purchaseTime`', () => {
        const req = {
            body: {
                retailer: "Target",
                purchaseDate: '2023-10-01',
                total: '100.00',
                items: [
                    { shortDescription: 'Item 1', price: '50.00' },
                    { shortDescription: 'Item 2', price: '50.00' }
                ]
            }
        };
        const { status, message } = validateReceiptBody(req);
        expect(status).toBe(400);
        expect(message).toBe('Purchase time is required and must be in the format HH:MM');
    });

});
