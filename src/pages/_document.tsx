// import { type Setting } from '@prisma/client';
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  type DocumentProps,
  type DocumentContext,
} from 'next/document';
import { prisma } from '~/server/db';
// import { redis } from '~/utils/redis';

interface IDocumentProps extends DocumentProps {
  dataTheme: string;
  lightTheme: string;
  darkTheme: string;
  gradientTheme: string;
  bgColorTheme: string;
}

export default function MyDocument({
  dataTheme,
  lightTheme,
  darkTheme,
  gradientTheme,
  bgColorTheme,
}: IDocumentProps) {

  return (
    <Html
      data-theme={dataTheme === 'light' ? lightTheme : darkTheme}
      data-light_theme={lightTheme}
      data-dark_theme={darkTheme}
      data-gradient_theme={gradientTheme}
      data-bg_theme={bgColorTheme}
      lang="es"
    >
      <Head />
      <body
        // TODO add white/black background
        className={`${gradientTheme === 'true'
          ? 'from-primary to-secondary bg-gradient-to-br'
          : 'bg-' + bgColorTheme
          }`}
      >
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
    ?.find((cookie) => cookie.includes('color_theme'))
    ?.split('=')[1];
  const defalutLightThemeCookie = themeCookies
    ?.find((cookie) => cookie.includes('light_theme'))
    ?.split('=')[1];
  const defalutDarkThemeCookie = themeCookies
    ?.find((cookie) => cookie.includes('dark_theme'))
    ?.split('=')[1];
  const gradientThemeCookie = themeCookies
    ?.find((cookie) => cookie.includes('gradient_theme'))
    ?.split('=')[1];
  const bgColorThemeCookie = themeCookies
    ?.find((cookie) => cookie.includes('bg_theme'))
    ?.split('=')[1];


  if (
    defalutThemeCookie &&
    defalutLightThemeCookie &&
    defalutDarkThemeCookie &&
    gradientThemeCookie &&
    bgColorThemeCookie
  ) {
    return {
      ...initialProps,
      dataTheme: defalutThemeCookie,
      lightTheme: defalutLightThemeCookie,
      darkTheme: defalutDarkThemeCookie,
      gradientTheme: gradientThemeCookie,
      bgColorTheme: bgColorThemeCookie,
    };
  }

  //const cachedSetting: Setting | null = await redis.get('global-setting');

  /// if (cachedSetting) {
  ///   return {
  ///     ...initialProps,
  ///     dataTheme: cachedSetting?.defaultTheme,
  ///     lightTheme: cachedSetting?.lightTheme,
  ///     darkTheme: cachedSetting?.darkTheme,
  ///     gradientTheme: cachedSetting?.gradientTheme,
  ///     bgColorTheme: cachedSetting?.bgColor,
  ///   };
  /// }

  const globalSetting = await prisma.setting.findUnique({
    where: {
      id: 1,
    },
  });

  // await redis.set('global-setting', globalSetting);

  return {
    ...initialProps,
    dataTheme: globalSetting?.defaultTheme,
    lightTheme: globalSetting?.lightTheme,
    darkTheme: globalSetting?.darkTheme,
    gradientTheme: globalSetting?.gradientTheme,

    bgColorTheme: globalSetting?.bgColor,
  };
};
