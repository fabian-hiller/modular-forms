import { Navigate, redirect } from 'solid-start';

export function GET() {
  return redirect('introduction');
}

export default function GuidesPage() {
  return <Navigate href="introduction" />;
}
