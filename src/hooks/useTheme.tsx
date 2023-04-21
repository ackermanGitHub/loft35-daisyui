import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

export const useTheme = () => {
  const [cookies, setCookie] = useCookies([
    'color_theme',
    'light_theme',
    'dark_theme',
    'gradient_theme',
    'bg_theme',
  ]);

  const [colorTheme, setColorTheme] = useState('');
  const [lightTheme, setLightTheme] = useState('');
  const [darkTheme, setDarkTheme] = useState('');
  const [gradientTheme, setGradientTheme] = useState('');
  const [bgTheme, setBgTheme] = useState('');

  useEffect(() => {
    setColorTheme(cookies.color_theme);
  }, [cookies.color_theme]);

  useEffect(() => {
    setLightTheme(cookies.light_theme);
  }, [cookies.light_theme]);

  useEffect(() => {
    setDarkTheme(cookies.dark_theme);
  }, [cookies.dark_theme]);

  useEffect(() => {
    setGradientTheme(cookies.gradient_theme);
  }, [cookies.gradient_theme]);

  useEffect(() => {
    setBgTheme(cookies.bg_theme);
  }, [cookies.bg_theme]);

  useEffect(() => {
    const initialTheme = document
      .querySelector('html')
      ?.getAttribute('data-theme');
    const initialLightTheme = document
      .querySelector('html')
      ?.getAttribute('data-light_theme');
    const initialDarkTheme = document
      .querySelector('html')
      ?.getAttribute('data-dark_theme');
    const initialGradient = document
      .querySelector('html')
      ?.getAttribute('data-gradient_theme');
    const initialBgColor = document
      .querySelector('html')
      ?.getAttribute('data-bg_theme');

    if (!cookies.color_theme) {
      setCookie(
        'color_theme',
        initialTheme === initialLightTheme ? 'light' : 'dark',
        {
          path: '/',
        }
      );
    }
    if (!cookies.light_theme) {
      setCookie('light_theme', initialLightTheme, {
        path: '/',
      });
    }
    if (!cookies.dark_theme) {
      setCookie('dark_theme', initialDarkTheme, {
        path: '/',
      });
    }
    if (!cookies.gradient_theme) {
      setCookie('gradient_theme', initialGradient, {
        path: '/',
      });
    }
    if (!cookies.bg_theme) {
      setCookie('bg_theme', initialBgColor, {
        path: '/',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (cookies.color_theme === 'light') {
      document
        .querySelector('html')
        ?.setAttribute('data-theme', cookies.light_theme);
    } else if (cookies.color_theme === 'dark') {
      document
        .querySelector('html')
        ?.setAttribute('data-theme', cookies.dark_theme);
    }
    if (cookies.gradient_theme === 'true') {
      (document.querySelector('body') as HTMLBodyElement).className =
        'from-primary to-secondary bg-gradient-to-br';
    } else {
      (
        document.querySelector('body') as HTMLBodyElement
      ).className = `bg-${cookies.bg_theme}`;
    }
  }, [cookies]);

  const toogleColorTheme = () => {
    if (colorTheme === 'light') {
      setCookie('color_theme', 'dark', {
        path: '/',
      });
    } else if (colorTheme === 'dark') {
      setCookie('color_theme', 'light', {
        path: '/',
      });
    }
  };

  return {
    colorTheme,
    toogleColorTheme,
    lightTheme,
    darkTheme,
    gradientTheme,
    bgTheme,
  };
};
