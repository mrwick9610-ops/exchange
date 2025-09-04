// frontend/product.js

const API_BASE_URL = '/api';
const productDetailContainer = document.getElementById('product-detail-container');

function getProductId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

async function fetchProductDetails(productId) {
    try {
        const response = await fetch(`${API_BASE_URL}/products/${productId}`);
        if (!response.ok) throw new Error(`Product not found.`);
        const product = await response.json();
        displayProductDetails(product);
    } catch (error) {
        productDetailContainer.innerHTML = `<div class="text-center text-red-500"><p>${error.message}</p><a href="browse.html" class="text-indigo-600 hover:underline mt-4 inline-block">Go back to marketplace</a></div>`;
    }
}

function displayProductDetails(product) {
    // --- THIS IS THE KEY CHANGE ---
    const imageUrl = product.imageUrl ? `/${product.imageUrl}` : '...';

    productDetailContainer.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            <div class="rounded-lg shadow-lg overflow-hidden bg-white dark:bg-gray-700">
                <img src="${imageUrl}" alt="${product.name}" class="w-full h-full object-cover" onerror="this.onerror=null;this.src='https://placehold.co/800x600?text=No+Image';">
            </div>
            <div class="flex flex-col">
                <h1 class="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">${product.name}</h1>
                <p class="text-4xl font-bold text-indigo-600 dark:text-indigo-400 my-4">₹${product.price.toFixed(2)}</p>
                <div class="mt-4">
                    <h2 class="text-xl font-semibold text-gray-800 dark:text-white flex items-center"><i data-lucide="info" class="mr-2"></i>Description</h2>
                    <p class="text-gray-600 dark:text-gray-300 mt-2 text-base">${product.description}</p>
                </div>
                <div class="mt-8 bg-gray-100 dark:bg-gray-700 rounded-lg p-6">
                    <h3 class="text-xl font-semibold text-gray-800 dark:text-white flex items-center"><i data-lucide="user" class="mr-2"></i>Contact Seller</h3>
                    <p class="text-gray-600 dark:text-gray-400 mt-2">To purchase or ask a question, contact the seller at:</p>
                    <div class="mt-3 text-lg font-semibold bg-white dark:bg-gray-600 inline-block px-4 py-2 rounded-md shadow-sm">${product.sellerContact}</div>
                </div>
                <a href="browse.html" class="mt-8 inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 font-semibold transition-colors">
                    <i data-lucide="arrow-left" class="mr-2 h-5 w-5"></i>
                    Back to Marketplace
                </a>
            </div>
        </div>
    `;
    lucide.createIcons();
}

document.addEventListener('DOMContentLoaded', () => {
    const productId = getProductId();
    if (productId) {
        fetchProductDetails(productId);
    } else {
        productDetailContainer.innerHTML = '<p class="text-center text-red-500">No product selected. <a href="browse.html" class="text-indigo-600 hover:underline">Go back to marketplace</a>.</p>';
    }
});