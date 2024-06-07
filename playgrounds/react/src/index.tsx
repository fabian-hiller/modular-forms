import '@preact/signals-react/auto';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Tabs } from './components';
import LoginPage from './routes/login';
import PaymentPage from './routes/payment';
import TodosPage from './routes/todos';
import SpecialPage from './routes/special';
import NestedPage from './routes/nested';
import './global.css';

function App() {
  return (
    <BrowserRouter>
      <Tabs items={['Login', 'Payment', 'Todos', 'Special', 'Nested']} />
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/todos" element={<TodosPage />} />
          <Route path="/special" element={<SpecialPage />} />
          <Route path="/nested" element={<NestedPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

createRoot(document.getElementById('app') as HTMLElement).render(<App />);
