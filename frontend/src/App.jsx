
import { useState, useEffect } from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    NavLink,
    Link,
    Outlet,
    useNavigate,
} from "react-router-dom";

import {
    Boxes,
    Package,
    LayoutDashboard,
    LogOut,
    AlertTriangle,
    Plus,
    Pencil,
    Trash2,
    Search,
    X,
    Eye,
    EyeOff,
    Menu,
    ArrowRight,
} from "lucide-react";

import api from "./api/axios";


// Error message helper
function getError(error) {
    const detail = error.response?.data?.detail;

    if (Array.isArray(detail)) {
        return detail.map((item) => item.msg).join(", ");
    }

    return typeof detail === "string"
        ? detail
        : "Something went wrong. Please try again.";
}


// Currency formatting
function money(value) {
    return Number(value).toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
    });
}


// Protected Route
function ProtectedRoute() {
    return localStorage.getItem("access_token")
        ? <Outlet />
        : <Navigate to="/login" replace />;
}


// Login and Registration
function AuthPage({ register = false }) {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        organization_name: "",
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function handleChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            if (register) {
                await api.post("/auth/register", form);
            }

            const response = await api.post("/auth/login", {
                email: form.email,
                password: form.password,
            });

            localStorage.setItem(
                "access_token",
                response.data.access_token
            );

            navigate("/dashboard", { replace: true });

        } catch (err) {
            setError(getError(err));
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-page">

            <div className="auth-banner">
                <div className="brand">
                    <Boxes size={34} />
                    StockFlow
                </div>

                <div>
                    <span className="eyebrow">
                        SMART INVENTORY MANAGEMENT
                    </span>

                    <h1>
                        Manage your inventory with confidence.
                    </h1>

                    <p>
                        Track products, manage stock and monitor
                        your inventory from one secure workspace.
                    </p>

                    <div className="banner-features">
                        <span>✓ Real-time inventory overview</span>
                        <span>✓ Low-stock monitoring</span>
                        <span>✓ Secure organization workspace</span>
                    </div>
                </div>

                <small>StockFlow Inventory Management</small>
            </div>

            <div className="auth-content">
                <div className="auth-card">

                    <h2>
                        {register
                            ? "Create your account"
                            : "Welcome back"}
                    </h2>

                    <p className="muted">
                        {register
                            ? "Set up your inventory workspace."
                            : "Sign in to manage your inventory."}
                    </p>

                    {error && (
                        <div className="error-message">{error}</div>
                    )}

                    <form onSubmit={handleSubmit}>

                        {register && (
                            <div className="field">
                                <label>Organization name</label>
                                <input
                                    name="organization_name"
                                    value={form.organization_name}
                                    onChange={handleChange}
                                    placeholder="Your organization"
                                    required
                                    maxLength={255}
                                />
                            </div>
                        )}

                        <div className="field">
                            <label>Email address</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        <div className="field">
                            <label>Password</label>

                            <div className="password-field">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    minLength={register ? 8 : 1}
                                    maxLength={128}
                                    required
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    aria-label="Toggle password visibility"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                >
                                    {showPassword
                                        ? <EyeOff size={19} />
                                        : <Eye size={19} />}
                                </button>
                            </div>
                        </div>

                        <button
                            className="primary-btn full-width"
                            disabled={loading}
                        >
                            {loading
                                ? "Please wait..."
                                : register
                                    ? "Create account"
                                    : "Sign in"}

                            <ArrowRight size={18} />
                        </button>

                    </form>

                    <p className="auth-switch">
                        {register
                            ? "Already have an account? "
                            : "Don't have an account? "}

                        <Link to={register ? "/login" : "/register"}>
                            {register ? "Sign in" : "Register"}
                        </Link>
                    </p>

                </div>
            </div>
        </div>
    );
}


