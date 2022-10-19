import { Navigate } from 'solid-start';
import { redirect } from '~/utils';

export function GET() {
  return redirect('createform');
}

export default function GuidesPage() {
  return <Navigate href="createform" />;
}
