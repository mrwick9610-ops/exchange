// frontend/browse.js

const API_BASE_URL = '/api';
const productsContainer = document.getElementById('products-container');

async function fetchAndDisplayProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/products`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const products = await response.json();

        productsContainer.innerHTML = '';
        if (products.length === 0) {
            productsContainer.innerHTML = '<p class="text-gray-500 col-span-full text-center">No goods for sale yet. Be the first to list an item!</p>';
            return;
        }

        products.forEach(product => {
            const productCard = document.createElement('a');
            productCard.href = `product.html?id=${product.id}`;
            productCard.className = 'group block bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden';
            
            // --- THIS IS THE KEY CHANGE ---
            const imageUrl = product.imageUrl ? `/${product.imageUrl}` : '...';

            productCard.innerHTML = `
                <div class="relative overflow-hidden h-48">
                    <img src="${imageUrl}" alt="${product.name}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" onerror="this.onerror=null;this.src='https://placehold.co/600x400?text=No+Image';">
                </div>
                <div class="p-4">
                    <h3 class="text-lg font-semibold text-gray-800 dark:text-white truncate">${product.name}</h3>
                    <p class="text-gray-600 dark:text-gray-400 text-sm mt-1 truncate">${product.description}</p>
                    <p class="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-2">₹${product.price.toFixed(2)}</p>
                </div>
            `;
            productsContainer.appendChild(productCard);
        });
        lucide.createIcons();
    } catch (error) {
        console.error('Failed to fetch products:', error);
        productsContainer.innerHTML = '<p class="text-red-500 col-span-full text-center">Sorry, we could not load the products.</p>';
    }
}

document.addEventListener('DOMContentLoaded', fetchAndDisplayProducts);