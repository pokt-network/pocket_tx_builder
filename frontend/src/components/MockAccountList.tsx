import { createSignal, For } from 'solid-js';

const mockAccounts = [
  { name: 'QuickFox123', address: 'abcd1234', details: { balance: '1000', type: 'user' } },
  { name: 'BraveBear456', address: 'efgh5678', details: { balance: '500', type: 'admin' } },
  { name: 'CleverEagle789', address: 'ijkl9012', details: { balance: '250', type: 'user' } },
];

export default function MockAccountList() {
  const [expanded, setExpanded] = createSignal<string | null>(null);
  return (
    <div class="divide-y divide-gray-200 dark:divide-gray-700">
      <For each={mockAccounts}>{(account) => (
        <div>
          <button
            class="w-full flex justify-between items-center py-3 px-2 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none transition"
            onClick={() => setExpanded(expanded() === account.address ? null : account.address)}
          >
            <span class="font-semibold text-gray-800 dark:text-gray-100">{account.name}</span>
            <span class="text-xs text-gray-500 dark:text-gray-400 ml-2">{account.address}</span>
            <svg
              class={`w-4 h-4 ml-2 transform transition-transform ${expanded() === account.address ? 'rotate-90' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
          {expanded() === account.address && (
            <div class="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg mt-2 mb-2 text-sm text-gray-700 dark:text-gray-200">
              <div><span class="font-medium">Address:</span> {account.address}</div>
              <div><span class="font-medium">Balance:</span> {account.details.balance}</div>
              <div><span class="font-medium">Type:</span> {account.details.type}</div>
            </div>
          )}
        </div>
      )}</For>
    </div>
  );
}
