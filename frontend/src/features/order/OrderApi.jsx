import {axiosi} from '../../config/axios'

export const createOrder=async(order)=>{
    try {
        const res=await axiosi.post("/orders",order)
        return res.data
    } catch (error) {
        throw error.response.data
    }
}

export const getOrderByUserId=async(id)=>{
    try {
        const res=await axiosi.get(`/orders/user/${id}`)
        return res.data
    } catch (error) {
        throw error.response.data
    }
}

export const getAllOrders=async()=>{
    try {
        const res=await axiosi.get(`/orders`)
        return res.data
    } catch (error) {
        throw error.response.data
    }
}

export const updateOrderById=async(update)=>{
    try {
        const res=await axiosi.patch(`/orders/${update._id}`,update)
        return res.data
    } catch (error) {
        throw error.response.data
    }
}

export const cancelOrderById = async (id, reason) => {
    try {
        const response = await axiosi.patch(`/orders/${id}/cancel`, { reason });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const getOrderById = async (id) => {
    try {
        const response = await axiosi.get(`/orders/${id}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};