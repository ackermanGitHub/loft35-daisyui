import ChangeTheme from './ChangeTheme';
import { useCookies } from 'react-cookie';

const SettingsOptions = () => {
  const [_cookies, setCookie] = useCookies([
    'color-theme',
    'light-theme',
    'dark-theme',
  ]);

  return (
    <div className="flex overflow-visible static justify-around items-center max-md:justify-between">
      <input type="checkbox" id="setting-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box overflow-visible h-[50vh]">
          <ChangeTheme
            onChangeFn={(theme) => {
              setCookie('light-theme', theme);
            }}
          />
          <ChangeTheme
            onChangeFn={(theme) => {
              setCookie('dark-theme', theme);
            }}
          />
          <div className="modal-action">
            <label htmlFor="setting-modal" className="btn">
              Ok!
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsOptions;
