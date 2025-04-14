import { createSignal } from 'solid-js';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage = (props: LoginPageProps) => {
  // In a real application, we would use Supabase auth here
  const [email, setEmail] = createSignal('');
  const [password, setPassword] = createSignal('');
  const [isLoading, setIsLoading] = createSignal(false);

  const handleLogin = async (e: Event) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // In a real app, we would use Supabase auth here
      // const { user, error } = await supabase.auth.signInWithPassword({
      //   email: email(),
      //   password: password(),
      // });
      
      setIsLoading(false);
      props.onLogin();
    }, 1000);
  };

  return (
    <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div class="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Pocket SDK UI
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Sign in to your account
          </p>
        </div>
        <form class="mt-8 space-y-6" onSubmit={handleLogin}>
          <div class="rounded-md shadow-sm -space-y-px">
            <div>
              <label for="email-address" class="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autocomplete="email"
                required
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email()}
                onInput={(e) => setEmail(e.currentTarget.value)}
              />
            </div>
            <div>
              <label for="password" class="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autocomplete="current-password"
                required
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password()}
                onInput={(e) => setPassword(e.currentTarget.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading()}
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading() ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
          
          <div class="flex items-center justify-center">
            <div class="text-sm">
              <button
                type="button"
                class="font-medium text-indigo-600 hover:text-indigo-500"
                onClick={props.onLogin}
              >
                Skip login for demo
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
