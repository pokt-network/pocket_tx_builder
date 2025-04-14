import { createSignal } from 'solid-js';

const SupplierPage = () => {
  const [supplierAddress, setSupplierAddress] = createSignal('');
  const [supplierName, setSupplierName] = createSignal('');
  const [stake, setStake] = createSignal('');
  const [result, setResult] = createSignal<any>(null);
  const [isLoading, setIsLoading] = createSignal(false);

  const handleQuerySupplier = async () => {
    if (!supplierAddress()) return;
    
    setIsLoading(true);
    try {
      // In a real app, this would call our backend API
      const response = await fetch('/api/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          command: ['query', 'supplier', supplierAddress()],
          network: 'alpha', // This would be dynamic based on selected network
        }),
      });
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error querying supplier:', error);
      setResult({ error: 'Failed to query supplier' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Supplier & RelayMiner Management</h1>
        <p class="mt-1 text-gray-600 dark:text-gray-400">
          Query and manage Pocket Network suppliers and relay miners
        </p>
      </div>
      
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Query Supplier</h2>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Supplier Address
            </label>
            <input
              type="text"
              value={supplierAddress()}
              onInput={(e) => setSupplierAddress(e.currentTarget.value)}
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter supplier address"
            />
          </div>
          
          <button
            onClick={handleQuerySupplier}
            disabled={isLoading() || !supplierAddress()}
            class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading() ? 'Loading...' : 'Query Supplier'}
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
        <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Stake as Supplier</h2>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Supplier Name
            </label>
            <input
              type="text"
              value={supplierName()}
              onInput={(e) => setSupplierName(e.currentTarget.value)}
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter supplier name"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Stake Amount
            </label>
            <input
              type="text"
              value={stake()}
              onInput={(e) => setStake(e.currentTarget.value)}
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter stake amount"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Service URLs
            </label>
            <input
              type="text"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter service URLs (comma separated)"
            />
          </div>
          
          <button
            class="btn-primary"
          >
            Stake as Supplier
          </button>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">RelayMiner Configuration</h2>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              RelayMiner Endpoint
            </label>
            <input
              type="text"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter RelayMiner endpoint"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Supported Services
            </label>
            <input
              type="text"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter supported services (comma separated)"
            />
          </div>
          
          <button
            class="btn-primary"
          >
            Configure RelayMiner
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupplierPage;
