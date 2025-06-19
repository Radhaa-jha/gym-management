

 let cart = [];
        
        // DOM Elements
        const cartIcon = document.getElementById('cartIcon');
        const cartModal = document.getElementById('cartModal');
        const closeCart = document.getElementById('closeCart');
        const cartItems = document.getElementById('cartItems');
        const cartCount = document.getElementById('cartCount');
        const subtotalEl = document.getElementById('subtotal');
        const totalEl = document.getElementById('total');
        const checkoutBtn = document.getElementById('checkoutBtn');
        const overlay = document.getElementById('overlay');
        const notification = document.getElementById('notification');
        const addToCartButtons = document.querySelectorAll('.add-to-cart');
        
        // Open cart modal
        cartIcon.addEventListener('click', () => {
            cartModal.classList.add('open');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        // Close cart modal
        closeCart.addEventListener('click', () => {
            cartModal.classList.remove('open');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
        
        // Close modal when clicking overlay
        overlay.addEventListener('click', () => {
            cartModal.classList.remove('open');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
        
        // Add to cart functionality
        addToCartButtons.forEach(button => {
            button.addEventListener('click', () => {
                const id = button.dataset.id;
                const name = button.dataset.name;
                const price = parseFloat(button.dataset.price);
                const icon = button.dataset.icon;
                
                // Check if product is already in cart
                const existingItem = cart.find(item => item.id === id);
                
                if (existingItem) {
                    existingItem.quantity++;
                } else {
                    cart.push({
                        id,
                        name,
                        price,
                        quantity: 1,
                        icon
                    });
                }
                
                updateCart();
                
                // Show notification
                showNotification(`${name} added to cart!`);
                
                // Visual feedback on button
                const originalText = button.innerHTML;
                button.innerHTML = '<i class="fas fa-check"></i> Added';
                button.style.background = 'var(--success)';
                
                setTimeout(() => {
                    button.innerHTML = originalText;
                    button.style.background = '';
                }, 1500);
            });
        });
        
        // Show notification
        function showNotification(message) {
            notification.querySelector('span').textContent = message;
            notification.classList.add('show');
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }
        
        // Update cart display
        function updateCart() {
            // Update cart count
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            cartCount.textContent = totalItems;
            
            // Calculate totals
            const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
            const shipping = subtotal > 0 ? 0 : 0;
            const total = subtotal + shipping;
            
            subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
            totalEl.textContent = `$${total.toFixed(2)}`;
            
            // Update cart items
            if (cart.length === 0) {
                cartItems.innerHTML = `
                    <div class="empty-cart">
                        <i class="fas fa-shopping-cart"></i>
                        <h3>Your cart is empty</h3>
                        <p>Add supplements to your cart</p>
                    </div>
                `;
                return;
            }
            
            cartItems.innerHTML = '';
            
            cart.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.dataset.id = item.id;
                
                cartItem.innerHTML = `
                    <div class="cart-item-image">
                        <i class="fas ${item.icon}"></i>
                    </div>
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">${ (item.price * item.quantity).toFixed(2)}</div>
                        <div class="cart-item-controls">
                            <button class="quantity-btn minus"><i class="fas fa-minus"></i></button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-btn plus"><i class="fas fa-plus"></i></button>
                            <button class="remove-item">Remove</button>
                        </div>
                    </div>
                `;
                
                cartItems.appendChild(cartItem);
                
                // Add event listeners for controls
                cartItem.querySelector('.minus').addEventListener('click', () => {
                    updateQuantity(item.id, -1);
                });
                
                cartItem.querySelector('.plus').addEventListener('click', () => {
                    updateQuantity(item.id, 1);
                });
                
                cartItem.querySelector('.remove-item').addEventListener('click', () => {
                    removeItem(item.id);
                });
            });
        }
        
        // Update item quantity
        function updateQuantity(id, change) {
            const item = cart.find(item => item.id === id);
            
            if (item) {
                item.quantity += change;
                
                if (item.quantity <= 0) {
                    cart = cart.filter(item => item.id !== id);
                }
                
                updateCart();
            }
        }
        
        // Remove item from cart
        function removeItem(id) {
            cart = cart.filter(item => item.id !== id);
            updateCart();
        }
        
        // Checkout functionality
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                showNotification('Your cart is empty!');
                return;
            }
            
            alert('Thank you for your purchase! Your supplements will be shipped soon.');
            cart = [];
            updateCart();
            cartModal.classList.remove('open');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
        
        // Initialize page
        document.addEventListener('DOMContentLoaded', () => {
            // Add fade-in animations
            const elements = document.querySelectorAll('.fade-in');
            elements.forEach((el, index) => {
                el.style.animationDelay = `${index * 0.1}s`;
            });
        });

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getDatabase, ref, push, set, get } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

//add your firebase configuration

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);



// Helper function to extract number from "Rs 500.00"
function extractAmount(text) {
  return parseFloat(text.replace(/[^0-9.]/g, "")) || 0;
}
checkoutBtn.addEventListener("click", () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      const email = user.email;

      // Read HTML cart values
      const subtotalText = document.getElementById("subtotal").innerText;
      const totalText = document.getElementById("total").innerText;
      const shipping = document.getElementById("shipping").innerText;

      const subtotal = extractAmount(subtotalText);
      const total = extractAmount(totalText);

      // 🛒 Get product titles from the cart
      const cartItemElements = document.querySelectorAll("#cartItems .product-title");
      const productTitles = Array.from(cartItemElements).map(el => el.innerText.trim());

      // Get user name and plan from Firebase
      const userRef = ref(db, `members/${uid}`);
      get(userRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            const name = data.name || "Not Available";
            const plan = data.plan || "Not Set";

            // Final booking data
            const bookingData = {
              name: name,
              email: email,
              uid: uid,
              plan: plan,
              subtotal: subtotal,
              shipping: shipping,
              total: total,
              products: productTitles,  // 🔥 Added here
              timestamp: new Date().toISOString()
            };

            // Save to supplementbooking
            const bookRef = ref(db, "supplementbooking");
            const newBookingRef = push(bookRef);
            set(newBookingRef, bookingData)
              .then(() => {
                alert("✅ Supplement order placed successfully!");
              })
              .catch((error) => {
                console.error("❌ Error saving booking:", error);
                alert("❌ Failed to place order.");
              });

          } else {
            alert("❌ Member data not found in database.");
          }
        })
        .catch((error) => {
          console.error("❌ Error fetching member data:", error);
        });

    } else {
      alert("⚠ Please log in first to place your order.");
    }
  });
});