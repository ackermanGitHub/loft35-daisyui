import { type AppType } from 'next/app';
import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { CookiesProvider } from 'react-cookie';
import { Analytics } from '@vercel/analytics/react';
import { ToastProvider } from '~/hooks/useToast';

import { api } from '~/utils/api';
import '~/styles/globals.css';
import CartProvider from '~/components/cart/ShoppingCart';

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Analytics mode={process.env.NODE_ENV === 'production' ? 'production' : 'development'} />
      <CookiesProvider>
        <CartProvider>
          <ToastProvider>
            <Component {...pageProps} />
          </ToastProvider>
        </CartProvider>
      </CookiesProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
