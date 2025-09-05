// frontend/sell.js

const API_BASE_URL = 'https://exchange-tdnr.onrender.com/api';
const sellForm = document.getElementById('sell-form');
const formMessage = document.getElementById('form-message');

// frontend/sell.js

async function handleSellFormSubmit(event) {
    event.preventDefault();
    
    // Create a FormData object directly from the form.
    // This will automatically capture text fields AND the selected file.
    const formData = new FormData(sellForm);
    
    formMessage.innerHTML = '';

    try {
        // When sending FormData, you DO NOT set the Content-Type header.
        // The browser does it for you automatically.
        const response = await fetch(`${API_BASE_URL}/products`, {
            method: 'POST',
            body: formData 
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Failed to submit form.');

        formMessage.innerHTML = `<div class="text-green-800 ...">Success! Your item has been listed.</div>`;
        sellForm.reset();
        
        setTimeout(() => {
            window.location.href = 'browse.html';
        }, 2000);

    } catch (error) {
        formMessage.innerHTML = `<div class="text-red-800 ...">Error: ${error.message}</div>`;
    }
}

sellForm.addEventListener('submit', handleSellFormSubmit);