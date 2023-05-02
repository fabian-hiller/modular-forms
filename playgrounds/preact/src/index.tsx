import { render } from 'preact';
import { useEffect } from 'preact/hooks';
import { Router, Route, useRouter } from 'preact-router';
import { Tabs } from './components';
import LoginPage from './routes/login';
import PaymentPage from './routes/payment';
import TodosPage from './routes/todos';
import SpecialPage from './routes/special';
import NestedPage from './routes/nested';
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
    <>
      <Tabs items={['Login', 'Payment', 'Todos', 'Special', 'Nested']} />
      <main>
        <Router>
          <Route path="/login" component={LoginPage} />
          <Route path="/payment" component={PaymentPage} />
          <Route path="/todos" component={TodosPage} />
          <Route path="/special" component={SpecialPage} />
          <Route path="/nested" component={NestedPage} />
        </Router>
      </main>
    </>
  );
}

render(<App />, document.getElementById('app') as HTMLElement);
