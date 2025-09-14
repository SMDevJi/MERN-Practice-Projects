import dotenv from 'dotenv'
dotenv.config()

const token = process.env.POLAR_OAT


export const createProduct = async (name, description, price, tutorId, tutorName) => {
    const url = `${process.env.POLAR_API_URL}/v1/products/`;
    const options = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            description: description,
            recurring_interval: null,
            prices: [{
                type: "fixed",
                amount_type: "fixed", // Required field
                price_currency: "usd", // Must be lowercase
                price_amount: price
            }],
            metadata: {
                tutor_id: tutorId,
                tutor_name: tutorName
            }
        })
    };

    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
        console.error('API Error:', data);
        throw new Error(`HTTP ${response.status}: ${JSON.stringify(data)}`);
    }

    return data;
};


export const archiveProduct = async (productId) => {
    const url = `${process.env.POLAR_API_URL}/v1/products/${productId}`;
    const options = {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            is_archived: true // Set to true to archive, false to unarchive
        })
    };


    const response = await fetch(url, options);
    const updatedProduct = await response.json();

    return updatedProduct;

};



export const updateProduct = async (productId, updates) => {
    const url = `${process.env.POLAR_API_URL}/v1/products/${productId}`;

    // Build the update object dynamically
    const updateData = {};

    if (updates.name) {
        updateData.name = updates.name;
    }

    if (updates.description) {
        updateData.description = updates.description;
    }

    if (updates.price) {
        updateData.prices = [{
            type: "fixed",
            amount_type: "fixed",
            price_currency: "usd",
            price_amount: updates.price
        }];
    }

    const options = {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
    };

    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
        console.error('API Error:', data);
        throw new Error(`HTTP ${response.status}: ${JSON.stringify(data)}`);
    }
    return data;
};



export const createCheckout = async (productId, userId, userEmail, courseId, successUrl) => {
    const url = `${process.env.POLAR_API_URL}/v1/checkouts/`;
    const options = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            products: [productId],
            customer_email: userEmail,
            metadata: {
                userId: userId,
                userEmail: userEmail,
                courseId: courseId
            },
            success_url: successUrl
        })
    };


    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
        console.error('API Error:', data);
        throw new Error(`HTTP ${response.status}: ${JSON.stringify(data)}`);
    }
    return data;
    // return {
    //     success: true,
    //     checkoutUrl: data.url, // Redirect user here
    //     checkoutId: data.id,
    //     expiresAt: data.expires_at
    // };
};





