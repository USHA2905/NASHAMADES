import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import Admin from "./Admin.jsx";

function AdminLogin() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [loggingIn, setLoggingIn] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSession(session);
      setLoading(false);
    }

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function handleLogin(e) {
    e.preventDefault();

    setError("");
    setLoggingIn(true);

    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      console.error(error);
      setError("❌ Incorrect email or password.");
      setLoggingIn(false);
      return;
    }

    setSession(data.session);
    setLoggingIn(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setSession(null);
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <h2>Loading...</h2>
      </div>
    );
  }

  if (session) {
    return (
      <div>
        <div
          style={{
            position: "fixed",
            top: "15px",
            right: "20px",
            zIndex: 9999,
          }}
        >
          <button
            onClick={handleLogout}
            style={{
              background: "#d93025",
              color: "#fff",
              border: "none",
              padding: "10px 18px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Logout
          </button>
        </div>

        <Admin />
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f7f3f0",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#fff",
          padding: "35px",
          borderRadius: "18px",
          boxShadow: "0 10px 35px rgba(0,0,0,0.12)",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          <h1
            style={{
              margin: 0,
              letterSpacing: "4px",
              fontSize: "30px",
            }}
          >
            NASHAMADES
          </h1>

          <p
            style={{
              color: "#777",
              marginTop: "10px",
            }}
          >
            Admin Login
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <label
            style={{
              display: "block",
              fontWeight: "bold",
              marginBottom: "7px",
            }}
          >
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter admin email"
            required
            style={{
              width: "100%",
              padding: "13px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              boxSizing: "border-box",
              marginBottom: "18px",
            }}
          />

          <label
            style={{
              display: "block",
              fontWeight: "bold",
              marginBottom: "7px",
            }}
          >
            Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            required
            style={{
              width: "100%",
              padding: "13px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              boxSizing: "border-box",
              marginBottom: "20px",
            }}
          />

          {error && (
            <div
              style={{
                background: "#ffe8e8",
                color: "#b00020",
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "18px",
                fontSize: "14px",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loggingIn}
            style={{
              width: "100%",
              background: "#111",
              color: "#fff",
              border: "none",
              padding: "14px",
              borderRadius: "9px",
              cursor: loggingIn ? "not-allowed" : "pointer",
              fontWeight: "bold",
              fontSize: "16px",
            }}
          >
            {loggingIn ? "Signing in..." : "🔐 Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;