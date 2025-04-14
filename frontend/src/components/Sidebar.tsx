import { createSignal } from 'solid-js';
import { A } from '@solidjs/router';

const Sidebar = () => {
  const [activeItem, setActiveItem] = createSignal('account');

  const menuItems = [
    { id: 'account', label: 'Account', path: '/account' },
    { id: 'service', label: 'Service', path: '/service' },
    { id: 'full-node', label: 'Full Node', path: '/full-node' },
    { id: 'validator', label: 'Validator', path: '/validator' },
    { id: 'supplier', label: 'Supplier & RelayMiner', path: '/supplier' },
  ];

  return (
    <aside class="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-shrink-0 h-full overflow-y-auto">
      <div class="p-4">
        <h1 class="text-xl font-bold text-gray-800 dark:text-white">Pocket SDK UI</h1>
      </div>
      <nav class="mt-4">
        <ul class="space-y-1 px-2">
          {menuItems.map((item) => (
            <li>
              <A
                href={item.path}
                class={`sidebar-item ${activeItem() === item.id ? 'active' : ''}`}
                onClick={() => setActiveItem(item.id)}
              >
                <span>{item.label}</span>
              </A>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
