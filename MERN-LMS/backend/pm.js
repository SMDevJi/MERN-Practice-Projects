// import dotenv from 'dotenv'
// dotenv.config()


// const token = process.env.POLAR_OAT
// console.log(token)

// const createCheckout = async (amount, userId, userEmail, courseId,) => {
//   const url = 'https://sandbox-api.polar.sh/v1/checkouts/';
//   const options = {
//     method: 'POST',
//     headers: {
//       'Authorization': `Bearer ${process.env.POLAR_OAT}`,
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({
//       products: ['03198026-b226-4517-883a-3b8d27c1425d'], // Your reusable generic product ID
//       amount: amount, // Custom price in cents (e.g., 5000 = $50.00)
//       metadata: {
//         user_id: userId,
//         user_email: userEmail,
//         course_id: courseId
//       },
//       success_url: "https://example.com/" // Optional: redirect after payment
//     })
//   };

//   try {
//     const response = await fetch(url, options);

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const data = await response.json();
//     console.log(data)
//     return {
//       success: true,
//       checkoutUrl: data.url, // Redirect user to this URL
//       checkoutId: data.id,
//       expiresAt: data.expires_at
//     };

//   } catch (error) {
//     console.error('Checkout creation failed:', error);
//     return {
//       success: false,
//       error: error.message
//     };
//   }
// };





// // Usage example:
// const checkout = await createCheckout(
//   2000, // $20.00 in cents
//   "user_123",
//   "user@example.com", 
//   "course_456"
// );


//console.log(checkout)



// Usage example:








import { archiveProduct, createProduct,updateProductPrice } from "./utils/polar.js";


//create product in polar
// const newProduct = await createProduct(
//     "product1",
//     "Complete JavaScript course with hands-on projects",
//     9900,
//     "tutor_123",
//     "John Smith"
// );

// console.log(newProduct)


//archieve product in polar
// const result = await archiveProduct('565d48c9-140f-495b-aff6-9b32fd1c5b2f');
// console.log(result)


// const result = await updateProductPrice('dfc913a6-523b-4a5b-8f24-e0a1364850e0', 12500); // Update to $125.00
// console.log(result)