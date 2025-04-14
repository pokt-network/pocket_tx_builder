import { createSignal, Show } from 'solid-js';
import { Router, Route } from '@solidjs/router';
import './App.css';

// Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';

// Pages
import AccountPage from './pages/AccountPage';
import ServicePage from './pages/ServicePage';
import FullNodePage from './pages/FullNodePage';
import ValidatorPage from './pages/ValidatorPage';
import SupplierPage from './pages/SupplierPage';
import LoginPage from './pages/LoginPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = createSignal(false);
  const [currentNetwork, setCurrentNetwork] = createSignal('alpha');
  
  const login = () => {
    setIsLoggedIn(true);
  };
  
  const logout = () => {
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div class="min-h-screen flex flex-col">
        <Show
          when={isLoggedIn()}
          fallback={<LoginPage onLogin={login} />}
        >
          <div class="flex flex-1 overflow-hidden">
            <Sidebar />
            <div class="flex-1 flex flex-col overflow-hidden">
              <Header 
                currentNetwork={currentNetwork()} 
                setCurrentNetwork={setCurrentNetwork} 
                onLogout={logout}
              />
              <main class="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900">
                <Route path="/" component={AccountPage} />
                <Route path="/account" component={AccountPage} />
                <Route path="/service" component={ServicePage} />
                <Route path="/full-node" component={FullNodePage} />
                <Route path="/validator" component={ValidatorPage} />
                <Route path="/supplier" component={SupplierPage} />
              </main>
            </div>
          </div>
        </Show>
      </div>
    </Router>
  );
}

export default App;
