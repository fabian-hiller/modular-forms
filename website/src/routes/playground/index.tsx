import { Navigate } from 'solid-start';
import { redirect } from '~/utils';

export function GET() {
  return redirect('login');
}

export default function PlaygroundPage() {
  return <Navigate href="login" />;
}