// Main Layout
function Layout() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        api.get("/auth/me")
            .then((response) => setUser(response.data))
            .catch(() => {});
    }, []);

    function logout() {
        localStorage.removeItem("access_token");
        navigate("/login", { replace: true });
    }

    return (
        <div className="app-layout">

            {sidebarOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>

                <div className="brand">
                    <Boxes size={29} />
                    StockFlow
                </div>

                <div className="nav-label">WORKSPACE</div>

                <nav>
                    <NavLink
                        to="/dashboard"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <LayoutDashboard size={20} />
                        Dashboard
                    </NavLink>

                    <NavLink
                        to="/products"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <Package size={20} />
                        Products
                    </NavLink>
                </nav>

                <div className="sidebar-bottom">
                    <div className="user-profile">
                        <div className="avatar">
                            {user?.email?.[0]?.toUpperCase() || "U"}
                        </div>

                        <div className="user-info">
                            <strong>My workspace</strong>
                            <small>{user?.email || "Loading..."}</small>
                        </div>
                    </div>

                    <button className="logout-btn" onClick={logout}>
                        <LogOut size={19} />
                        Logout
                    </button>
                </div>

            </aside>

            <main className="main-content">
                <header className="topbar">

                    <button
                        className="mobile-menu"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        aria-label="Open navigation"
                    >
                        <Menu />
                    </button>

                    <span>Inventory Management System</span>

                    <div className="secure-label">
                        <span className="green-dot" />
                        Secure workspace
                    </div>

                </header>

                <div className="page-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}


// Dashboard
function Dashboard() {
    const [data, setData] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        api.get("/dashboard")
            .then((response) => setData(response.data))
            .catch((err) => setError(getError(err)));
    }, []);

    return (
        <>
            <div className="page-heading">
                <div>
                    <h1>Dashboard</h1>
                    <p>Monitor your inventory at a glance.</p>
                </div>

                <Link className="primary-btn" to="/products">
                    <Package size={18} />
                    Manage products
                </Link>
            </div>

            {error && <div className="error-message">{error}</div>}

            {!data && !error && (
                <div className="panel empty-state">
                    Loading dashboard...
                </div>
            )}

            {data && (
                <>
                    <div className="stats-grid">

                        <StatCard
                            title="Total Products"
                            value={data.total_products}
                            icon={<Package />}
                            color="blue"
                        />

                        <StatCard
                            title="Total Quantity"
                            value={data.total_quantity}
                            icon={<Boxes />}
                            color="green"
                        />

                        <StatCard
                            title="Low Stock Products"
                            value={data.low_stock_count}
                            icon={<AlertTriangle />}
                            color="orange"
                        />

                    </div>

                    <div className="panel">

                        <div className="panel-heading">
                            <div>
                                <h2>Low-stock products</h2>
                                <p className="muted">
                                    Products that need your attention.
                                </p>
                            </div>

                            <span className="badge warning">
                                {data.low_stock_count} alerts
                            </span>
                        </div>

                        {data.low_stock_products.length === 0 ? (
                            <div className="empty-state">
                                <Package size={38} />
                                <h3>No low-stock products</h3>
                                <p>Your inventory is looking good.</p>
                            </div>
                        ) : (
                            <div className="table-wrapper">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>SKU</th>
                                            <th>Quantity</th>
                                            <th>Threshold</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {data.low_stock_products.map((p) => (
                                            <tr key={p.id}>
                                                <td className="product-name">
                                                    {p.name}
                                                </td>
                                                <td>{p.sku}</td>
                                                <td>{p.quantity}</td>
                                                <td>{p.low_stock_threshold}</td>
                                                <td>
                                                    <StockBadge product={p} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                    </div>
                </>
            )}
        </>
    );
}


// Dashboard statistics card
function StatCard({ title, value, icon, color }) {
    return (
        <div className="stat-card">
            <div className={`stat-icon ${color}`}>{icon}</div>
            <p>{title}</p>
            <h2>{Number(value).toLocaleString("en-IN")}</h2>
        </div>
    );
}


// Stock status
function StockBadge({ product }) {
    if (product.quantity === 0) {
        return <span className="badge danger">Out of stock</span>;
    }

    if (product.quantity <= product.low_stock_threshold) {
        return <span className="badge warning">Low stock</span>;
    }

    return <span className="badge success">In stock</span>;
}


const emptyProduct = {
    name: "",
    sku: "",
    description: "",
    quantity: 0,
    cost_price: "",
    selling_price: "",
    low_stock_threshold: 5,
};


// Product Management
function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ ...emptyProduct });
    const [formError, setFormError] = useState("");
    const [saving, setSaving] = useState(false);

    async function loadProducts() {
        setLoading(true);
        setError("");

        try {
            const response = await api.get("/products");
            setProducts(response.data);
        } catch (err) {
            setError(getError(err));
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadProducts();
    }, []);

    function openAdd() {
        setEditing(null);
        setForm({ ...emptyProduct });
        setFormError("");
        setModalOpen(true);
    }

    function openEdit(product) {
        setEditing(product.id);

        setForm({
            name: product.name,
            sku: product.sku,
            description: product.description || "",
            quantity: product.quantity,
            cost_price: product.cost_price,
            selling_price: product.selling_price,
            low_stock_threshold: product.low_stock_threshold,
        });

        setFormError("");
        setModalOpen(true);
    }

    function handleChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    }

    async function saveProduct(e) {
        e.preventDefault();
        setSaving(true);
        setFormError("");
        setSuccess("");

        const payload = {
            ...form,
            quantity: Number(form.quantity),
            cost_price: form.cost_price,
            selling_price: form.selling_price,
            low_stock_threshold: Number(form.low_stock_threshold),
        };

        try {
            if (editing !== null) {
                await api.put(`/products/${editing}`, payload);
                setSuccess("Product updated successfully.");
            } else {
                await api.post("/products", payload);
                setSuccess("Product added successfully.");
            }

            setModalOpen(false);
            await loadProducts();

        } catch (err) {
            setFormError(getError(err));
        } finally {
            setSaving(false);
        }
    }

    async function deleteProduct(product) {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${product.name}"?`
        );

        if (!confirmed) return;

        setError("");
        setSuccess("");

        try {
            await api.delete(`/products/${product.id}`);
            setSuccess("Product deleted successfully.");
            await loadProducts();
        } catch (err) {
            setError(getError(err));
        }
    }

    const filteredProducts = products.filter((product) => {
        const keyword = search.toLowerCase().trim();

        const matchesSearch =
            product.name.toLowerCase().includes(keyword) ||
            product.sku.toLowerCase().includes(keyword);

        const isLowStock =
            product.quantity <= product.low_stock_threshold;

        const matchesFilter =
            filter === "all" ||
            (filter === "low" && isLowStock) ||
            (filter === "in" && !isLowStock) ||
            (filter === "out" && product.quantity === 0);

        return matchesSearch && matchesFilter;
    });

    return (
        <>
            <div className="page-heading">
                <div>
                    <h1>Products</h1>
                    <p>Manage your products and stock quantities.</p>
                </div>

                <button className="primary-btn" onClick={openAdd}>
                    <Plus size={20} />
                    Add product
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            {success && (
                <div className="success-message">
                    {success}
                    <button onClick={() => setSuccess("")}>
                        <X size={18} />
                    </button>
                </div>
            )}

            <div className="panel">

                <div className="toolbar">

                    <div className="search-field">
                        <Search size={19} />
                        <input
                            placeholder="Search by name or SKU..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="all">All stock statuses</option>
                        <option value="in">In stock</option>
                        <option value="low">Low stock</option>
                        <option value="out">Out of stock</option>
                    </select>

                </div>

                {loading ? (
                    <div className="empty-state">
                        Loading products...
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="empty-state">
                        <Package size={42} />
                        <h3>No products found</h3>
                        <p>
                            {products.length === 0
                                ? "Add your first product to get started."
                                : "Try changing your search or filter."}
                        </p>

                        {products.length === 0 && (
                            <button
                                className="primary-btn"
                                onClick={openAdd}
                            >
                                <Plus size={18} />
                                Add product
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>SKU</th>
                                    <th>Quantity</th>
                                    <th>Cost Price</th>
                                    <th>Selling Price</th>
                                    <th>Threshold</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredProducts.map((product) => (
                                    <tr key={product.id}>

                                        <td>
                                            <div className="product-name">
                                                {product.name}
                                            </div>

                                            <small className="description">
                                                {product.description}
                                            </small>
                                        </td>

                                        <td>{product.sku}</td>
                                        <td>{product.quantity}</td>
                                        <td>{money(product.cost_price)}</td>
                                        <td>{money(product.selling_price)}</td>
                                        <td>{product.low_stock_threshold}</td>

                                        <td>
                                            <StockBadge product={product} />
                                        </td>

                                        <td>
                                            <div className="actions">

                                                <button
                                                    className="icon-btn edit"
                                                    title="Edit product or stock"
                                                    aria-label={`Edit ${product.name}`}
                                                    onClick={() => openEdit(product)}
                                                >
                                                    <Pencil size={17} />
                                                </button>

                                                <button
                                                    className="icon-btn delete"
                                                    title="Delete product"
                                                    aria-label={`Delete ${product.name}`}
                                                    onClick={() =>
                                                        deleteProduct(product)
                                                    }
                                                >
                                                    <Trash2 size={17} />
                                                </button>

                                            </div>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="table-footer">
                    Showing {filteredProducts.length} of {products.length} products
                </div>

            </div>

            {modalOpen && (
                <div className="modal-overlay">
                    <div className="modal">

                        <div className="modal-heading">
                            <div>
                                <h2>
                                    {editing !== null
                                        ? "Edit product"
                                        : "Add new product"}
                                </h2>

                                <p className="muted">
                                    Enter product and stock information.
                                </p>
                            </div>

                            <button
                                className="icon-btn"
                                aria-label="Close form"
                                disabled={saving}
                                onClick={() => setModalOpen(false)}
                            >
                                <X size={23} />
                            </button>
                        </div>

                        {formError && (
                            <div className="error-message">{formError}</div>
                        )}

                        <form onSubmit={saveProduct}>

                            <div className="form-grid">

                                <div className="field">
                                    <label>Product name *</label>
                                    <input
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        required
                                        maxLength={255}
                                        placeholder="Wireless Mouse"
                                    />
                                </div>

                                <div className="field">
                                    <label>SKU *</label>
                                    <input
                                        name="sku"
                                        value={form.sku}
                                        onChange={handleChange}
                                        required
                                        maxLength={100}
                                        placeholder="WM-001"
                                    />
                                </div>

                                <div className="field span-two">
                                    <label>Description</label>
                                    <textarea
                                        name="description"
                                        value={form.description}
                                        onChange={handleChange}
                                        rows={3}
                                        placeholder="Product description"
                                    />
                                </div>

                                <div className="field">
                                    <label>Stock quantity *</label>
                                    <input
                                        type="number"
                                        name="quantity"
                                        min="0"
                                        step="1"
                                        value={form.quantity}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="field">
                                    <label>Low-stock threshold *</label>
                                    <input
                                        type="number"
                                        name="low_stock_threshold"
                                        min="0"
                                        step="1"
                                        value={form.low_stock_threshold}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="field">
                                    <label>Cost price (₹) *</label>
                                    <input
                                        type="number"
                                        name="cost_price"
                                        min="0"
                                        step="0.01"
                                        max="9999999999.99"
                                        value={form.cost_price}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="field">
                                    <label>Selling price (₹) *</label>
                                    <input
                                        type="number"
                                        name="selling_price"
                                        min="0"
                                        step="0.01"
                                        max="9999999999.99"
                                        value={form.selling_price}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                            </div>

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="secondary-btn"
                                    disabled={saving}
                                    onClick={() => setModalOpen(false)}
                                >
                                    Cancel
                                </button>

                                <button
                                    className="primary-btn"
                                    disabled={saving}
                                >
                                    {saving
                                        ? "Saving..."
                                        : editing !== null
                                            ? "Save changes"
                                            : "Add product"}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}
        </>
    );
}


// Application routes
export default function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route
                    path="/"
                    element={<Navigate to="/dashboard" replace />}
                />

                <Route
                    path="/login"
                    element={<AuthPage key="login" />}
                />

                <Route
                    path="/register"
                    element={<AuthPage key="register" register />}
                />

                <Route element={<ProtectedRoute />}>
                    <Route element={<Layout />}>

                        <Route
                            path="/dashboard"
                            element={<Dashboard />}
                        />

                        <Route
                            path="/products"
                            element={<Products />}
                        />

                    </Route>
                </Route>

                <Route
                    path="*"
                    element={<Navigate to="/dashboard" replace />}
                />

            </Routes>
        </BrowserRouter>
    );
}
