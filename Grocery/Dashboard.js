const categoryButtons = document.querySelectorAll('.category-btn');
const carouselWrapper = document.getElementById('carousel-wrapper');
const cartList = document.getElementById('cart-list');
const totalPriceSpan = document.getElementById('total-price');
const checkoutButton = document.getElementById('checkout-btn');
const viewCartButton = document.getElementById('view-cart-btn');
const addItemButton = document.getElementById('add-item-btn');
const cartSection = document.querySelector('.cart-section');
const carouselContainer = document.getElementById('carousel-container');
const sidebar = document.getElementById('sidebar');
const popup = document.getElementById('popup-form'); // Corrected ID
const itemForm = document.getElementById('item-form');
const itemNameInput = document.getElementById('item-name');
const itemCategoryInput = document.getElementById('item-category');
const itemImageInput = document.getElementById('item-image');
const itemPriceInput = document.getElementById('item-price');
const closePopupButton = document.getElementById('close-popup-btn'); 
const searchBar = document.getElementById('search-bar');
const menuItems = document.querySelectorAll('.menu-item');

let cart = []; // Initialize cart

searchBar.addEventListener('input', () => {
    const searchTerm = searchBar.value.toLowerCase();
    menuItems.forEach(item => {
        const itemName = item.querySelector('h3').textContent.toLowerCase();
        if (itemName.includes(searchTerm)) {
            item.style.display = 'block'; // Show matching items
        } else {
            item.style.display = 'none'; // Hide non-matching items
        }
    });
});
// Function to open sidebar
function openSidebar() {
    sidebar.style.width = '250px';  // Adjust sidebar width
    document.getElementById('main-content').style.marginLeft = '250px'; // Shift main content
}

// Function to close sidebar
function closeSidebar() {
    sidebar.style.width = '0';  // Hide the sidebar
    document.getElementById('main-content').style.marginLeft = '0'; // Reset content margin
}

// Function to open popup
function openPopup() {
    popup.style.display = 'flex'; // Show the popup
}

// Function to close popup
function closePopup() {
    popup.style.display = 'none'; // Hide the popup
}

// Function to populate menu items
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

    // Update the cart display
    updateCart();
}

// Function to update cart
function updateCart() {
    cartList.innerHTML = ''; // Clear the current cart list
    let totalPrice = 0;

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

// Function to handle adding a new item
function handleAddItem(event) {
    event.preventDefault();
    
    const productName = itemNameInput.value;
    const category = itemCategoryInput.value;
    const price = parseFloat(itemPriceInput.value); // Read price input
    const file = itemImageInput.files[0];

    if (!productName || !category || isNaN(price) || !file) {
        Swal.fire('Please fill in all fields and upload an image.', '', 'warning');
        return;
    }

    // Create an image URL from the file object
    const reader = new FileReader();
    reader.onload = function(e) {
        const imageUrl = e.target.result;
        const newItemID = Date.now(); // Use current timestamp as a unique ID

        // Add the new item to the carousel
        const newItemHTML = `
            <div class="menu-item" data-category="${category}">
                <div class="menu-item-content">
                    <img src="${imageUrl}" alt="${productName}" class="item-img" data-id="${newItemID}">
                    <h3>${productName}</h3>
                </div>
                <div class="menu-item-details">
                    <p>Brand: New Brand</p>
                    <p>Price: $${price.toFixed(2)}</p>
                    <p>Weight/Volume: 1 lb</p>
                    <p>Quantity: 1</p>
                </div>
            </div>
        `;
        carouselWrapper.insertAdjacentHTML('beforeend', newItemHTML);

        console.log('New item added:', newItemHTML); // Debugging line

        // Reset the form and close the popup
        itemForm.reset();
        closePopup();

        // Optionally, automatically show the newly added item in the correct category
        populateMenu(category);
    };
    reader.readAsDataURL(file); // Read the image file as a Data URL
}

// Event listeners for category buttons
categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        const category = button.getAttribute('data-category');
        populateMenu(category);

        // Highlight active category button
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    });
});

// Event listener for clicking on item images to add to cart
carouselWrapper.addEventListener('click', event => {
    if (event.target.classList.contains('item-img')) {
        const itemID = event.target.getAttribute('data-id');
        addToCart(itemID);
    }
});

// Event listener for checkout button
checkoutButton.addEventListener('click', () => {
    if (cart.length === 0) {
        Swal.fire('Your cart is empty!', '', 'warning');
        return;
    }

    Swal.fire({
        title: 'Checkout Complete',
        text: `Total price: $${totalPriceSpan.textContent}`,
        icon: 'success'
    }).then(() => {
        // Clear the cart and update the display
        cart = [];
        updateCart(); // Clear the cart list and reset total price

        showMenu(); // Show menu section after checkout
    });
});

// Event listener for view cart button
viewCartButton.addEventListener('click', () => {
    showCart(); // Show cart section
});

// Event listener for add new item button
addItemButton.addEventListener('click', () => {
    openPopup(); // Show popup form
});

// Event listener for form submission
itemForm.addEventListener('submit', handleAddItem);

// Event listener for close popup button
closePopupButton.addEventListener('click', () => {
    closePopup(); // Hide the popup
});

