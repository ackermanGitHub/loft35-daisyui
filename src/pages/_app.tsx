import { type AppType } from 'next/app';
import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { CookiesProvider } from 'react-cookie';
import { Analytics } from '@vercel/analytics/react';

import { api } from '~/utils/api';
import ChatBubblesProvider from '~/context/ChatBubbles';
import '~/styles/globals.css';
import CartProvider from '~/context/ShoppingCart';

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Analytics mode={'production'} />
      <ChatBubblesProvider>
        <CookiesProvider>
          <CartProvider>
            <Component {...pageProps} />
          </CartProvider>
        </CookiesProvider>
      </ChatBubblesProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
