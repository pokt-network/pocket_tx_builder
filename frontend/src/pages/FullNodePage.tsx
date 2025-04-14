import { createSignal } from 'solid-js';

const FullNodePage = () => {
  const [nodeAddress, setNodeAddress] = createSignal('');
  const [nodeName, setNodeName] = createSignal('');
  const [result, setResult] = createSignal<any>(null);
  const [isLoading, setIsLoading] = createSignal(false);

  const handleQueryNode = async () => {
    if (!nodeAddress()) return;
    
    setIsLoading(true);
    try {
      // In a real app, this would call our backend API
      const response = await fetch('/api/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          command: ['query', 'node', nodeAddress()],
          network: 'alpha', // This would be dynamic based on selected network
        }),
      });
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error querying node:', error);
      setResult({ error: 'Failed to query node' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Full Node Management</h1>
        <p class="mt-1 text-gray-600 dark:text-gray-400">
          Query and manage Pocket Network full nodes
        </p>
      </div>
      
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Query Full Node</h2>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Node Address
            </label>
            <input
              type="text"
              value={nodeAddress()}
              onInput={(e) => setNodeAddress(e.currentTarget.value)}
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter node address"
            />
          </div>
          
          <button
            onClick={handleQueryNode}
            disabled={isLoading() || !nodeAddress()}
            class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading() ? 'Loading...' : 'Query Node'}
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
        <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Configure Full Node</h2>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Node Name
            </label>
            <input
              type="text"
              value={nodeName()}
              onInput={(e) => setNodeName(e.currentTarget.value)}
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter node name"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              RPC Endpoint
            </label>
            <input
              type="text"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter RPC endpoint"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Chain ID
            </label>
            <input
              type="text"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter chain ID"
            />
          </div>
          
          <button
            class="btn-primary"
          >
            Configure Node
          </button>
        </div>
      </div>
    </div>
  );
};

export default FullNodePage;
