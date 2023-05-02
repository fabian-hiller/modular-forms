import { render } from 'preact';
import { useEffect } from 'preact/hooks';
import { Router, Route, useRouter } from 'preact-router';
import LoginPage from './routes/login';
import PaymentPage from './routes/payment';
import './global.css';

function App() {
  // Use router
  const [router, naviagte] = useRouter();

  // Redirect if necessary
  useEffect(() => {
    if (router.path === '/') {
      naviagte('/login');
    }
  }, [router.path]);

  return (
    <Router>
      <Route path="/login" component={LoginPage} />
      <Route path="/payment" component={PaymentPage} />
    </Router>
  );
}

render(<App />, document.getElementById('app') as HTMLElement);
