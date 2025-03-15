import { axiosi } from '../../config/axios';

/**
 * Creates a new wishlist item.
 *
 * @param {object} data - The wishlist item data.
 * @returns {Promise<object>} The created wishlist item.
 */
export const createWishlistItem = async (data) => {
  try {
    if (!data) {
      throw new Error('Data is required');
    }

    const res = await axiosi.post('/wishlist', data);
    return res.data;
  } catch (error) {
    throw error.response?.data ?? error;
  }
};

/**
 * Fetches wishlist items by user ID.
 *
 * @param {string} id - The user ID.
 * @returns {Promise<object>} The wishlist items and total results.
 */
export const fetchWishlistByUserId = async (id) => {
  try {
    if (!id) {
      throw new Error('User ID is required');
    }

    const res = await axiosi.get(`/wishlist/user/${id}`);
    const totalResults = res.headers.get('X-Total-Count');
    return { data: res.data, totalResults: totalResults ?? 0 };
  } catch (error) {
    throw error.response?.data ?? error;
  }
};

/**
 * Updates a wishlist item by ID.
 *
 * @param {object} update - The updated wishlist item data.
 * @returns {Promise<object>} The updated wishlist item.
 */
export const updateWishlistItemById = async (update) => {
  try {
    if (!update || !update._id) {
      throw new Error('Wishlist item ID and data are required');
    }

    const res = await axiosi.patch(`/wishlist/${update._id}`, update);
    return res.data;
  } catch (error) {
    throw error.response?.data ?? error;
  }
};

/**
 * Deletes a wishlist item by ID.
 *
 * @param {string} id - The wishlist item ID.
 * @returns {Promise<object>} The deleted wishlist item.
 */
export const deleteWishlistItemById = async (id) => {
  try {
    if (!id) {
      throw new Error('Wishlist item ID is required');
    }

    const res = await axiosi.delete(`/wishlist/${id}`);
    return res.data;
  } catch (error) {
    throw error.response?.data ?? error;
  }
};