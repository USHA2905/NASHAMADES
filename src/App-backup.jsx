import { useState } from "react";

function App() {
  const products = [
    {
      id: 1,
      category: "Bracelets",
      image: "/products/product1.jpeg",
      name: "Bracelet",
      price: 199,
    },
    {
      id: 2,
      category: "Mobile Charms",
      image: "/products/product2.jpeg",
      name: "Cherry Mobile Cord",
      price: 149,
    },
    {
      id: 3,
      category: "Keychains",
      image: "/products/product3.jpeg",
      name: "Bouquet Keychain",
      price: 149,
    },
    {
      id: 4,
      category: "Mobile Charms",
      image: "/products/product4.jpeg",
      name: "Tulip Mobile Cord",
      price: 149,
    },
    {
      id: 5,
      category: "Bracelets",
      image: "/products/product5.jpeg",
      name: "Bracelet",
      price: 199,
    },
    {
      id: 6,
      category: "Mobile Charms",
      image: "/products/product6.jpeg",
      name: "Butterfly Mobile Cord",
      price: 149,
    },
    {
      id: 7,
      category: "Mobile Charms",
      image: "/products/product7.jpeg",
      name: "Alphabet Mobile Cord",
      price: 149,
    },
    {
      id: 8,
      category: "Bracelets",
      image: "/products/product8.jpeg",
      name: "Bracelet",
      price: 199,
    },
    {
      id: 9,
      category: "Mobile Charms",
      image: "/products/product9.jpeg",
      name: "Panda Mobile Cord",
      price: 149,
    },
    {
      id: 10,
      category: "Mobile Charms",
      image: "/products/product10.jpeg",
      name: "Cat Mobile Cord",
      price: 149,
    },
    {
      id: 11,
      category: "Mobile Charms",
      image: "/products/product11.jpeg",
      name: "Alphabet Mobile Cord",
      price: 149,
    },
    {
      id: 12,
      category: "Mobile Charms",
      image: "/products/product12.jpeg",
      name: "Bunny Mobile Cord",
      price: 149,
    },
    {
      id: 13,
      category: "Mobile Charms",
      image: "/products/product13.jpeg",
      name: "Heart Mobile Cord",
      price: 149,
    },
    {
      id: 14,
      category: "Mobile Charms",
      image: "/products/product14.jpeg",
      name: "Heart Mobile Cord",
      price: 149,
    },
    {
      id: 15,
      category: "Keychains",
      image: "/products/product15.jpeg",
      name: "Heart Keychain",
      price: 149,
    },
  ];

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showAddedMessage, setShowAddedMessage] = useState(false);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  const addToCart = (product) => {
    const existingProduct = cart.find(
      (item) => item.id === product.id
    );

    if (existingProduct) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          ...product,
          quantity: 1,
        },
      ]);
    }
    setShowAddedMessage(true);

