import {
  createAccount,
  exportAccountHex,
  getExplorerUrl,
} from "../services/api";

import AccountListCard from "../components/AccountListCard";
import type { AccountResponse } from "../services/api";
import { createSignal } from "solid-js";

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
                  {`pocketd keys import-hex ${
                    createdAccount()?.name
                  } ${accountHexKey()} --key-type secp256k1 --keyring-backend test`}
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
                      `pocketd keys import-hex ${
                        createdAccount()?.name
                      } ${accountHexKey()} --key-type secp256k1 --keyring-backend test`
                    )
                  }
                  disabled={!accountHexKey()}
                >
                  Copy
                </button>
              </div>
              {hexKeyLoading() && (
                <div
                  style={{
                    "font-size": "0.85rem",
                    color: "#888",
                    "margin-top": "0.25rem",
                  }}
                >
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
      {/* Account List Section at the bottom */}
      <section class="mt-16">
        <AccountListCard />
      </section>
    </div>
  );
};

export default AccountPage;
