import '@/app/globals.css';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <Component {...pageProps} />
    </main>
  );
}