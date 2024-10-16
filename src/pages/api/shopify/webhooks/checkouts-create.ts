import { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    try {
        return res.status(200).json({
            message: 'Discount code created/applied successfully',

        });

    } catch (error) {
        console.error("Error during discount code operation:");

    }
}
