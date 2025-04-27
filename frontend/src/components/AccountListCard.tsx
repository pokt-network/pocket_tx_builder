import MockAccountList from './MockAccountList';

export default function AccountListCard() {
  return (
    <div class="mt-10 flex justify-center">
      <div class="w-full max-w-2xl">
        <div class="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-0 border border-gray-200 dark:border-gray-700">
          <div class="px-6 pt-6 pb-2 border-b border-gray-100 dark:border-gray-700">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Account List</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Select an account to view details</p>
          </div>
          <div class="p-4">
            <MockAccountList />
          </div>
        </div>
      </div>
    </div>
  );
}
