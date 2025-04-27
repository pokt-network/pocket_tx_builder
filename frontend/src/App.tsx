import "./App.css";

// Import API functions
// Account page components are now imported from pages/AccountPage
import AccountPage from "./pages/AccountPage";
import FullNodePage from "./pages/FullNodePage";
import LoginPage from "./pages/LoginPage";
import ServicePage from "./pages/ServicePage";
import SupplierPage from "./pages/SupplierPage";
import ValidatorPage from "./pages/ValidatorPage";
import { createSignal } from "solid-js";

// SVG Icons
const MenuIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

// HomeIcon removed as it's not being used

const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const ServiceIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
    <line x1="8" y1="21" x2="16" y2="21"></line>
    <line x1="12" y1="17" x2="12" y2="21"></line>
  </svg>
);

const ValidatorIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const SupplierIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline>
    <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
  </svg>
);

const GatewayIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
    <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
    <line x1="6" y1="6" x2="6.01" y2="6"></line>
    <line x1="6" y1="18" x2="6.01" y2="18"></line>
  </svg>
);




function App() {
  const [currentNetwork, setCurrentNetwork] = createSignal("alpha");
  const [sidebarCollapsed, setSidebarCollapsed] = createSignal(false);
  const [activePage, setActivePage] = createSignal("account");
  const [userInitials] = createSignal("DO"); // Default initials

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed());
  };

  // Page routing logic
  // - Add new cases as new pages are implemented
  const renderPage = () => {
    const network = currentNetwork();
    switch (activePage()) {
      case "account":
        return <AccountPage network={network} />;
      case "service":
        return <ServicePage />;
      case "full-node":
        return <FullNodePage />;
      case "supplier":
        return <SupplierPage />;
      case "validator":
        return <ValidatorPage />;
      case "login":
        // NOTE: You may need to implement login state and handler
        return <LoginPage onLogin={() => setActivePage("account")} />;
      default:
        // Default to AccountPage if route is unknown
        return <AccountPage network={network} />;
    }
  };


  return (
    <div class="app-container">
      {/* Sidebar */}
      <div class={`sidebar ${sidebarCollapsed() ? "sidebar-collapsed" : ""}`}>
        <div class="sidebar-header">
          <div class="sidebar-toggle" onClick={toggleSidebar}>
            <MenuIcon />
          </div>
          {!sidebarCollapsed() && <div class="sidebar-logo">Pocket SDK</div>}
        </div>
        <div class="sidebar-menu">
          <a
            class={`sidebar-menu-item ${
              activePage() === "account" ? "active" : ""
            }`}
            onClick={() => setActivePage("account")}
          >
            <span class="sidebar-menu-icon">
              <UserIcon />
            </span>
            {!sidebarCollapsed() && (
              <span class="sidebar-menu-text">Accounts</span>
            )}
          </a>
          <a
            class={`sidebar-menu-item ${
              activePage() === "service" ? "active" : ""
            }`}
            onClick={() => setActivePage("service")}
          >
            <span class="sidebar-menu-icon">
              <ServiceIcon />
            </span>
            {!sidebarCollapsed() && (
              <span class="sidebar-menu-text">Services</span>
            )}
          </a>
          <a
            class={`sidebar-menu-item ${
              activePage() === "validator" ? "active" : ""
            }`}
            onClick={() => setActivePage("validator")}
          >
            <span class="sidebar-menu-icon">
              <ValidatorIcon />
            </span>
            {!sidebarCollapsed() && (
              <span class="sidebar-menu-text">Validators</span>
            )}
          </a>
          <a
            class={`sidebar-menu-item ${
              activePage() === "supplier" ? "active" : ""
            }`}
            onClick={() => setActivePage("supplier")}
          >
            <span class="sidebar-menu-icon">
              <SupplierIcon />
            </span>
            {!sidebarCollapsed() && (
              <span class="sidebar-menu-text">Suppliers</span>
            )}
          </a>
          <a
            class={`sidebar-menu-item ${
              activePage() === "gateway" ? "active" : ""
            }`}
            onClick={() => setActivePage("gateway")}
          >
            <span class="sidebar-menu-icon">
              <GatewayIcon />
            </span>
            {!sidebarCollapsed() && (
              <span class="sidebar-menu-text">Gateways</span>
            )}
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div class="main-content">
        {/* Top Bar */}
        <div class="topbar">
          <div class="topbar-title">
            {activePage().charAt(0).toUpperCase() + activePage().slice(1)}{" "}
            Management
          </div>
          <div class="topbar-actions">
            <div class="network-selector">
              <select
                value={currentNetwork()}
                onChange={(e) => setCurrentNetwork(e.target.value)}
              >
                <option value="alpha">Alpha Network</option>
                <option value="beta">Beta Network</option>
                <option value="mainnet">MainNet</option>
              </select>
            </div>
            <div class="user-menu">
              <div class="user-avatar">{userInitials()}</div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div class="page-content">{renderPage()}</div>
      </div>
    </div>
  );
}

export default App;
