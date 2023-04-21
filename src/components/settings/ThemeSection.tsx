import { useCookies } from 'react-cookie';
import ChangeTheme from './ChangeTheme';

const ThemeSection = () => {
  const [cookies, setCookie] = useCookies([
    'color_theme',
    'light_theme',
    'dark_theme',
    'gradient_theme',
    'bg_theme',
  ]);

  return (
    <div className="flex flex-col overflow-visible items-center justify-evenly">
      <div className="w-full mt-4">
        <h1 className="mb-2 font-medium">Configuración Personal: </h1>

        <div className="flex flex-col">
          <div className="flex flex-row mb-5 justify-center">
            <h1 className="mr-2">Tema Por Defecto: </h1>
            <label className="swap swap-rotate">
              <input
                checked={cookies.color_theme === 'light'}
                onChange={() => {
                  if (cookies.color_theme === 'light') {
                    setCookie('color_theme', 'dark', {
                      path: '/',
                    });
                  } else if (cookies.color_theme === 'dark') {
                    setCookie('color_theme', 'light', {
                      path: '/',
                    });
                  }
                }}
                type="checkbox"
              />

              <svg
                className="swap-on fill-current w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
              </svg>

              <svg
                className="swap-off fill-current w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
              </svg>
            </label>
          </div>
          <div className="flex w-full flex-row flex-wrap items-center justify-around">
            <div className="mx-2">
              <h1>Modo Claro: </h1>
              <ChangeTheme
                isEnabled
                dropdownPos="dropdown-start"
                currentTheme={cookies.light_theme}
                onChangeFn={(theme) => {
                  setCookie('light_theme', theme, {
                    path: '/',
                  });
                }}
              />
            </div>
            <div className="mx-2">
              <h2>Modo Oscuro: </h2>
              <ChangeTheme
                isEnabled
                dropdownPos="dropdown-end"
                currentTheme={cookies.dark_theme}
                onChangeFn={(theme) => {
                  setCookie('dark_theme', theme, {
                    path: '/',
                  });
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center w-full my-5 justify-around">
        <div className="flex flex-row mx-1">
          <h1 className="mr-2">Gradiente: </h1>
          <input
            type="checkbox"
            checked={cookies.gradient_theme === 'true'}
            onChange={() => {
              setCookie(
                'gradient_theme',
                cookies.gradient_theme === 'true' ? 'false' : 'true',
                {
                  path: '/',
                }
              );
            }}
            className="checkbox"
          />
        </div>
        <div className="flex flex-row mx-1">
          <select
            onChange={(e) => {
              setCookie('bg_theme', e.target.value, {
                path: '/',
              });
            }}
            value={cookies.bg_theme}
            className="select select-bordered"
            disabled={cookies.gradient_theme === 'true'}
          >
            <option value={'primary'}>Primario</option>
            <option value={'secondary'}>Secundario</option>
            <option value={'black&white'}>Blanco/Negro</option>
          </select>
        </div>
      </div>
      <div className="divider">
        Usar la Misma
        <input
          checked={true}
          onChange={() => {
            // setIsSameConfig(!isSameConfig);
          }}
          type="checkbox"
          className="checkbox"
        />
      </div>
      <div className={`w-full ${true ? 'opacity-50' : ''}`}>
        <h1 className="mb-2 font-medium">Configuración del Ciente: </h1>
        <div className="flex flex-row justify-center my-1">
          <h1 className="mr-2">Tema Por Defecto: </h1>
          <label className="swap swap-rotate">
            <input type="checkbox" disabled={true} />

            <svg
              className="swap-on fill-current w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
            </svg>

            <svg
              className="swap-off fill-current w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
            </svg>
          </label>
        </div>
        <div className="flex w-full flex-row items-center justify-around">
          <div>
            <h1>Modo Claro: </h1>
            <ChangeTheme
              dropdownPos="dropdown-top"
              isEnabled={false}
              currentTheme={cookies.light_theme}
              onChangeFn={(theme) => {
                console.log(theme);
              }}
            />
          </div>
          <div>
            <h2>Modo Oscuro: </h2>
            <ChangeTheme
              dropdownPos="dropdown-end dropdown-top"
              isEnabled={false}
              currentTheme={cookies.dark_theme}
              onChangeFn={(theme) => {
                console.log(theme);
              }}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-wrap w-full my-5 justify-evenly opacity-50">
        <div className="flex flex-row mx-1">
          <h1 className="mr-2">Gradiente: </h1>
          <input type="checkbox" disabled className="checkbox" />
        </div>
        <div className="flex flex-row mx-1">
          <h1 className="mr-2">Fondo blanco/negro: </h1>
          <input type="checkbox" disabled className="checkbox" />
        </div>
      </div>
    </div>
  );
};

export default ThemeSection;
