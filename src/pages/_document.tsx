import Document, {
  Html,
  Head,
  Main,
  NextScript,
  type DocumentProps,
  type DocumentContext,
} from 'next/document';
import { useEffect } from 'react';
import { prisma } from '~/server/db';

interface IDocumentProps extends DocumentProps {
  dataTheme: string;
}

export default function MyDocument({ dataTheme }: IDocumentProps) {
  console.log('MyDocument');

  useEffect(() => {
    console.log('MyDocument-useEffect');
  });

  return (
    <Html data-theme={dataTheme} lang="es">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with static-site generation (SSG).
MyDocument.getInitialProps = async (ctx: DocumentContext) => {
  console.log('MyDocument.getInitialProps');

  // Resolution order
  //
  // On the server:
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. document.getInitialProps
  // 4. app.render
  // 5. page.render
  // 6. document.render
  //
  // On the server with error:
  // 1. document.getInitialProps
  // 2. app.render
  // 3. page.render
  // 4. document.render
  //
  // On the client
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. app.render
  // 4. page.render

  const initialProps = await Document.getInitialProps(ctx);

  const setting = await prisma.setting.findUnique({
    where: {
      id: 1,
    },
  });

  if (!setting)
    return {
      ...initialProps,
      dataTheme: 'dark',
    };

  let dataTheme = setting.lightTheme;

  if (setting.defaultTheme === 'dark') dataTheme = setting.darkTheme;

  return {
    ...initialProps,
    dataTheme,
  };
};
