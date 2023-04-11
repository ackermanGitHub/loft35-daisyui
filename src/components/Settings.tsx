import ChangeTheme from './ChangeTheme';
import { useCookies } from 'react-cookie';

const SettingsOptions = () => {
  const [cookies, setCookie] = useCookies([
    'color-theme',
    'light-theme',
    'dark-theme',
  ]);

  return (
    <div className="flex overflow-visible static justify-around items-center max-md:justify-between">
      <input type="checkbox" id="setting-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box overflow-visible h-[50vh]">
          <div className="flex h-full flex-col justify-between">
            <div className="flex flex-row justify-around">
              <div>
                <h2>light theme</h2>
                <ChangeTheme
                  currentTheme={cookies['light-theme']}
                  onChangeFn={(theme) => {
                    setCookie('light-theme', theme);
                  }}
                />
              </div>
              <div>
                <h2>dark theme</h2>
                <ChangeTheme
                  currentTheme={cookies['dark-theme']}
                  onChangeFn={(theme) => {
                    setCookie('dark-theme', theme);
                  }}
                />
              </div>
            </div>
            <div className="modal-action">
              <label htmlFor="setting-modal" className="btn">
                Ok!
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsOptions;
