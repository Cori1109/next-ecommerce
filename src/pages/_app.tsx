import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider, useSession } from 'next-auth/react';
import { StoreProvider } from '@/utils/store';
import { useRouter } from 'next/router';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

// @ts-ignore
function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <StoreProvider>
        <PayPalScriptProvider
          deferLoading={true}
          options={{ 'client-id': process.env.PAYPAL_CLIENT_ID || 'sb' }}
        >
          {
            // @ts-ignore
            Component.auth ? (
              // @ts-ignore
              <Auth adminOnly={Component.auth.adminOnly}>
                <Component {...pageProps} />
              </Auth>
            ) : (
              <Component {...pageProps} />
            )
          }
        </PayPalScriptProvider>
      </StoreProvider>
    </SessionProvider>
  );
}

function Auth({ children, adminOnly }) {
  const router = useRouter();
  const { status, data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/unauthorized?message=login required');
    },
  });
  if (status === 'loading') {
    return <div>Loading...</div>;
  }
  // @ts-ignore
  if (adminOnly && !session.user.isAdmin) {
    router.push('/unauthorized?message=admin login required');
  }

  return children;
}

export default MyApp;
