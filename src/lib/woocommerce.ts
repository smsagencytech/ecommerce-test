import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

const api = new WooCommerceRestApi({
    url: process.env.WORDPRESS_URL || "",
    consumerKey: process.env.WOOCOMMERCE_KEY || "",
    consumerSecret: process.env.WOOCOMMERCE_SECRET || "",
    version: "wc/v3",
});

export const getProducts = async (categoryId?: string) => {
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
