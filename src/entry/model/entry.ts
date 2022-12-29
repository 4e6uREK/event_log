import mongoose from 'mongoose';

// GET
/**
 *  @openapi
 *  components:
 *   schemas:
 *      GetEntryResponse:
 *          type: object
 *          properties:
 *              _id:
 *                  type: string
 *              data:
 *                  type: string
 */

// POST
/**
 *  @openapi
 *  components:
 *   schemas:
 *      CreateEntryRequest:
 *          type: object
 *          required:
 *              - data
 *          properties:
 *              data:
 *                  type: string
 *                  default: example
 *      CreateEntryResponse:
 *          type: object
 *          properties:
 *              data:
 *                  type: string
 *              _id:
 *                  type: string
 *              __v:
 *                  type: number
 */
const entrySchema = new mongoose.Schema({
    data: {
        type: String,
        required: true,
    },
    expireAt: {
        type: Date,
    },
});

export default mongoose.model('Entry', entrySchema);
