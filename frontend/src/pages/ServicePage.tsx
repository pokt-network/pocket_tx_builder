import { createSignal } from 'solid-js';

const ServicePage = () => {
  const [serviceId, setServiceId] = createSignal('');
  const [serviceName, setServiceName] = createSignal('');
  const [result, setResult] = createSignal<any>(null);
  const [isLoading, setIsLoading] = createSignal(false);

  const handleQueryService = async () => {
    if (!serviceId()) return;
    
    setIsLoading(true);
    try {
      // In a real app, this would call our backend API
      const response = await fetch('/api/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          command: ['query', 'service', serviceId()],
          network: 'alpha', // This would be dynamic based on selected network
        }),
      });
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error querying service:', error);
      setResult({ error: 'Failed to query service' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Service Management</h1>
        <p class="mt-1 text-gray-600 dark:text-gray-400">
          Query and manage Pocket Network services
        </p>
      </div>
      
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Query Service</h2>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Service ID
            </label>
            <input
              type="text"
              value={serviceId()}
              onInput={(e) => setServiceId(e.currentTarget.value)}
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter service ID"
            />
          </div>
          
          <button
            onClick={handleQueryService}
            disabled={isLoading() || !serviceId()}
            class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading() ? 'Loading...' : 'Query Service'}
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
        <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Create Service</h2>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Service Name
            </label>
            <input
              type="text"
              value={serviceName()}
              onInput={(e) => setServiceName(e.currentTarget.value)}
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter service name"
            />
          </div>
          
          <button
            class="btn-primary"
          >
            Create Service
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServicePage;