setTimeout(() => {
  setShowAddedMessage(false);
}, 1500);
  };

  const increaseQuantity = (productId) => {
    setCart(
      cart.map((item) =>
        item.id === productId
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };

  const decreaseQuantity = (productId) => {
    setCart(
      cart
        .map((item) =>
          item.id === productId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId) => {
    setCart(
      cart.filter((item) => item.id !== productId)
    );
  };

  const cartCount = cart.reduce(
    (total, product) =>
      total + product.quantity,
    0
  );

  const cartTotal = cart.reduce(
    (total, product) =>
      total + product.price * product.quantity,
    0
  );

  const filteredProducts = products.filter(
    (product) => {
      const matchesCategory =
        selectedCategory === "All" ||
        product.category === selectedCategory;

      const matchesSearch =
        product.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      return (
        matchesCategory &&
        matchesSearch
      );
    }
  );

  return (
    <div className="app">

      {/* NAVBAR */}

      <header className="navbar">
        <div className="logo">
          NASHAMADES
        </div>

        <nav>
          <a href="#home">Home</a>
          <a href="#shop">Shop</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>

        <button
          className="cart-btn"
          onClick={() =>
            setShowCart(!showCart)
          }
        >
          🛒 Cart ({cartCount})
        </button>
      </header>


      {/* MAIN */}

      <main>

        {/* HERO */}

        <section
          className="hero"
          id="home"
        >
          <div className="hero-content">

            <p className="small-title">
              HANDMADE • TRENDY • UNIQUE
            </p>

            <h1>
              Made with love,
              <br />
              made for you.
            </h1>

            <p className="hero-text">
              Discover beautiful handmade
              crochet creations, trendy
              bracelets, mobile charms and
              anti-tarnish jewellery.
            </p>

            <button
              className="shop-btn"
              onClick={() => {
                setSelectedCategory("All");
                setSearchTerm("");

                document
                  .getElementById("shop")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  });
              }}
            >
              Shop Now →
            </button>

          </div>
        </section>


        {/* CATEGORIES */}

        <section
          className="categories"
          id="shop"
        >
          <h2>
            Shop Our Collections
          </h2>

          <div className="category-grid">

            <button
              className="category-card"
              onClick={() =>
                setSelectedCategory("Crochet")
              }
            >
              🧶
              <h3>Crochet</h3>
            </button>

            <button
              className="category-card"
              onClick={() =>
                setSelectedCategory("Bracelets")
              }
            >
              📿
              <h3>Bracelets</h3>
            </button>

            <button
              className="category-card"
              onClick={() =>
                setSelectedCategory("Mobile Charms")
              }
            >
              📱
              <h3>Mobile Charms</h3>
            </button>

            <button
              className="category-card"
              onClick={() =>
                setSelectedCategory("Jewellery")
              }
            >
              ✨
              <h3>Jewellery</h3>
            </button>

            <button
              className="category-card"
              onClick={() =>
                setSelectedCategory("Keychains")
              }
            >
              🔑
              <h3>Keychains</h3>
            </button>

            <button
              className="category-card"
              onClick={() =>
                setSelectedCategory("All")
              }
            >
              🛍️
              <h3>View All</h3>
            </button>

          </div>
        </section>


        {/* PRODUCTS */}

        <section className="products">

          {/* SEARCH */}

          <div className="search-box">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
            />
          </div>


          {/* PRODUCT TITLE */}

          <h2>
            {selectedCategory === "All"
              ? "Our Products"
              : selectedCategory}
          </h2>


          {/* PRODUCT GRID */}

          <div className="product-grid">

            {filteredProducts.length > 0 ? (

              filteredProducts.map(
                (product) => (

                  <div
                    className="product-card"
                    key={product.id}
                  >

                    <img
  src={product.image}
  alt={product.name}
  onClick={() => setSelectedProduct(product)}
  style={{ cursor: "pointer" }}
/>

                    <h3>
                      {product.name}
                    </h3>

                    <p>
                      ₹{product.price}
                    </p>

                    <button
                      onClick={() =>
                        addToCart(product)
                      }
                    >
                      Add to Cart
                    </button>

                  </div>

                )
              )

            ) : (

              <p>
                No products found ❤️
              </p>

            )}

          </div>

        </section>
      {selectedProduct && (
  <div className="product-modal">
    <div className="product-modal-content">

      <button
        className="close-product-btn"
        onClick={() => setSelectedProduct(null)}
      >
        ✕
      </button>

      <img
        src={selectedProduct.image}
        alt={selectedProduct.name}
      />

      <h2>{selectedProduct.name}</h2>

      <p>₹{selectedProduct.price}</p>

      <button
        className="modal-cart-btn"
        onClick={() => {
          addToCart(selectedProduct);
          setSelectedProduct(null);
        }}
      >
        Add to Cart 🛒
      </button>

    </div>
  </div>
)}
      </main>


      {/* CART */}

      {showCart && (

        <div className="cart-panel">

          <button
            className="close-cart-btn"
            onClick={() =>
              setShowCart(false)
            }
          >
            ✕
          </button>

          <h2>
            Your Cart 🛒
          </h2>


          {cart.length === 0 ? (

            <p>
              Your cart is empty.
            </p>

          ) : (

            <>

              {cart.map((product) => (

                <div
                  className="cart-item"
                  key={product.id}
                >

                  <img
                    src={product.image}
                    alt={product.name}
                  />

                  <div>

                    <h3>
                      {product.name}
                    </h3>

                    <p>
                      ₹{product.price}
                    </p>


                    {/* QUANTITY */}

                    <div className="quantity-controls">

                      <button
                        onClick={() =>
                          decreaseQuantity(
                            product.id
                          )
                        }
                      >
                        −
                      </button>

                      <span>
                        {product.quantity}
                      </span>

                      <button
                        onClick={() =>
                          increaseQuantity(
                            product.id
                          )
                        }
                      >
                        +
                      </button>

                    </div>


                    {/* REMOVE */}

                    <button
                      onClick={() =>
                        removeFromCart(
                          product.id
                        )
                      }
                    >
                      Remove
                    </button>

                  </div>

                </div>

              ))}


              {/* CART TOTAL */}

              <div className="cart-total">

                <h3>
                  Total: ₹{cartTotal}
                </h3>

              </div>


              {/* CHECKOUT */}

              <button
                className="checkout-btn"
                onClick={() => {
                  setShowCart(false);
                  setShowCheckout(true);
                }}
              >
                Proceed to Checkout
              </button>

            </>

          )}

        </div>

      )}


      {/* CHECKOUT */}

      {showCheckout && (

        <section className="checkout-page">

          <h2>
            Checkout 🛍️
          </h2>


          <button
            className="back-shop-btn"
            onClick={() =>
              setShowCheckout(false)
            }
          >
            ← Back to Shop
          </button>


          <div className="checkout-form">

            <h3>
              Customer Details
            </h3>


            <input
              type="text"
              placeholder="Full Name"
              value={customer.name}
              onChange={(e) =>
                setCustomer({
                  ...customer,
                  name: e.target.value,
                })
              }
            />


            <input
              type="tel"
              placeholder="Phone Number"
              value={customer.phone}
              onChange={(e) =>
                setCustomer({
                  ...customer,
                  phone: e.target.value,
                })
              }
            />


            <input
              type="text"
              placeholder="Address"
              value={customer.address}
              onChange={(e) =>
                setCustomer({
                  ...customer,
                  address: e.target.value,
                })
              }
            />


            <input
              type="text"
              placeholder="City"
              value={customer.city}
              onChange={(e) =>
                setCustomer({
                  ...customer,
                  city: e.target.value,
                })
              }
            />


            <input
              type="text"
              placeholder="Pincode"
              value={customer.pincode}
              onChange={(e) =>
                setCustomer({
                  ...customer,
                  pincode: e.target.value,
                })
              }
            />


            <h3>
              Order Total
            </h3>

            <p>
              Total: ₹{cartTotal}
            </p>


            {/* WHATSAPP ORDER */}

            <button
              className="place-order-btn"
              onClick={() => {

                const orderMessage = `NASHAMADES NEW ORDER

Customer: ${customer.name}
Phone: ${customer.phone}

Address:
${customer.address}
${customer.city} - ${customer.pincode}

Order:
${cart
  .map(
    (product) =>
      `${product.name} x ${product.quantity} = Rs.${product.price * product.quantity}`
  )
  .join("\n")}

Total: Rs.${cartTotal}

Thank you for shopping with NASHAMADES!`;

                window.open(
                  `https://wa.me/918098579962?text=${encodeURIComponent(
                    orderMessage
                  )}`,
                  "_blank"
                );

              }}
            >
              Place Order
            </button>

          </div>

        </section>

      )}


      {/* FOOTER */}
      {showAddedMessage && (
  <div className="added-message">
    ✓ Added to Cart
  </div>
)}
      <button
  className="back-to-top"
  onClick={() =>
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }
>
  ↑
</button>
      <footer>
        <p>
          © 2026 NASHAMADES • Handmade with love ❤️
        </p>
      </footer>

    </div>
  );
}

export default App;