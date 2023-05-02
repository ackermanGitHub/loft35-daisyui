import App, { type AppType, type AppContext } from 'next/app';
import { type Session } from 'next-auth';
import { SessionProvider, getSession } from 'next-auth/react';
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

MyApp.getInitialProps = async (context: AppContext) => {
  const appProps = await App.getInitialProps(context);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const session = await getSession(context);

  return {
    ...appProps,
    session,
  };
};

export default api.withTRPC(MyApp);
