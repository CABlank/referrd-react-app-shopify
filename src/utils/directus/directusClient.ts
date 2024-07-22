import axios from "axios";

const DIRECTUS_API_URL = process.env.NEXT_PUBLIC_API_URL;
const DIRECTUS_API_KEY = process.env.TEST_TOKEN;

export const directusClient = axios.create({
  baseURL: DIRECTUS_API_URL,
  headers: {
    Authorization: `Bearer ${DIRECTUS_API_KEY}`,
  },
});
