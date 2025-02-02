import { Receipt, ReceiptItem } from '../models/Receipt.js';
import { ReceiptPoints } from '../models/ReceiptPoints.js';

/**
 * modes -> Receipt.js / ReceiptPoints.js Tests
 */
describe('Receipt Models', () => {
    describe('ReceiptItem', () => {
        it('should create a ReceiptItem with correct properties', () => {
            const item = new ReceiptItem('Pepsi - 12-oz', '1.25');
            expect(item.shortDescription).toBe('Pepsi - 12-oz');
            expect(item.price).toBe('1.25');
        });
    });

    describe('Receipt', () => {
        it('should create a Receipt with correct properties', () => {
            const items = [
                new ReceiptItem('Pepsi - 12-oz', '1.25'),
                new ReceiptItem('Dasani', '1.40')
            ];
            const receipt = new Receipt('Walgreens', '2022-01-02', '08:13', '2.65', items);
            expect(receipt.retailer).toBe('Walgreens');
            expect(receipt.purchaseDate).toBe('2022-01-02');
            expect(receipt.purchaseTime).toBe('08:13');
            expect(receipt.total).toBe('2.65');
            expect(receipt.items).toEqual(items);
        });

        it('should calculate points correctly', () => {
            const items = [
                new ReceiptItem('Pepsi - 12-oz', '1.25'),
                new ReceiptItem('Dasani', '1.40')
            ];
            const receipt = new Receipt('Walgreens', '2022-01-02', '08:13', '2.65', items);
            const points = receipt.calculatePoints();
            expect(points).toBe(15); 
        });

        it('should calculate points correctly for Target receipt', () => {
            const items = [
                new ReceiptItem('Mountain Dew 12PK', '6.49'),
                new ReceiptItem('Emils Cheese Pizza', '12.25'),
                new ReceiptItem('Knorr Creamy Chicken', '1.26'),
                new ReceiptItem('Doritos Nacho Cheese', '3.35'),
                new ReceiptItem('   Klarbrunn 12-PK 12 FL OZ  ', '12.00')
            ];
            const receipt = new Receipt('Target', '2022-01-01', '13:01', '35.35', items);
            const points = receipt.calculatePoints();
            expect(points).toBe(28); 
        });
    });

    describe('ReceiptPoints', () => {
        it('should create a ReceiptPoints with correct properties', () => {
            const id = 'some-uuid';
            const points = 100;
            const receiptPoints = new ReceiptPoints(id, points);
            expect(receiptPoints.id).toBe(id);
            expect(receiptPoints.points).toBe(points);
        });
    });
});

