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
  defaultTheme: string;
  lightTheme: string;
  darkTheme: string;
}

export default function MyDocument({
  dataTheme,
  lightTheme,
  darkTheme,
}: IDocumentProps) {
  return (
    <Html
      data-theme={dataTheme}
      data-light-theme={lightTheme}
      data-dark-theme={darkTheme}
      lang="es"
    >
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

  const userCookies = ctx.req?.headers.cookie;

  const userCookiesArr = userCookies?.split(' ');

  const themeCookies = userCookiesArr
    ?.filter((cookie) => cookie.includes('theme'))
    .map((cookie) => cookie.replace(';', ''));

  const defalutThemeCookie = themeCookies
    ?.find((cookie) => cookie.includes('color'))
    ?.split('=')[1];
  const defalutLightThemeCookie = themeCookies
    ?.find((cookie) => cookie.includes('light'))
    ?.split('=')[1];
  const defalutDarkThemeCookie = themeCookies
    ?.find((cookie) => cookie.includes('dark'))
    ?.split('=')[1];

  if (defalutThemeCookie && defalutLightThemeCookie && defalutDarkThemeCookie) {
    return {
      ...initialProps,
      dataTheme:
        defalutThemeCookie === 'light'
          ? defalutLightThemeCookie
          : defalutDarkThemeCookie,
      lightTheme: defalutLightThemeCookie,
      darkTheme: defalutDarkThemeCookie,
    };
  }

  const setting = await prisma.setting.findUnique({
    where: {
      id: 1,
    },
  });

  return {
    ...initialProps,
    dataTheme:
      setting?.defaultTheme === 'light'
        ? setting?.lightTheme
        : setting?.darkTheme,
    lightTheme: setting?.lightTheme,
    darkTheme: setting?.darkTheme,
  };
};
