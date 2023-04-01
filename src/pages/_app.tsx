import { type AppType } from 'next/app';
import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { Analytics } from '@vercel/analytics/react';

import { api } from '~/utils/api';
import ChatBubblesProvider from '~/context/ChatBubbles';
import '~/styles/globals.css';

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Analytics mode={'production'} />
      <ChatBubblesProvider>
        <Component {...pageProps} />
      </ChatBubblesProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
