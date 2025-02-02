import {v4 as uuidv4} from 'uuid'
import { validateReceiptBody } from '../validators/receipt_validators.js';
import {Receipt, ReceiptItem} from '../models/Receipt.js'
import { ReceiptPoints } from '../models/ReceiptPoints.js';

// contains objects in the shape of { id: <UUID>, points: <points> }
var RECEIPT_POINTS_BY_ID_ARR = []

/**
 * - Gets the receipt values from the request
 * - Validates the receipt values (property exists, value type, value)
 * - Maps the receipt values to a `Receipt` object (includes ReceiptItem child objects)
 * - Calculates the `points` from the receipt
 * - Stores the `points` in memory array as an object [{ id: <UUID>, points: <points> }]
 * - Returns the `id` in the response to fetch associated points in separate request
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
export const processReceiptById = async (req, res, next) => {
    try {
        // I haven't used TypeScript in node yet and only just started to get comfortable with it in NextJS but I would use TypeScript in production environment. For now, I'm validating values as best I can with JavaScript.
        const { status, message} = validateReceiptBody(req)
        
        // If the request body wasn't valid, return an error response.
        if (status !== 200) {
            return res.status(status).json({ message })
        }
        
        // Create a `Receipt` object including `ReceiptItem` objects (classes defined in models).
        const receiptItems = req.body.items.map(item => new ReceiptItem(item.shortDescription, item.price));
        const receiptBody = new Receipt(req.body.retailer, req.body.purchaseDate, req.body.purchaseTime, req.body.total, receiptItems);

        // Calculate and store the points from the receipt.
        const receiptPoints = new ReceiptPoints(uuidv4(), receiptBody.calculatePoints())

        // Add caluclated receipt points to the array in memory associated by Id (UUID) for retrieval later.
        RECEIPT_POINTS_BY_ID_ARR.push(receiptPoints)

        // How I would normally return a response.
        // return res.status(200).json(createSuccessResponse(200, `Receipt processed with ${receiptPoints.points} points.`, { id: receiptPoints.id, points: receiptPoints.points }))

        return res.status(200).json({ id: receiptPoints.id })
    } catch (error) {
        // Pass error to middleware (server.js) for handling.
        next(error);
    }
}

/**
 * - Gets the `id` from the request parameters
 * - Finds the receipt points by `id` in the array within memory
 * - Returns the `points` calculated and saved to memory by processReceiptById if found
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
export const getReceiptPointsById = async (req, res, next) => {
    try {
        // Get `id` from request parameters.
        const id = req.params.id
        
        // If the request parameters don't include the required `id`, return error.
        if (!id) {
            return res.status(400).json({ message: '`id` is required.' })
        }

        // Find the receipt points by `id` in the array within memory.
        if (!RECEIPT_POINTS_BY_ID_ARR || RECEIPT_POINTS_BY_ID_ARR.length === 0) {
            return res.status(404).json({ message: `There are no receipt points.` })
        }
        const points = RECEIPT_POINTS_BY_ID_ARR.find(receiptPoints => receiptPoints.id === id)

        // If the receipt points weren't found, return an error response.
        if (!points) {
            return res.status(404).json({ message: `Receipt points not found for id: ${id}.` })
        }

        // Return the points.
        return res.status(200).json({ points: points.points })
    } catch (error) {
        // Pass error to middleware (server.js) for handling.
        next(error);
    }
}