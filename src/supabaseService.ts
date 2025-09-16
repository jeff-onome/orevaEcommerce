import { supabase } from './supabaseClient';
import { Product } from './types';

const PRODUCTS_PER_PAGE = 12;

interface FetchProductsResult {
    products: Product[];
    count: number;
}

export const fetchPaginatedProducts = async ({ page, category, query }: { page: number; category: string; query: string }): Promise<FetchProductsResult> => {
    const startIndex = (page - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE - 1;

    let supabaseQuery = supabase
        .from('products')
        .select('*', { count: 'exact' });

    if (category && category !== 'All') {
        supabaseQuery = supabaseQuery.filter('categories', 'cs', `{${category}}`);
    }

    if (query) {
        supabaseQuery = supabaseQuery.or(`name.ilike.%${query}%,description.ilike.%${query}%`);
    }

    supabaseQuery = supabaseQuery.range(startIndex, endIndex).order('id');

    const { data, error, count } = await supabaseQuery;

    if (error) {
        console.error('Error fetching products:', error);
        throw error;
    }

    return { products: data || [], count: count || 0 };
};
