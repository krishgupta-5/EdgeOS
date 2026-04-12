/**
 * Legacy page placeholder.
 * The original UI has been moved to /chat.
 */
import { redirect } from 'next/navigation';

export default function OldPage() {
  redirect('/chat');
}