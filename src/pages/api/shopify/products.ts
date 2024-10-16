import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { fetchUserData } from '../../../services/auth/auth';  // Assuming this returns offline token
import { fetchCompanyUrl } from '../../../services/company/company';  // Fetches company domain

// Shopify API Version
const API_VERSION = process.env.SHOPIFY_API_VERSION || '2024-01';

// Function to fetch products from Shopify Admin API
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Extract the accessToken from the query parameters (this is the short-lived token)
    const { accessToken, query } = req.query;


    try {
        // 1. Fetch the offline token from your auth service using the provided accessToken
        const userData = await fetchUserData(accessToken as string);  // Assuming this returns the brand's offline token
        const offlineToken = userData.ShopifyToken; // Extract offline token from user data

        // 2. Fetch the Shopify store domain (shop name) from your company service using the provided accessToken
        const shopDomain = await fetchCompanyUrl(accessToken as string);  // Fetch the shop domain (company's URL)

        // 3. Use the offline token and shop domain to fetch products from Shopify Admin API
        const response = await axios.get(`https://${shopDomain}/admin/api/${API_VERSION}/products.json`, {
            headers: {
                'X-Shopify-Access-Token': offlineToken,  // Use the offline token to authenticate
            },
            params: {
                title: query || '',  // Optional search query (if passed from frontend)
            },
        });

        const products = response.data.products;

        // Send back the list of products
        res.status(200).json(products);
    } catch (error) {
        const err = error as any;
        console.error('Error fetching products from Shopify:', err.response?.data || err.message);
        res.status(500).json({ error: 'Failed to fetch products', details: err.response?.data || err.message });
    }
}
