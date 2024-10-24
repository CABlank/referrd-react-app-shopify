import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { fetchUserData } from '../../../services/auth/auth';  // Assuming this returns offline token
import { fetchCompanyUrl } from '../../../services/company/company';  // Fetches company domain

// Shopify API Version
const API_VERSION = process.env.SHOPIFY_API_VERSION || '2024-01';

// Function to fetch products by collection ID from Shopify Admin API
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Extract the accessToken and collectionId from the query parameters
    const { accessToken, collectionId } = req.query;

    try {
        // 1. Fetch the offline token from your auth service using the provided accessToken
        const userData = await fetchUserData(accessToken as string);  // Assuming this returns the brand's offline token
        const offlineToken = userData.ShopifyToken; // Extract offline token from user data

        // 2. Fetch the Shopify store domain (shop name) from your company service
        const shopDomain = await fetchCompanyUrl(accessToken as string);  // Fetch the shop domain (company's URL)

        // 3. Use the offline token and shop domain to fetch products from the specific collection
        const response = await axios.get(`https://${shopDomain}/admin/api/${API_VERSION}/collections/${collectionId}/products.json`, {
            headers: {
                'X-Shopify-Access-Token': offlineToken,  // Use the offline token to authenticate
            },
        });

        const products = response.data.products;

        // Send back the list of products
        res.status(200).json(products);
    } catch (error) {
        const err = error as any;
        console.error('Error fetching products from collection:', err.response?.data || err.message);
        res.status(500).json({ error: 'Failed to fetch products from collection', details: err.response?.data || err.message });
    }
}
