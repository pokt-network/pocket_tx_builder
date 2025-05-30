// API Service for communicating with the backend

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Types
export interface CreateAccountRequest {
  network: string;
  key_name?: string;
}

export interface AccountResponse {
  address: string;
  name: string;
  mnemonic: string;
  message: string;
}

export interface CommandResponse {
  stdout: string;
  stderr: string;
  exit_code: number;
  txhash?: string;
}

// API functions
export async function createAccount(params: CreateAccountRequest): Promise<AccountResponse> {
  try {
    // Using the mock endpoint that doesn't require authentication
    const response = await fetch(`${API_URL}/account/create-mock`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to create account');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating account:', error);
    throw error;
  }
}

// Export the private key in hex for a given account name
export async function exportAccountHex(name: string, network: string = 'alpha'): Promise<string> {
  const response = await fetch(`${API_URL}/account/export-hex/${name}?network=${network}`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to export private key');
  }
  const data = await response.json();
  return data.hex;
}

// List accounts (calls backend to run 'pocketd keys list --output json')
export async function listAccounts(network: string = 'alpha'): Promise<Array<{ name: string; address: string }>> {
  try {
    const response = await fetch(`${API_URL}/run-mock`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        command: ['keys', 'list', '--output', 'json'],
        network,
      }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to list accounts');
    }
    const data = await response.json();
    // If backend returns CommandResponse, parse stdout
    let accounts: Array<{ name: string; address: string }> = [];
    if (data.stdout) {
      try {
        const parsed = JSON.parse(data.stdout);
        accounts = parsed.map((acc: any) => ({ name: acc.name, address: acc.address }));
      } catch {
        // fallback: return empty
      }
    }
    return accounts;
  } catch (error) {
    console.error('Error listing accounts:', error);
    throw error;
  }
}

export async function getAccount(address: string, network: string = 'alpha'): Promise<CommandResponse> {
  try {
    const response = await fetch(`${API_URL}/account/${address}?network=${network}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to get account');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting account:', error);
    throw error;
  }
}

export async function fundAccount(address: string, amount: string, fromAccount: string, network: string = 'alpha'): Promise<CommandResponse> {
  try {
    const response = await fetch(`${API_URL}/account/fund`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address,
        amount,
        from_account: fromAccount,
        network,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to fund account');
    }

    return await response.json();
  } catch (error) {
    console.error('Error funding account:', error);
    throw error;
  }
}

// Helper function to get explorer URL based on network
export function getExplorerUrl(network: string, address: string): string {
  let baseUrl = '';
  
  switch (network) {
    case 'alpha':
      baseUrl = 'https://explorer.alpha.poktroll.com';
      break;
    case 'beta':
      baseUrl = 'https://explorer.beta.poktroll.com';
      break;
    case 'mainnet':
      baseUrl = 'https://explorer.poktroll.com';
      break;
    default:
      baseUrl = 'https://explorer.alpha.poktroll.com';
  }
  
  return `${baseUrl}/account/${address}`;
}
