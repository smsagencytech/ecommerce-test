import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

const WORDPRESS_URL = process.env.WORDPRESS_URL;
const CONSUMER_KEY = process.env.WOOCOMMERCE_KEY;
const CONSUMER_SECRET = process.env.WOOCOMMERCE_SECRET;

const hasConfig = !!(WORDPRESS_URL && CONSUMER_KEY && CONSUMER_SECRET);

const api = hasConfig
    ? new WooCommerceRestApi({
        url: WORDPRESS_URL,
        consumerKey: CONSUMER_KEY,
        consumerSecret: CONSUMER_SECRET,
        version: "wc/v3",
    })
    : null;

export const getProducts = async (categoryId?: string) => {
    if (!api) {
        console.warn("WooCommerce API not configured. Skipping product fetch.");
        return [];
    }
    try {
        const params: Record<string, string | number> = {
            per_page: 20,
            status: "publish",
        };

        if (categoryId) {
            params.category = categoryId;
        }

        const response = await api.get("products", params);
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
};

export const getCategories = async () => {
    if (!api) {
        console.warn("WooCommerce API not configured. Skipping category fetch.");
        return [];
    }
    try {
        const response = await api.get("products/categories", {
            per_page: 20,
            hide_empty: true,
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
};

export default api;
