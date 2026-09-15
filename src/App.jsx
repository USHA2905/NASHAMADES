import { useEffect, useMemo, useState } from "react";
import { supabase } from "./supabase";

const oldProducts = [
  { id: "old-1", category: "Bracelets", image: "/products/product1.jpeg", name: "Bracelet", price: 199, description: "Handmade trendy bracelet." },
  { id: "old-2", category: "Mobile Charms", image: "/products/product2.jpeg", name: "Cherry Mobile Cord", price: 149, description: "Cute handmade mobile charm." },
  { id: "old-3", category: "Keychains", image: "/products/product3.jpeg", name: "Bouquet Keychain", price: 149, description: "Handmade bouquet-style keychain." },
  { id: "old-4", category: "Mobile Charms", image: "/products/product4.jpeg", name: "Tulip Mobile Cord", price: 149, description: "Cute tulip-inspired mobile cord." },
  { id: "old-5", category: "Bracelets", image: "/products/product5.jpeg", name: "Bracelet", price: 199, description: "Handmade trendy bracelet." },
  { id: "old-6", category: "Mobile Charms", image: "/products/product6.jpeg", name: "Butterfly Mobile Cord", price: 149, description: "Cute butterfly mobile cord." },
  { id: "old-7", category: "Mobile Charms", image: "/products/product7.jpeg", name: "Alphabet Mobile Cord", price: 149, description: "Personal-style alphabet mobile cord." },
  { id: "old-8", category: "Bracelets", image: "/products/product8.jpeg", name: "Bracelet", price: 199, description: "Handmade trendy bracelet." },
  { id: "old-9", category: "Mobile Charms", image: "/products/product9.jpeg", name: "Panda Mobile Cord", price: 149, description: "Cute panda mobile cord." },
  { id: "old-10", category: "Mobile Charms", image: "/products/product10.jpeg", name: "Cat Mobile Cord", price: 149, description: "Cute cat mobile cord." },
  { id: "old-11", category: "Mobile Charms", image: "/products/product11.jpeg", name: "Alphabet Mobile Cord", price: 149, description: "Personal-style alphabet mobile cord." },
  { id: "old-12", category: "Mobile Charms", image: "/products/product12.jpeg", name: "Bunny Mobile Cord", price: 149, description: "Cute bunny mobile cord." },
  { id: "old-13", category: "Mobile Charms", image: "/products/product13.jpeg", name: "Heart Mobile Cord", price: 149, description: "Sweet heart mobile cord." },
  { id: "old-14", category: "Mobile Charms", image: "/products/product14.jpeg", name: "Heart Mobile Cord", price: 149, description: "Sweet heart mobile cord." },
  { id: "old-15", category: "Keychains", image: "/products/product15.jpeg", name: "Heart Keychain", price: 149, description: "Handmade heart keychain." },
];

const categories = [
  { name: "Crochet", icon: "🧶" },
  { name: "Bracelets", icon: "💜" },
  { name: "Mobile Charms", icon: "📱" },
  { name: "Jewellery", icon: "✨" },
  { name: "Keychains", icon: "🔑" },
];

