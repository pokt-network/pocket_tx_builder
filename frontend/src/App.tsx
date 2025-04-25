import "./App.css";

// Import API functions
import {
  AccountResponse,
  createAccount,
  getExplorerUrl,
  listAccounts,
  exportAccountHex,
} from "./services/api";

import { createResource } from "solid-js";
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

// AccountsList component: lists all available accounts
function AccountsList(props: { network: string }) {
  const [accounts] = createResource(() => props.network, listAccounts);
  return (
    <div style={{ padding: "1rem" }}>
      {accounts.loading && <div>Loading accounts...</div>}
      {accounts.error && (
        <div style={{ color: "red" }}>Failed to load accounts.</div>
      )}
      {accounts() && accounts().length === 0 && <div>No accounts found.</div>}
      {accounts() && accounts().length > 0 && (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "0.5rem",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  textAlign: "left",
                  padding: "0.5rem",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                Name
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "0.5rem",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                Address
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {accounts() &&
              accounts().map((acc: { name: string; address: string }) => (
                <tr>
                  <td style={{ padding: "0.5rem", fontFamily: "monospace" }}>
                    {acc.name}
                  </td>
                  <td
                    style={{
                      padding: "0.5rem",
                      fontFamily: "monospace",
                      wordBreak: "break-all",
                    }}
                  >
                    {acc.address}
                  </td>
                  <td>
                    <button
                      style={{
                        padding: "0.25rem 0.5rem",
                        border: "none",
                        borderRadius: "4px",
                        background: "#e5e7eb",
                        cursor: "pointer",
                      }}
                      onClick={() => navigator.clipboard.writeText(acc.address)}
                    >
                      Copy
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// Account page components
const AccountPage = (props: { network: string }) => {
  const [isCreating, setIsCreating] = createSignal(false);
  const [keyName, setKeyName] = createSignal("");
  const [createdAccount, setCreatedAccount] =
    createSignal<AccountResponse | null>(null);
  const [accountHexKey, setAccountHexKey] = createSignal<string>("");
  const [hexKeyLoading, setHexKeyLoading] = createSignal<boolean>(false);
  const [hexKeyError, setHexKeyError] = createSignal<string>("");
  const [error, setError] = createSignal("");
  const [isLoading, setIsLoading] = createSignal(false);
  const [showMnemonic, setShowMnemonic] = createSignal(false);

  const handleCreateAccount = async () => {
    setIsLoading(true);
    setError("");
    setAccountHexKey("");
    setHexKeyError("");
    setHexKeyLoading(false);

    try {
      const result = await createAccount({
        network: props.network, // Use the global network setting passed as prop
        key_name: keyName() || undefined,
      });

      setCreatedAccount(result);
      setIsCreating(false);
      setIsLoading(false);
      setShowMnemonic(false);
      setKeyName("");
      // Fetch hex key after account creation
      setHexKeyLoading(true);
      try {
        const hex = await exportAccountHex(result.name, props.network);
        setAccountHexKey(hex);
      } catch (err: any) {
        setHexKeyError(err.message || "Failed to export private key");
      } finally {
        setHexKeyLoading(false);
      }
    } catch (err: any) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setKeyName("");
    setCreatedAccount(null);
    setError("");
    setIsCreating(false);
    setShowMnemonic(false);
  };

  const toggleShowMnemonic = () => {
    setShowMnemonic(!showMnemonic());
  };

  return (
    <div>
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Account Management</h2>
        </div>
        <p>Create and manage your Pocket Network accounts.</p>

        {!isCreating() && !createdAccount() && (
          <div style={{ "margin-top": "1.5rem" }}>
            <button class="btn btn-primary" onClick={() => setIsCreating(true)}>
              Create New Account
            </button>
          </div>
        )}

        {isCreating() && !createdAccount() && (
          <div style={{ "margin-top": "1.5rem" }}>
            <div style={{ "margin-bottom": "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  "margin-bottom": "0.5rem",
                  "font-weight": "500",
                }}
              >
                Key Name (optional)
              </label>
              <input
                type="text"
                value={keyName()}
                onInput={(e) => setKeyName(e.currentTarget.value)}
                placeholder="Enter a name for your key (optional)"
                style={{
                  width: "100%",
                  "max-width": "400px",
                  padding: "0.5rem",
                  border: "1px solid var(--border-color)",
                  "border-radius": "6px",
                  "font-size": "0.875rem",
                }}
              />
              <p
                style={{
                  "font-size": "0.75rem",
                  color: "var(--text-secondary)",
                  "margin-top": "0.25rem",
                }}
              >
                If not provided, a random name will be generated
              </p>
            </div>

            <div style={{ "margin-bottom": "1.5rem" }}>
              {/* Removed network wording for agnostic UI */}
              <p
                style={{
                  "font-size": "0.875rem",
                  color: "var(--text-secondary)",
                }}
              >
                Account will be created. Mnemonic and import instructions will
                be shown after creation.
              </p>
            </div>

            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                class="btn btn-primary"
                onClick={handleCreateAccount}
                disabled={isLoading()}
              >
                {isLoading() ? "Creating..." : "Create Account"}
              </button>
              <button class="btn btn-outline" onClick={resetForm}>
                Cancel
              </button>
            </div>

            {error() && (
              <div
                style={{
                  "margin-top": "1rem",
                  padding: "0.75rem",
                  "background-color": "rgba(239, 68, 68, 0.1)",
                  color: "#ef4444",
                  "border-radius": "6px",
                }}
              >
                {error()}
              </div>
            )}
          </div>
        )}

        {createdAccount() && (
          <div style={{ "margin-top": "1.5rem" }}>
            <div
              style={{
                "background-color": "rgba(16, 185, 129, 0.1)",
                "border-radius": "6px",
                padding: "1rem",
                "margin-bottom": "1.5rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  "align-items": "center",
                  gap: "0.5rem",
                  "margin-bottom": "0.5rem",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#10b981"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <span style={{ "font-weight": "600", color: "#10b981" }}>
                  Account Created Successfully!
                </span>
              </div>
            </div>

            <div style={{ "margin-bottom": "1.5rem" }}>
              <label
                style={{
                  "font-weight": "500",
                  display: "block",
                  "margin-bottom": "0.25rem",
                }}
              >
                Import Command:
              </label>
              <div
                style={{
                  display: "flex",
                  "align-items": "center",
                  gap: "0.5rem",
                }}
              >
                <code
                  style={{
                    background: "#f3f4f6",
                    padding: "0.5rem",
                    "border-radius": "4px",
                    "font-size": "0.95em",
                  }}
                >
                  {`pocketd keys import-hex ${createdAccount()?.name} ${accountHexKey()} --key-type secp256k1 --keyring-backend test`}
                </code>
                <button
                  style={{
                    padding: "0.25rem 0.5rem",
                    border: "none",
                    "border-radius": "4px",
                    background: "#e5e7eb",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    navigator.clipboard.writeText(
                      `pocketd keys import-hex ${createdAccount()?.name} ${accountHexKey()} --key-type secp256k1 --keyring-backend test`
                    )
                  }
                  disabled={!accountHexKey()}
                >
                  Copy
                </button>
              </div>
              {hexKeyLoading() && (
                <div style={{ "font-size": "0.85rem", color: "#888", "margin-top": "0.25rem" }}>
                  Exporting private key...
                </div>
              )}
              {hexKeyError() && (
                <div style={{ color: "#ef4444", "margin-top": "0.25rem" }}>
                  {hexKeyError()}
                </div>
              )}
            </div>

            <div style={{ "margin-bottom": "1.5rem" }}>
              <h3
                style={{
                  "font-size": "1rem",
                  "font-weight": "600",
                  "margin-bottom": "0.5rem",
                }}
              >
                Account Details
              </h3>

              <div style={{ "margin-bottom": "1rem" }}>
                <label
                  style={{
                    "font-weight": "500",
                    display: "block",
                    "margin-bottom": "0.25rem",
                  }}
                >
                  Key Name:
                </label>
                <div
                  style={{
                    "font-family": "monospace",
                    "background-color": "var(--bg-light)",
                    padding: "0.5rem",
                    "border-radius": "4px",
                  }}
                >
                  {createdAccount()?.name}
                </div>
              </div>

              <div style={{ "margin-bottom": "1rem" }}>
                <label
                  style={{
                    "font-weight": "500",
                    display: "block",
                    "margin-bottom": "0.25rem",
                  }}
                >
                  Address:
                </label>
                <div
                  style={{
                    "font-family": "monospace",
                    "background-color": "var(--bg-light)",
                    padding: "0.5rem",
                    "border-radius": "4px",
                    "word-break": "break-all",
                  }}
                >
                  <a
                    href={getExplorerUrl(
                      props.network,
                      createdAccount()?.address || ""
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "var(--primary-color)",
                      "text-decoration": "none",
                    }}
                  >
                    {createdAccount()?.address}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      style={{
                        "margin-left": "0.25rem",
                        "vertical-align": "middle",
                      }}
                    >
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                  </a>
                </div>
              </div>

              

              <div style={{ "margin-bottom": "1rem" }}>
                <label
                  style={{
                    "font-weight": "500",
                    display: "block",
                    "margin-bottom": "0.25rem",
                  }}
                >
                  Mnemonic Phrase:
                </label>

                <div style={{ position: "relative" }}>
                  <div
                    style={{
                      "font-family": "monospace",
                      "background-color": "var(--bg-light)",
                      padding: "0.75rem",
                      "border-radius": "4px",
                      filter: showMnemonic() ? "none" : "blur(5px)",
                      "user-select": showMnemonic() ? "text" : "none",
                      "word-spacing": "0.25rem",
                      "line-height": "1.5",
                      "word-break": "break-all",
                    }}
                  >
                    {createdAccount()?.mnemonic}
                  </div>

                  {!showMnemonic() && (
                    <button
                      onClick={toggleShowMnemonic}
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        "background-color": "var(--primary-color)",
                        color: "white",
                        border: "none",
                        padding: "0.5rem 1rem",
                        "border-radius": "4px",
                        cursor: "pointer",
                        "font-weight": "500",
                        "font-size": "0.875rem",
                        "z-index": "1",
                      }}
                    >
                      Show Mnemonic
                    </button>
                  )}
                </div>

                <div
                  style={{
                    "margin-top": "1rem",
                    padding: "0.75rem",
                    "background-color": "rgba(245, 158, 11, 0.1)",
                    "border-radius": "6px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      "align-items": "flex-start",
                      gap: "0.5rem",
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#f59e0b"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      style={{ "margin-top": "0.125rem" }}
                    >
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                      <line x1="12" y1="9" x2="12" y2="13"></line>
                      <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                    <div>
                      <p
                        style={{
                          "font-weight": "600",
                          color: "#f59e0b",
                          "margin-bottom": "0.25rem",
                        }}
                      >
                        Important Warning
                      </p>
                      <p style={{ "font-size": "0.875rem", color: "#92400e" }}>
                        Write this mnemonic phrase in a safe place. It is the{" "}
                        <strong>only way</strong> to recover your account if you
                        ever forget your password. Anyone with access to this
                        mnemonic can access your funds.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button class="btn btn-outline" onClick={resetForm}>
                Create Another Account
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ServicePage = (props: { network: string }) => (
  <div class="card">
    <div class="card-header">
      <h2 class="card-title">Service Management</h2>
    </div>
    <p>Create and manage services on the Pocket Network.</p>
    <div style={{ "margin-top": "1.5rem" }}>
      <button
        class="btn btn-primary"
        onClick={() => alert("Create Service clicked!")}
      >
        Create Service
      </button>
    </div>
  </div>
);

const ComingSoonPage = ({
  title,
  network,
}: {
  title: string;
  network: string;
}) => (
  <div class="coming-soon">
    <h1>{title}</h1>
    <p>
      This feature is currently under development and will be available soon.
    </p>
    <button class="btn btn-outline" onClick={() => history.back()}>
      Go Back
    </button>
  </div>
);

function App() {
  const [currentNetwork, setCurrentNetwork] = createSignal("alpha");
  const [sidebarCollapsed, setSidebarCollapsed] = createSignal(false);
  const [activePage, setActivePage] = createSignal("account");
  const [userInitials] = createSignal("DO"); // Default initials

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed());
  };

  const renderPage = () => {
    const network = currentNetwork();
    switch (activePage()) {
      case "account":
        return <AccountPage network={network} />;
      case "service":
        return <ServicePage network={network} />;
      case "validator":
      case "supplier":
      case "gateway":
        return (
          <ComingSoonPage
            network={network}
            title={`${
              activePage().charAt(0).toUpperCase() + activePage().slice(1)
            } Management`}
          />
        );
      default:
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
