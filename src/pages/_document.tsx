import Document, {
  Html,
  Head,
  Main,
  NextScript,
  type DocumentProps,
  type DocumentContext,
} from 'next/document';
import { prisma } from '~/server/db';

interface IDocumentProps extends DocumentProps {
  dataTheme: string;
}

export default function MyDocument({ dataTheme }: IDocumentProps) {
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

MyDocument.getInitialProps = async (ctx: DocumentContext) => {
  const initialProps = await Document.getInitialProps(ctx);

  const setting = await prisma.setting.findUnique({
    where: {
      id: 1,
    },
  });

  let dataTheme = setting?.lightTheme;

  if (setting?.defaultTheme === 'dark') dataTheme = setting?.darkTheme;

  return {
    ...initialProps,
    dataTheme,
  };
};

/* 
import Document, {
  Html,
  Head,
  Main,
  NextScript,
} from 'next/document';

export default function Document() {

  return (
    <Html lang="es">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

*/
