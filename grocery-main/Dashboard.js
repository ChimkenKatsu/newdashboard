const categoryButtons = document.querySelectorAll('.category-btn');
const carouselWrapper = document.getElementById('carousel-wrapper');
const cartList = document.getElementById('cart-list');
const totalPriceSpan = document.getElementById('total-price');
const checkoutButton = document.getElementById('checkout-btn');
const viewCartButton = document.getElementById('view-cart-btn');
const backToMenuButton = document.getElementById('back-to-menu-btn');
const cartSection = document.getElementById('cart-section');
const carouselContainer = document.getElementById('carousel-container');

let cart = [];
let totalPrice = 0;

// Function to populate menu based on category
function populateMenu(category) {
    const items = document.querySelectorAll('.menu-item');
    
    items.forEach(item => {
        if (item.getAttribute('data-category') === category || category === 'all') {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Function to add item to cart
function addToCart(itemID) {
    const item = document.querySelector(`.menu-item img[data-id="${itemID}"]`).closest('.menu-item');
    if (!item) {
        console.error('Item not found for ID:', itemID);
        return;
    }

    const productName = item.querySelector('h3').textContent;
    const priceText = item.querySelector('p:nth-of-type(2)').textContent;
    const quantityText = item.querySelector('p:nth-of-type(4)').textContent;

    // Extract price and quantity
    const price = parseFloat(priceText.replace('Price: $', '').trim());
    const quantity = parseInt(quantityText.replace('Quantity: ', '').trim());

    if (isNaN(price) || isNaN(quantity)) {
        console.error('Invalid price or quantity:', priceText, quantityText);
        return;
    }

    // Check if item already exists in the cart
    const existingItem = cart.find(cartItem => cartItem.ProductName === productName);
    if (existingItem) {
        // Update quantity if item already in cart
        existingItem.Quantity += quantity;
    } else {
        // Add new item to the cart
        const cartItem = {
            ProductName: productName,
            Price: price,
            Quantity: quantity
        };
        cart.push(cartItem);
    }

    updateCart();
}

// Function to update cart
function updateCart() {
    cartList.innerHTML = ''; // Clear the current cart list
    totalPrice = 0;

    cart.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.ProductName} - $${(item.Price * item.Quantity).toFixed(2)} (x${item.Quantity})`;
        cartList.appendChild(li);

        totalPrice += item.Price * item.Quantity;
    });

    totalPriceSpan.textContent = totalPrice.toFixed(2);
}

// Function to show cart section
function showCart() {
    carouselContainer.style.display = 'none'; // Hide carousel
    cartSection.style.display = 'block'; // Show cart section
}

// Function to show menu
function showMenu() {
    carouselContainer.style.display = 'block'; // Show carousel
    cartSection.style.display = 'none'; // Hide cart section
}

// Event listeners
categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        const category = button.getAttribute('data-category');
        populateMenu(category);

        // Highlight active category button
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    });
});

carouselWrapper.addEventListener('click', event => {
    if (event.target.classList.contains('item-img')) {
        const itemID = event.target.getAttribute('data-id');
        addToCart(itemID);
    }
});

checkoutButton.addEventListener('click', () => {
    if (cart.length === 0) {
        Swal.fire('Your cart is empty!', '', 'warning');
        return;
    }

    Swal.fire({
        title: 'Checkout Complete',
        text: `Total price: $${totalPrice.toFixed(2)}`,
        icon: 'success'
    });

    showCart(); // Show cart section
});

viewCartButton.addEventListener('click', () => {
    showCart(); // Show cart section
});

backToMenuButton.addEventListener('click', () => {
    showMenu(); // Show menu section
});
