import { Navigate, redirect } from 'solid-start';

export function GET() {
  return redirect('login');
}

export default function PlaygroundPage() {
  return <Navigate href="login" />;
}
