import { processReceiptById, getReceiptPointsById } from '../controllers/receipt_controller.js';
import { validateReceiptBody } from '../validators/receipt_validators.js';
import { Receipt, ReceiptItem } from '../models/Receipt.js';
import { ReceiptPoints } from '../models/ReceiptPoints.js';
import { jest } from '@jest/globals';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

jest.mock('../validators/receipt_validators.js');
jest.mock('../models/Receipt.js');
jest.mock('../models/ReceiptPoints.js');

/**
 * receipt_controller -> processReceiptById() Tests
 */
describe('Receipt Controller - Process Receipt', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            body: {
                retailer: 'Walgreens',
                purchaseDate: '2022-01-02',
                purchaseTime: '08:13',
                total: "2.65",
                items: [
                    { shortDescription: 'Pepsi - 12-oz', price: "1.25" },
                    { shortDescription: 'Dasani', price: "1.40" }
                ]
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    describe('processReceiptById', () => {
        it('should process receipt and return a valid UUID with 200 status', async () => {
            validateReceiptBody.mockReturnValue({ status: 200, message: 'Valid receipt body' });
            ReceiptItem.mockImplementation((desc, price) => ({ shortDescription: desc, price }));
            Receipt.mockImplementation(() => ({
                calculatePoints: jest.fn().mockReturnValue(100)
            }));
            ReceiptPoints.mockImplementation((id, points) => ({ id, points }));

            await processReceiptById(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            const response = res.json.mock.calls[0][0];
            expect(uuidValidate(response.id)).toBe(true);
        });
    });
});

/**
 * receipt_controller -> getReceiptById() Tests
 */
describe('Receipt Controller - Get Receipt Points By Id', () => {
    let req, res, next;
    let RECEIPT_POINTS_BY_ID_ARR;

    beforeEach(() => {
        req = {
            params: {
                id: 'some-id'
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
        RECEIPT_POINTS_BY_ID_ARR = [
            { id: 'some-id', points: '100' }
        ];
        global.RECEIPT_POINTS_BY_ID_ARR = RECEIPT_POINTS_BY_ID_ARR;
    });

    afterEach(() => {
        delete global.RECEIPT_POINTS_BY_ID_ARR;
    });

    it('should return 400 if id is not provided', async () => {
        req.params.id = null;

        await getReceiptPointsById(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: '`id` is required.' });
    });

    it('should return 404 if points not found', async () => {
        req.params.id = 'non-existent-id';

        await getReceiptPointsById(req, res, next);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: `Receipt points not found for id: non-existent-id.` });
    });

    it('should return points if found', async () => {
        const requestBody = {
            retailer: "Target",
            purchaseDate: "2022-01-01",
            purchaseTime: "13:01",
            items: [
                { shortDescription: "Mountain Dew 12PK", price: "6.49" },
                { shortDescription: "Emils Cheese Pizza", price: "12.25" },
                { shortDescription: "Knorr Creamy Chicken", price: "1.26" },
                { shortDescription: "Doritos Nacho Cheese", price: "3.35" },
                { shortDescription: "   Klarbrunn 12-PK 12 FL OZ  ", price: "12.00" }
            ],
            total: "35.35"
        };

        req.body = requestBody;
        validateReceiptBody.mockReturnValue({ status: 200, message: 'Valid receipt body' });
        ReceiptItem.mockImplementation((desc, price) => ({ shortDescription: desc, price }));
        Receipt.mockImplementation(() => ({
            calculatePoints: jest.fn().mockReturnValue('100')
        }));
        ReceiptPoints.mockImplementation((id, points) => ({ id, points }));

        await processReceiptById(req, res, next);

        const response = res.json.mock.calls[0][0];
        req.params.id = response.id;
        await getReceiptPointsById(req, res, next);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ points: '100' });
    });
});
