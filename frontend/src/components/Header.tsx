import { createSignal, Setter } from 'solid-js';

interface HeaderProps {
  currentNetwork: string;
  setCurrentNetwork: Setter<string>;
  onLogout: () => void;
}

const Header = (props: HeaderProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = createSignal(false);
  
  const networks = [
    { id: 'alpha', label: 'Alpha' },
    { id: 'beta', label: 'Beta' },
    { id: 'mainnet', label: 'MainNet' },
  ];

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen());
  
  const selectNetwork = (networkId: string) => {
    props.setCurrentNetwork(networkId);
    setIsDropdownOpen(false);
  };

  return (
    <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-4 px-6 flex justify-between items-center">
      <div class="relative">
        <button
          onClick={toggleDropdown}
          class="flex items-center space-x-2 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600"
        >
          <span>Network: {networks.find(n => n.id === props.currentNetwork)?.label}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
        
        {isDropdownOpen() && (
          <div class="absolute mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 z-10">
            <div class="py-1" role="menu" aria-orientation="vertical">
              {networks.map((network) => (
                <button
                  class={`block w-full text-left px-4 py-2 text-sm ${
                    props.currentNetwork === network.id
                      ? 'bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                  onClick={() => selectNetwork(network.id)}
                >
                  {network.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div>
        <button
          onClick={props.onLogout}
          class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
