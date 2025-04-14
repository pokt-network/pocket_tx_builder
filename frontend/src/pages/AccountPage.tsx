import { createSignal } from 'solid-js';

const AccountPage = () => {
  const [accountAddress, setAccountAddress] = createSignal('');
  const [privateKey, setPrivateKey] = createSignal('');
  const [result, setResult] = createSignal<any>(null);
  const [isLoading, setIsLoading] = createSignal(false);

  const handleQueryAccount = async () => {
    if (!accountAddress()) return;
    
    setIsLoading(true);
    try {
      // In a real app, this would call our backend API
      const response = await fetch('/api/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          command: ['query', 'account', accountAddress()],
          network: 'alpha', // This would be dynamic based on selected network
        }),
      });
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error querying account:', error);
      setResult({ error: 'Failed to query account' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Account Management</h1>
        <p class="mt-1 text-gray-600 dark:text-gray-400">
          Query and manage your Pocket Network accounts
        </p>
      </div>
      
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Query Account</h2>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Account Address
            </label>
            <input
              type="text"
              value={accountAddress()}
              onInput={(e) => setAccountAddress(e.currentTarget.value)}
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter account address"
            />
          </div>
          
          <button
            onClick={handleQueryAccount}
            disabled={isLoading() || !accountAddress()}
            class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading() ? 'Loading...' : 'Query Account'}
          </button>
        </div>
        
        {result() && (
          <div class="mt-6">
            <h3 class="text-md font-medium text-gray-900 dark:text-white mb-2">Result:</h3>
            <pre class="bg-gray-100 dark:bg-gray-900 p-4 rounded-md overflow-auto text-sm">
              {JSON.stringify(result(), null, 2)}
            </pre>
          </div>
        )}
      </div>
      
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Create Account</h2>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Private Key (optional)
            </label>
            <input
              type="password"
              value={privateKey()}
              onInput={(e) => setPrivateKey(e.currentTarget.value)}
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter private key or leave empty to generate new"
            />
          </div>
          
          <button
            class="btn-primary"
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
