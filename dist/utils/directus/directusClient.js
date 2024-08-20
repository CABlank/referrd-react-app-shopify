import axios from "axios";
var DIRECTUS_API_URL = process.env.NEXT_PUBLIC_API_URL;
var DIRECTUS_API_KEY = process.env.TEST_TOKEN;
export var directusClient = axios.create({
    baseURL: DIRECTUS_API_URL,
    headers: {
        Authorization: "Bearer ".concat(DIRECTUS_API_KEY),
    },
});
