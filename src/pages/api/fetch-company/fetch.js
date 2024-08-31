import axios from "axios";
import { parse } from "node-html-parser";

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    const response = await axios.get(`https://${url}`);
    const root = parse(response.data);

    // Extract the name and logo from meta tags or other identifiable elements
    const name =
      root
        .querySelector("meta[property='og:site_name']")
        ?.getAttribute("content") || root.querySelector("title")?.text;
    const logo =
      root
        .querySelector("meta[property='og:image']")
        ?.getAttribute("content") ||
      root.querySelector("img[alt*='logo']")?.getAttribute("src");

    res.status(200).json({ name, logo });
  } catch (error) {
    res.status(500).json({ error: "Failed to extract data" });
  }
}
