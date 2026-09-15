import { useEffect, useState } from "react";
import { supabase } from "./supabase";

const oldProducts = [
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

function Admin() {
  const [products, setProducts] = useState([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Bracelets");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState("");

  // LOAD PRODUCTS
  async function loadProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("Load products error:", error);
      setMessage("❌ Failed to load products.");
      return;
    }

    setProducts(data || []);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  // CLEAR FORM
  function clearForm() {
    setName("");
    setPrice("");
    setCategory("Bracelets");
    setDescription("");
    setImage(null);
    setEditingId(null);

    const fileInput = document.getElementById("product-image");

    if (fileInput) {
      fileInput.value = "";
    }
  }

  // ADD PRODUCT
  async function addProduct() {
    if (!name.trim()) {
      setMessage("❌ Please enter product name.");
      return;
    }

    if (!price || Number(price) <= 0) {
      setMessage("❌ Please enter a valid price.");
      return;
    }

    if (!image) {
      setMessage("❌ Please select a product image.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const fileExt = image.name.split(".").pop();
      const fileName = `product-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(fileName, image, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error(uploadError);
        setMessage("❌ Image upload failed.");
        setLoading(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("products")
        .getPublicUrl(fileName);

      const imageUrl = publicUrlData.publicUrl;

      const { error: insertError } = await supabase
        .from("products")
        .insert([
          {
            name: name.trim(),
            price: Number(price),
            category,
            description: description.trim(),
            image_url: imageUrl,
          },
        ]);

      if (insertError) {
        console.error(insertError);
        setMessage("❌ Product could not be added.");
        setLoading(false);
        return;
      }

      setMessage("✅ Product added successfully!");

      clearForm();
      await loadProducts();
    } catch (error) {
      console.error(error);
      setMessage("❌ Something went wrong.");
    }

    setLoading(false);
  }

  // START EDIT
  function startEdit(product) {
    setEditingId(product.id);
    setName(product.name || "");
    setPrice(product.price || "");
    setCategory(product.category || "Bracelets");
    setDescription(product.description || "");
    setImage(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // SAVE EDIT
  async function saveEdit() {
    if (!name.trim()) {
      setMessage("❌ Please enter product name.");
      return;
    }

    if (!price || Number(price) <= 0) {
      setMessage("❌ Please enter a valid price.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const { error } = await supabase
        .from("products")
        .update({
          name: name.trim(),
          price: Number(price),
          category,
          description: description.trim(),
        })
        .eq("id", editingId);

      if (error) {
        console.error(error);
        setMessage("❌ Product update failed.");
        setLoading(false);
        return;
      }

      setMessage("✅ Product updated successfully!");

      clearForm();
      await loadProducts();
    } catch (error) {
      console.error(error);
      setMessage("❌ Something went wrong.");
    }

    setLoading(false);
  }

  // DELETE PRODUCT
  async function deleteProduct(product) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`
    );

    if (!confirmed) {
      return;
    }

    setMessage("");

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", product.id);

    if (error) {
      console.error(error);
      setMessage("❌ Product could not be deleted.");
      return;
    }

    setMessage("✅ Product deleted successfully!");

    await loadProducts();
  }

  // IMPORT EXISTING 15 PRODUCTS
  async function importExistingProducts() {
    const confirmed = window.confirm(
      "This will import product1.jpeg to product15.jpeg into Supabase. Continue?"
    );

    if (!confirmed) {
      return;
    }

    setImporting(true);
    setMessage("");

    let importedCount = 0;

    try {
      for (const product of oldProducts) {
        const fileName = `legacy-product-${product.id}.jpeg`;
        const storagePath = `legacy/${fileName}`;

        // Check if image already exists
        const { data: existingFiles, error: listError } =
          await supabase.storage
            .from("products")
            .list("legacy");

        if (listError) {
          console.error("Storage list error:", listError);
        }

        const alreadyUploaded =
          existingFiles?.some((file) => file.name === fileName) || false;

        let imageUrl = "";

        if (alreadyUploaded) {
          const { data: publicUrlData } = supabase.storage
            .from("products")
            .getPublicUrl(storagePath);

          imageUrl = publicUrlData.publicUrl;
        } else {
          const response = await fetch(product.image);

          if (!response.ok) {
            console.error(`Could not find ${product.image}`);
            continue;
          }

          const blob = await response.blob();

          const file = new File([blob], fileName, {
            type: blob.type || "image/jpeg",
          });

          const { error: uploadError } = await supabase.storage
            .from("products")
            .upload(storagePath, file, {
              cacheControl: "3600",
              upsert: false,
            });

          if (uploadError) {
            console.error(
              `Upload failed for ${product.name}:`,
              uploadError
            );
            continue;
          }

          const { data: publicUrlData } = supabase.storage
            .from("products")
            .getPublicUrl(storagePath);

          imageUrl = publicUrlData.publicUrl;

          importedCount++;
        }

        // Check for existing database record
        const { data: existingProducts, error: checkError } =
          await supabase
            .from("products")
            .select("id, image_url")
            .eq("image_url", imageUrl);

        if (checkError) {
          console.error("Database check error:", checkError);
          continue;
        }

        if (existingProducts && existingProducts.length > 0) {
          continue;
        }

        // Insert into database
        const { error: insertError } = await supabase
          .from("products")
          .insert([
            {
              name: product.name,
              price: product.price,
              category: product.category,
              description: "",
              image_url: imageUrl,
            },
          ]);

        if (insertError) {
          console.error(
            `Database insert failed for ${product.name}:`,
            insertError
          );
          continue;
        }
      }

      await loadProducts();

      setMessage(
        `✅ Import completed! ${importedCount} images processed.`
      );
    } catch (error) {
      console.error("Import error:", error);

      setMessage(
        "❌ Import stopped because something went wrong."
      );
    }

    setImporting(false);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f7f7f7",
        padding: "30px 20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            background: "#111",
            color: "#fff",
            padding: "25px",
            borderRadius: "15px",
            marginBottom: "25px",
          }}
        >
          <h1 style={{ margin: 0, fontSize: "32px" }}>
            NASHAMADES
          </h1>

          <p style={{ margin: "8px 0 0", opacity: 0.8 }}>
            Admin Product Management
          </p>
        </div>

        {/* MESSAGE */}
        {message && (
          <div
            style={{
              background: "#fff",
              padding: "15px 18px",
              borderRadius: "10px",
              marginBottom: "20px",
              border: "1px solid #ddd",
              fontWeight: "bold",
            }}
          >
            {message}
          </div>
        )}

        {/* IMPORT */}
        <div
          style={{
            background: "#fff",
            padding: "25px",
            borderRadius: "15px",
            marginBottom: "25px",
            border: "2px solid #ddd",
          }}
        >
          <h2 style={{ marginTop: 0 }}>
            Import Existing Products
          </h2>

          <p style={{ color: "#555", lineHeight: 1.6 }}>
            Automatically upload your existing product1.jpeg through
            product15.jpeg into Supabase.
          </p>

          <button
            onClick={importExistingProducts}
            disabled={importing}
            style={{
              background: importing ? "#999" : "#6c3cff",
              color: "#fff",
              border: "none",
              padding: "14px 22px",
              borderRadius: "10px",
              cursor: importing ? "not-allowed" : "pointer",
              fontWeight: "bold",
              fontSize: "16px",
            }}
          >
            {importing
              ? "⏳ Importing Products..."
              : "📦 Import Existing 15 Products"}
          </button>
        </div>

        {/* ADD / EDIT FORM */}
        <div
          style={{
            background: "#fff",
            padding: "25px",
            borderRadius: "15px",
            marginBottom: "30px",
          }}
        >
          <h2 style={{ marginTop: 0 }}>
            {editingId ? "Edit Product" : "Add New Product"}
          </h2>

          <label
            style={{
              display: "block",
              marginBottom: "7px",
              fontWeight: "bold",
            }}
          >
            Product Name
          </label>

          <input
            type="text"
            placeholder="Enter product name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "15px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              boxSizing: "border-box",
            }}
          />

          <label
            style={{
              display: "block",
              marginBottom: "7px",
              fontWeight: "bold",
            }}
          >
            Price
          </label>

          <input
            type="number"
            placeholder="Enter price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "15px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              boxSizing: "border-box",
            }}
          />

          <label
            style={{
              display: "block",
              marginBottom: "7px",
              fontWeight: "bold",
            }}
          >
            Category
          </label>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "15px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              boxSizing: "border-box",
              background: "#fff",
            }}
          >
            <option value="Crochet">Crochet</option>
            <option value="Bracelets">Bracelets</option>
            <option value="Mobile Charms">Mobile Charms</option>
            <option value="Keychains">Keychains</option>
            <option value="Jewellery">Jewellery</option>
            <option value="Chains">Chains</option>
            <option value="Polymer Clay">Polymer Clay</option>
          </select>

          <label
            style={{
              display: "block",
              marginBottom: "7px",
              fontWeight: "bold",
            }}
          >
            Description
          </label>

          <textarea
            placeholder="Enter product description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "15px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              boxSizing: "border-box",
              resize: "vertical",
            }}
          />

          {!editingId && (
            <>
              <label
                style={{
                  display: "block",
                  marginBottom: "7px",
                  fontWeight: "bold",
                }}
              >
                Product Image
              </label>

              <input
                id="product-image"
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                style={{ marginBottom: "20px" }}
              />
            </>
          )}

          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            {editingId ? (
              <>
                <button
                  onClick={saveEdit}
                  disabled={loading}
                  style={{
                    background: "#111",
                    color: "#fff",
                    border: "none",
                    padding: "13px 22px",
                    borderRadius: "9px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  {loading ? "Saving..." : "💾 Save Changes"}
                </button>

                <button
                  onClick={clearForm}
                  style={{
                    background: "#ddd",
                    color: "#111",
                    border: "none",
                    padding: "13px 22px",
                    borderRadius: "9px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={addProduct}
                disabled={loading}
                style={{
                  background: "#111",
                  color: "#fff",
                  border: "none",
                  padding: "13px 22px",
                  borderRadius: "9px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                {loading ? "Adding..." : "➕ Add Product"}
              </button>
            )}
          </div>
        </div>

        {/* PRODUCT LIST */}
        <div
          style={{
            background: "#fff",
            padding: "25px",
            borderRadius: "15px",
          }}
        >
          <h2 style={{ marginTop: 0, marginBottom: "20px" }}>
            Products in Supabase ({products.length})
          </h2>

          {products.length === 0 ? (
            <p style={{ color: "#777" }}>
              No products found.
            </p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fill, minmax(240px, 1fr))",
                gap: "20px",
              }}
            >
              {products.map((product) => (
                <div
                  key={product.id}
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "12px",
                    overflow: "hidden",
                    background: "#fff",
                  }}
                >
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      style={{
                        width: "100%",
                        height: "220px",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        height: "220px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "#eee",
                        color: "#777",
                      }}
                    >
                      No Image
                    </div>
                  )}

                  <div style={{ padding: "15px" }}>
                    <h3 style={{ margin: "0 0 8px" }}>
                      {product.name}
                    </h3>

                    <p
                      style={{
                        margin: "5px 0",
                        fontWeight: "bold",
                      }}
                    >
                      ₹{Number(product.price).toFixed(0)}
                    </p>

                    <p
                      style={{
                        margin: "5px 0",
                        color: "#666",
                      }}
                    >
                      {product.category}
                    </p>

                    {product.description && (
                      <p
                        style={{
                          margin: "10px 0",
                          color: "#555",
                          fontSize: "14px",
                          lineHeight: 1.5,
                        }}
                      >
                        {product.description}
                      </p>
                    )}

                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        marginTop: "15px",
                      }}
                    >
                      <button
                        onClick={() => startEdit(product)}
                        style={{
                          flex: 1,
                          background: "#111",
                          color: "#fff",
                          border: "none",
                          padding: "10px",
                          borderRadius: "7px",
                          cursor: "pointer",
                          fontWeight: "bold",
                        }}
                      >
                        ✏️ Edit
                      </button>

                      <button
                        onClick={() => deleteProduct(product)}
                        style={{
                          flex: 1,
                          background: "#d93025",
                          color: "#fff",
                          border: "none",
                          padding: "10px",
                          borderRadius: "7px",
                          cursor: "pointer",
                          fontWeight: "bold",
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div
          style={{
            textAlign: "center",
            marginTop: "30px",
            color: "#777",
            fontSize: "14px",
          }}
        >
          NASHAMADES Admin Panel
        </div>
      </div>
    </div>
  );
}

export default Admin;