function App() {
  const [products, setProducts] = useState(oldProducts);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [addedMessage, setAddedMessage] = useState("");
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

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("Product loading error:", error);
      return;
    }

    const supabaseProducts = (data || []).map((product) => ({
      id: `supabase-${product.id}`,
      databaseId: product.id,
      category: product.category,
      image: product.image_url,
      name: product.name,
      price: Number(product.price),
      description: product.description || "",
    }));

    setProducts(supabaseProducts);
  }

  function addToCart(product) {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...current, { ...product, quantity: 1 }];
    });

    setAddedMessage(`${product.name} added to cart ✓`);
    setTimeout(() => setAddedMessage(""), 1800);
  }

  function increaseQuantity(id) {
    setCart((current) =>
      current.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  }

  function decreaseQuantity(id) {
    setCart((current) =>
      current
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function removeFromCart(id) {
    setCart((current) => current.filter((item) => item.id !== id));
  }

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory =
        category === "All" || product.category === category;
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [products, category, search]);

  function chooseCategory(name) {
    setCategory(name);
    setSearch("");
    document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
  }

  function openProduct(product) {
    setSelectedProduct(product);
  }

  function startCheckout() {
    if (!cart.length) return;
    setShowCart(false);
    setShowCheckout(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function placeOrder() {
    if (
      !customer.name.trim() ||
      !customer.phone.trim() ||
      !customer.address.trim() ||
      !customer.city.trim() ||
      !customer.pincode.trim()
    ) {
      alert("Please fill all delivery details.");
      return;
    }

    const itemsText = cart
      .map(
        (item) =>
          `${item.name} x${item.quantity} = ₹${item.price * item.quantity}`
      )
      .join("\n");

    const message =
      `Hello NASHAMADES! I want to place an order.\n\n` +
      `Customer: ${customer.name}\n` +
      `Phone: ${customer.phone}\n` +
      `Address: ${customer.address}, ${customer.city} - ${customer.pincode}\n\n` +
      `Order:\n${itemsText}\n\n` +
      `Total: ₹${cartTotal}`;

    window.open(
      `https://wa.me/918098579962?text=${encodeURIComponent(message)}`,
      "_blank"
    );

    alert("Your order details are ready on WhatsApp. Thank you for shopping with NASHAMADES! 💜");
    setCart([]);
    setShowCheckout(false);
    setCustomer({
      name: "",
      phone: "",
      address: "",
      city: "",
      pincode: "",
    });
  }

  return (
    <div className="nasha-app">
      <style>{`
        :root {
          --nasha-purple: #7c3aed;
          --nasha-dark: #24132f;
          --nasha-soft: #faf7ff;
          --nasha-pink: #f6eaff;
          --nasha-text: #29212f;
          --nasha-muted: #756b7d;
        }

        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body {
          margin: 0;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          color: var(--nasha-text);
          background: #fff;
        }
        button, input, textarea { font: inherit; }
        button { cursor: pointer; }

        .nasha-app { min-height: 100vh; background: linear-gradient(180deg, #fff 0%, #fffaff 100%); }

        .top-strip {
          background: #24132f;
          color: #fff;
          text-align: center;
          padding: 9px 16px;
          font-size: 12px;
          letter-spacing: .5px;
        }

        .navbar {
          position: sticky;
          top: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          gap: 26px;
          padding: 16px clamp(18px, 5vw, 70px);
          background: rgba(255,255,255,.94);
          backdrop-filter: blur(14px);
          border-bottom: 1px solid #eee8f4;
        }

        .brand {
          border: 0;
          background: transparent;
          padding: 0;
          color: var(--nasha-dark);
          font-weight: 900;
          font-size: clamp(20px, 3vw, 28px);
          letter-spacing: 1.5px;
        }
        .brand span { color: var(--nasha-purple); }

        .nav-links {
          display: flex;
          gap: 22px;
          align-items: center;
          flex: 1;
          justify-content: center;
        }
        .nav-links button {
          border: 0;
          background: transparent;
          color: #4c4252;
          font-weight: 650;
          font-size: 14px;
        }
        .nav-links button:hover { color: var(--nasha-purple); }

        .cart-button {
          position: relative;
          border: 1px solid #e5dbea;
          background: #fff;
          border-radius: 999px;
          padding: 10px 15px;
          font-weight: 800;
          color: var(--nasha-dark);
        }
        .cart-count {
          position: absolute;
          top: -8px;
          right: -6px;
          min-width: 21px;
          height: 21px;
          padding: 2px 5px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: var(--nasha-purple);
          color: #fff;
          font-size: 11px;
        }

        .hero {
          max-width: 1280px;
          margin: 0 auto;
          padding: 38px 22px 22px;
        }
        .hero-box {
          min-height: 420px;
          border-radius: 32px;
          padding: clamp(38px, 7vw, 82px);
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(circle at 85% 20%, rgba(255,255,255,.9) 0 5%, transparent 6%),
            radial-gradient(circle at 75% 75%, rgba(255,255,255,.7) 0 9%, transparent 10%),
            linear-gradient(135deg, #f4e8ff 0%, #fff2fb 52%, #f6f1ff 100%);
        }
        .hero-box::after {
          content: "✿  ✦  ♡";
          position: absolute;
          right: 7%;
          bottom: 9%;
          font-size: 52px;
          color: rgba(124,58,237,.17);
          letter-spacing: 20px;
          transform: rotate(-8deg);
        }
        .hero-content { max-width: 650px; position: relative; z-index: 2; }
        .eyebrow {
          color: var(--nasha-purple);
          font-weight: 900;
          letter-spacing: 2px;
          font-size: 12px;
          margin-bottom: 14px;
        }
        .hero h1 {
          margin: 0;
          font-size: clamp(42px, 7vw, 78px);
          line-height: .98;
          letter-spacing: -3px;
          color: var(--nasha-dark);
        }
        .hero h1 span { color: var(--nasha-purple); }
        .hero p {
          max-width: 580px;
          color: #62586a;
          line-height: 1.7;
          margin: 20px 0 28px;
          font-size: 16px;
        }
        .hero-actions { display: flex; gap: 12px; flex-wrap: wrap; }
        .primary-btn, .secondary-btn {
          border-radius: 999px;
          padding: 13px 22px;
          font-weight: 850;
          border: 1px solid transparent;
        }
        .primary-btn { background: var(--nasha-purple); color: #fff; box-shadow: 0 10px 25px rgba(124,58,237,.22); }
        .primary-btn:hover { transform: translateY(-1px); }
        .secondary-btn { background: rgba(255,255,255,.72); border-color: #e1d5e8; color: var(--nasha-dark); }

        .section {
          max-width: 1280px;
          margin: 0 auto;
          padding: 48px 22px;
        }
        .section-head {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          align-items: end;
          margin-bottom: 24px;
        }
        .section-kicker {
          color: var(--nasha-purple);
          font-weight: 850;
          font-size: 12px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }
        .section-title {
          margin: 5px 0 0;
          font-size: clamp(28px, 4vw, 42px);
          letter-spacing: -1.5px;
        }
        .section-subtitle { color: var(--nasha-muted); margin: 5px 0 0; }

        .category-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 14px;
        }
        .category-card {
          border: 1px solid #eee5f3;
          background: #fff;
          border-radius: 22px;
          padding: 24px 14px;
          text-align: center;
          transition: .2s ease;
          box-shadow: 0 8px 24px rgba(58, 25, 78, .04);
        }
        .category-card:hover {
          transform: translateY(-4px);
          border-color: #d9c4e8;
          box-shadow: 0 15px 32px rgba(58, 25, 78, .08);
        }
        .category-icon { font-size: 31px; display: block; margin-bottom: 9px; }
        .category-card strong { font-size: 14px; }

        .shop-toolbar {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          align-items: center;
          margin-bottom: 25px;
        }
        .search-box {
          flex: 1;
          min-width: 220px;
          position: relative;
        }
        .search-box input {
          width: 100%;
          border: 1px solid #e4dbe9;
          border-radius: 999px;
          padding: 13px 18px 13px 42px;
          outline: none;
          background: #fff;
        }
        .search-box input:focus { border-color: #b99bd0; box-shadow: 0 0 0 4px #f3eafa; }
        .search-icon { position: absolute; left: 17px; top: 11px; }
        .filter-select {
          border: 1px solid #e4dbe9;
          border-radius: 999px;
          padding: 12px 16px;
          background: #fff;
          color: #403546;
        }

        .product-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        .product-card {
          overflow: hidden;
          background: #fff;
          border: 1px solid #eee7f2;
          border-radius: 22px;
          box-shadow: 0 9px 28px rgba(49, 28, 62, .055);
          transition: .2s ease;
        }
        .product-card:hover { transform: translateY(-4px); box-shadow: 0 18px 38px rgba(49, 28, 62, .1); }
        .product-image-wrap {
          aspect-ratio: 1 / 1;
          background: #f8f4fa;
          overflow: hidden;
          position: relative;
          cursor: pointer;
        }
        .product-image-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform .3s ease;
        }
        .product-card:hover img { transform: scale(1.035); }
        .category-pill {
          position: absolute;
          left: 12px;
          top: 12px;
          background: rgba(255,255,255,.92);
          padding: 6px 10px;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 850;
          color: #5d4569;
        }
        .product-info { padding: 15px; }
        .product-name {
          margin: 0 0 5px;
          font-size: 16px;
          font-weight: 800;
        }
        .product-price { font-size: 18px; font-weight: 900; color: var(--nasha-purple); }
        .product-actions { display: flex; gap: 8px; margin-top: 13px; }
        .add-btn, .view-btn {
          flex: 1;
          border-radius: 12px;
          padding: 10px 8px;
          font-weight: 800;
          font-size: 12px;
        }
        .add-btn { border: 0; background: var(--nasha-purple); color: #fff; }
        .view-btn { border: 1px solid #e5dbea; background: #fff; color: #4b3a54; }
        .empty-state {
          padding: 50px 20px;
          text-align: center;
          border: 1px dashed #d9cbe2;
          border-radius: 20px;
          color: var(--nasha-muted);
        }

        .why-section {
          background: var(--nasha-dark);
          color: #fff;
          max-width: none;
          padding: 65px max(22px, calc((100% - 1280px) / 2));
        }
        .why-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }
        .why-card {
          padding: 24px;
          border: 1px solid rgba(255,255,255,.12);
          border-radius: 22px;
          background: rgba(255,255,255,.045);
        }
        .why-card b { font-size: 17px; }
        .why-card p { color: #d9cde0; line-height: 1.6; font-size: 14px; }

        .footer {
          background: #160c1e;
          color: #cfc1d5;
          padding: 35px 22px;
          text-align: center;
          font-size: 13px;
        }
        .footer strong { color: #fff; }

        .added-toast {
          position: fixed;
          left: 50%;
          bottom: 25px;
          transform: translateX(-50%);
          z-index: 100;
          background: #24132f;
          color: #fff;
          padding: 12px 20px;
          border-radius: 999px;
          box-shadow: 0 15px 35px rgba(0,0,0,.2);
          font-weight: 750;
          font-size: 13px;
        }

        .overlay {
          position: fixed;
          inset: 0;
          z-index: 80;
          background: rgba(25,14,31,.55);
          backdrop-filter: blur(5px);
          display: flex;
          justify-content: flex-end;
        }
        .side-panel {
          width: min(470px, 100%);
          height: 100%;
          background: #fff;
          padding: 24px;
          overflow-y: auto;
          box-shadow: -15px 0 50px rgba(0,0,0,.15);
        }
        .panel-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          border-bottom: 1px solid #eee7f2;
          padding-bottom: 17px;
          margin-bottom: 18px;
        }
        .close-btn {
          border: 0;
          background: #f5eff8;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          font-size: 19px;
        }
        .cart-item {
          display: grid;
          grid-template-columns: 68px 1fr;
          gap: 12px;
          padding: 13px 0;
          border-bottom: 1px solid #f0ebf2;
        }
        .cart-item img {
          width: 68px;
          height: 68px;
          object-fit: cover;
          border-radius: 13px;
        }
        .cart-item-name { font-weight: 800; font-size: 14px; }
        .cart-item-price { color: var(--nasha-purple); font-weight: 800; font-size: 13px; margin-top: 4px; }
        .quantity-row { display: flex; align-items: center; gap: 8px; margin-top: 9px; }
        .quantity-row button {
          width: 28px;
          height: 28px;
          border: 1px solid #dfd3e5;
          border-radius: 8px;
          background: #fff;
        }
        .remove-btn { margin-left: auto; border: 0 !important; color: #a13d64; background: transparent !important; width: auto !important; }
        .cart-total {
          display: flex;
          justify-content: space-between;
          font-size: 19px;
          font-weight: 900;
          padding: 20px 0;
        }
        .full-btn { width: 100%; border: 0; padding: 14px; border-radius: 13px; background: var(--nasha-purple); color: #fff; font-weight: 850; }

        .modal {
          width: min(900px, 94vw);
          max-height: 90vh;
          overflow-y: auto;
          background: #fff;
          border-radius: 26px;
          margin: auto;
          padding: 18px;
          box-shadow: 0 25px 80px rgba(0,0,0,.25);
        }
        .modal-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 25px;
          align-items: center;
        }
        .modal-image {
          width: 100%;
          max-height: 620px;
          object-fit: contain;
          border-radius: 20px;
          background: #faf7fb;
        }
        .modal-content { padding: 10px; }
        .modal-content h2 { font-size: clamp(28px, 5vw, 42px); margin: 8px 0; }
        .modal-price { color: var(--nasha-purple); font-size: 24px; font-weight: 900; }
        .modal-description { color: var(--nasha-muted); line-height: 1.7; }
        .modal-close-row { display: flex; justify-content: flex-end; }

        .checkout-page {
          max-width: 1000px;
          margin: 0 auto;
          padding: 45px 22px 80px;
        }
        .checkout-grid {
          display: grid;
          grid-template-columns: 1.15fr .85fr;
          gap: 24px;
          align-items: start;
        }
        .checkout-card {
          border: 1px solid #ece4f1;
          border-radius: 22px;
          padding: 23px;
          background: #fff;
          box-shadow: 0 10px 30px rgba(48,25,61,.05);
        }
        .checkout-card h2 { margin-top: 0; }
        .field { margin-bottom: 15px; }
        .field label { display: block; font-weight: 750; font-size: 13px; margin-bottom: 7px; }
        .field input, .field textarea {
          width: 100%;
          border: 1px solid #ded3e4;
          border-radius: 12px;
          padding: 12px 13px;
          outline: none;
          resize: vertical;
        }
        .field input:focus, .field textarea:focus { border-color: #aa87c1; box-shadow: 0 0 0 4px #f5eef9; }
        .checkout-item {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          padding: 12px 0;
          border-bottom: 1px solid #eee7f2;
          font-size: 13px;
        }

        @media (max-width: 950px) {
          .product-grid { grid-template-columns: repeat(3, 1fr); }
          .category-grid { grid-template-columns: repeat(3, 1fr); }
          .why-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 720px) {
          .navbar { gap: 10px; padding: 13px 15px; }
          .nav-links { display: none; }
          .hero { padding: 15px; }
          .hero-box { min-height: 480px; padding: 38px 26px; border-radius: 25px; }
          .hero h1 { letter-spacing: -2px; }
          .section { padding: 35px 15px; }
          .section-head { align-items: start; flex-direction: column; }
          .category-grid { grid-template-columns: repeat(2, 1fr); }
          .product-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
          .product-info { padding: 11px; }
          .product-name { font-size: 14px; }
          .product-price { font-size: 16px; }
          .product-actions { flex-direction: column; }
          .modal-grid, .checkout-grid { grid-template-columns: 1fr; }
          .modal { padding: 12px; border-radius: 20px; }
        }
      `}</style>

      <div className="top-strip">
        Handmade with love • Trendy • Unique • Made for you 💜
      </div>

      {!showCheckout && (
        <>
          <header className="navbar">
            <button className="brand" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
              NASHA<span>MADES</span>
            </button>

            <nav className="nav-links">
              <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Home</button>
              <button onClick={() => document.getElementById("categories")?.scrollIntoView({ behavior: "smooth" })}>Categories</button>
              <button onClick={() => document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" })}>Shop</button>
              <button onClick={() => document.getElementById("why")?.scrollIntoView({ behavior: "smooth" })}>About</button>
            </nav>

            <button className="cart-button" onClick={() => setShowCart(true)}>
              🛒 Cart
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </button>
          </header>

          <main>
            <section className="hero">
              <div className="hero-box">
                <div className="hero-content">
                  <div className="eyebrow">HANDMADE • TRENDY • UNIQUE</div>
                  <h1>Made with love,<br /><span>made for you.</span></h1>
                  <p>
                    Discover cute handmade crochet creations, trendy bracelets,
                    mobile charms, keychains and jewellery — thoughtfully made
                    to add a little more personality to your everyday style.
                  </p>
                  <div className="hero-actions">
                    <button className="primary-btn" onClick={() => document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" })}>
                      Shop now →
                    </button>
                    <button className="secondary-btn" onClick={() => document.getElementById("categories")?.scrollIntoView({ behavior: "smooth" })}>
                      Explore categories
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section className="section" id="categories">
              <div className="section-head">
                <div>
                  <div className="section-kicker">Shop your way</div>
                  <h2 className="section-title">Explore categories</h2>
                  <p className="section-subtitle">Find something cute for yourself or someone special.</p>
                </div>
              </div>

              <div className="category-grid">
                {categories.map((item) => (
                  <button key={item.name} className="category-card" onClick={() => chooseCategory(item.name)}>
                    <span className="category-icon">{item.icon}</span>
                    <strong>{item.name}</strong>
                  </button>
                ))}
              </div>
            </section>

            <section className="section" id="shop">
              <div className="section-head">
                <div>
                  <div className="section-kicker">NASHAMADES collection</div>
                  <h2 className="section-title">Shop our handmade picks</h2>
                  <p className="section-subtitle">Freshly made pieces, ready to make your day a little prettier.</p>
                </div>
              </div>

              <div className="shop-toolbar">
                <div className="search-box">
                  <span className="search-icon">🔎</span>
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search products..."
                  />
                </div>

                <select
                  className="filter-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="All">All categories</option>
                  {categories.map((item) => (
                    <option key={item.name} value={item.name}>{item.name}</option>
                  ))}
                </select>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="empty-state">
                  No products found. Try another search or category.
                </div>
              ) : (
                <div className="product-grid">
                  {filteredProducts.map((product) => (
                    <article className="product-card" key={product.id}>
                      <div className="product-image-wrap" onClick={() => openProduct(product)}>
                        <img src={product.image} alt={product.name} />
                        <span className="category-pill">{product.category}</span>
                      </div>

                      <div className="product-info">
                        <h3 className="product-name">{product.name}</h3>
                        <div className="product-price">₹{product.price}</div>

                        <div className="product-actions">
  <button
    className="view-btn"
    onClick={() => openProduct(product)}
  >
    View Details
  </button>

  <button
    className="add-btn"
    onClick={() => addToCart(product)}
  >
    🛒 Add to Cart
  </button>
</div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            <section className="why-section" id="why">
              <div className="section-head" style={{ maxWidth: 1280, margin: "0 auto 25px" }}>
                <div>
                  <div className="section-kicker">Why NASHAMADES</div>
                  <h2 className="section-title" style={{ color: "#fff" }}>Little things, made special.</h2>
                </div>
              </div>

              <div className="why-grid" style={{ maxWidth: 1280, margin: "0 auto" }}>
                <div className="why-card">
                  <div style={{ fontSize: 28 }}>🧶</div>
                  <b>Handmade with care</b>
                  <p>Every piece is created with attention to detail and lots of love.</p>
                </div>
                <div className="why-card">
                  <div style={{ fontSize: 28 }}>✨</div>
                  <b>Trendy & unique</b>
                  <p>Cute designs made to add personality to your everyday look.</p>
                </div>
                <div className="why-card">
                  <div style={{ fontSize: 28 }}>💌</div>
                  <b>Made for you</b>
                  <p>Choose your favourites and place your order easily through WhatsApp.</p>
                </div>
              </div>
            </section>
          </main>

          <footer className="footer">
            <strong>NASHAMADES</strong> — Handmade with love. 💜<br />
            © {new Date().getFullYear()} NASHAMADES. All rights reserved.
          </footer>
        </>
      )}

      {showCheckout && (
        <div className="checkout-page">
          <div style={{ marginBottom: 25 }}>
            <button className="secondary-btn" onClick={() => setShowCheckout(false)}>← Back to shop</button>
            <div className="section-kicker" style={{ marginTop: 28 }}>Secure your order</div>
            <h1 className="section-title">Checkout</h1>
            <p className="section-subtitle">Enter your delivery details. Your order will be sent to NASHAMADES on WhatsApp.</p>
          </div>

          <div className="checkout-grid">
            <div className="checkout-card">
              <h2>Delivery details</h2>

              <div className="field">
                <label>Full name</label>
                <input value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} placeholder="Your name" />
              </div>
              <div className="field">
                <label>Phone number</label>
                <input value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} placeholder="Your phone number" />
              </div>
              <div className="field">
                <label>Address</label>
                <textarea rows="3" value={customer.address} onChange={(e) => setCustomer({ ...customer, address: e.target.value })} placeholder="House / street / area" />
              </div>
              <div className="field">
                <label>City</label>
                <input value={customer.city} onChange={(e) => setCustomer({ ...customer, city: e.target.value })} placeholder="City" />
              </div>
              <div className="field">
                <label>Pincode</label>
                <input value={customer.pincode} onChange={(e) => setCustomer({ ...customer, pincode: e.target.value })} placeholder="Pincode" />
              </div>

              <button className="full-btn" onClick={placeOrder}>
                Place order on WhatsApp →
              </button>
            </div>

            <div className="checkout-card">
              <h2>Your order</h2>

              {cart.map((item) => (
                <div className="checkout-item" key={item.id}>
                  <span>{item.name} × {item.quantity}</span>
                  <strong>₹{item.price * item.quantity}</strong>
                </div>
              ))}

              <div className="cart-total">
                <span>Total</span>
                <span>₹{cartTotal}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedProduct && (
        <div className="overlay" onClick={() => setSelectedProduct(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-close-row">
              <button className="close-btn" onClick={() => setSelectedProduct(null)}>×</button>
            </div>

            <div className="modal-grid">
              <img className="modal-image" src={selectedProduct.image} alt={selectedProduct.name} />

              <div className="modal-content">
                <div className="section-kicker">{selectedProduct.category}</div>
                <h2>{selectedProduct.name}</h2>
                <div className="modal-price">₹{selectedProduct.price}</div>
                <p className="modal-description">
                  {selectedProduct.description || "A handmade NASHAMADES piece created with care and love."}
                </p>
                <button
                  className="primary-btn"
                  style={{ width: "100%", marginTop: 12 }}
                  onClick={() => {
                    addToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                >
                  Add to cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCart && (
        <div className="overlay" onClick={() => setShowCart(false)}>
          <aside className="side-panel" onClick={(e) => e.stopPropagation()}>
            <div className="panel-head">
              <div>
                <div className="section-kicker">NASHAMADES</div>
                <h2 style={{ margin: "4px 0 0" }}>Your cart</h2>
              </div>
              <button className="close-btn" onClick={() => setShowCart(false)}>×</button>
            </div>

            {cart.length === 0 ? (
              <div className="empty-state">
                <div style={{ fontSize: 40 }}>🛒</div>
                <h3>Your cart is empty</h3>
                <p>Add some handmade favourites to get started.</p>
              </div>
            ) : (
              <>
                {cart.map((item) => (
                  <div className="cart-item" key={item.id}>
                    <img src={item.image} alt={item.name} />

                    <div>
                      <div className="cart-item-name">{item.name}</div>
                      <div className="cart-item-price">₹{item.price}</div>

                      <div className="quantity-row">
                        <button onClick={() => decreaseQuantity(item.id)}>−</button>
                        <strong>{item.quantity}</strong>
                        <button onClick={() => increaseQuantity(item.id)}>+</button>
                        <button className="remove-btn" onClick={() => removeFromCart(item.id)}>Remove</button>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="cart-total">
                  <span>Total</span>
                  <span>₹{cartTotal}</span>
                </div>

                <button className="full-btn" onClick={startCheckout}>
                  Proceed to checkout →
                </button>
              </>
            )}
          </aside>
        </div>
      )}

      {addedMessage && <div className="added-toast">{addedMessage}</div>}

      <button
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        style={{
          position: "fixed",
          right: 18,
          bottom: 18,
          zIndex: 60,
          border: "0",
          width: 42,
          height: 42,
          borderRadius: "50%",
          background: "#24132f",
          color: "#fff",
          boxShadow: "0 8px 25px rgba(0,0,0,.18)"
        }}
      >
        ↑
      </button>
    </div>
  );
}

export default App;
