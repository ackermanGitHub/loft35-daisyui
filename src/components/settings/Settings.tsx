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
            <h1>color themes</h1>
            <div className="flex flex-row justify-around">
              <div>
                <h2>light theme</h2>
                <ChangeTheme
                  borderEnabled={true}
                  currentTheme={cookies['light-theme']}
                  onChangeFn={(theme) => {
                    setCookie('light-theme', theme);
                  }}
                />
              </div>
              <div>
                <h2>dark theme</h2>
                <ChangeTheme
                  borderEnabled={true}
                  currentTheme={cookies['dark-theme']}
                  onChangeFn={(theme) => {
                    setCookie('dark-theme', theme);
                  }}
                />
              </div>
            </div>
            <div className="divider" />
            <h1>products</h1>
            <div className="flex flex-row">
              <svg
                fill="currentColor"
                width={18}
                height={18}
                viewBox="0 0 16 16"
              >
                <path d="M2.39697 14.4634H13.5964C15.0532 14.4634 15.8311 13.6921 15.8311 12.2485V4.24609C15.8311 2.80249 15.0532 2.03125 13.5964 2.03125H2.39697C0.940186 2.03125 0.162354 2.7959 0.162354 4.24609V12.2485C0.162354 13.6987 0.940186 14.4634 2.39697 14.4634ZM1.63232 4.39771C1.63232 3.79126 1.94214 3.50122 2.52222 3.50122H7.28809V5.74243H1.63232V4.39771ZM13.4712 3.50122C14.0447 3.50122 14.3611 3.79126 14.3611 4.39771V5.74243H8.70532V3.50122H13.4712ZM1.63232 9.3811V7.10693H7.28809V9.3811H1.63232ZM8.70532 9.3811V7.10693H14.3611V9.3811H8.70532ZM2.52222 12.9934C1.94214 12.9934 1.63232 12.7034 1.63232 12.0969V10.7522H7.28809V12.9934H2.52222ZM14.3611 12.0969C14.3611 12.7034 14.0447 12.9934 13.4712 12.9934H8.70532V10.7522H14.3611V12.0969Z"></path>
              </svg>
              <input type="checkbox" className="toggle" />
              <svg
                fill="currentColor"
                width={18}
                height={18}
                viewBox="0 0 16 16"
              >
                <path d="M2.0542 7.75952H5.96973C7.00464 7.75952 7.50562 7.25854 7.50562 6.19727V3.58691C7.50562 2.53223 7.00464 2.03125 5.96973 2.03125H2.0542C1.01929 2.03125 0.518311 2.53223 0.518311 3.58691V6.19727C0.518311 7.25854 1.01929 7.75952 2.0542 7.75952ZM10.0303 7.75952H13.9392C14.9741 7.75952 15.4751 7.25854 15.4751 6.19727V3.58691C15.4751 2.53223 14.9741 2.03125 13.9392 2.03125H10.0303C8.98877 2.03125 8.48779 2.53223 8.48779 3.58691V6.19727C8.48779 7.25854 8.98877 7.75952 10.0303 7.75952ZM2.06079 6.55322C1.83008 6.55322 1.71802 6.44116 1.71802 6.20386V3.58032C1.71802 3.34961 1.83008 3.23755 2.06079 3.23755H5.96313C6.18726 3.23755 6.30591 3.34961 6.30591 3.58032V6.20386C6.30591 6.44116 6.18726 6.55322 5.96313 6.55322H2.06079ZM10.0369 6.55322C9.79956 6.55322 9.69409 6.44116 9.69409 6.20386V3.58032C9.69409 3.34961 9.79956 3.23755 10.0369 3.23755H13.9392C14.1633 3.23755 14.2754 3.34961 14.2754 3.58032V6.20386C14.2754 6.44116 14.1633 6.55322 13.9392 6.55322H10.0369ZM2.0542 14.4634H5.96973C7.00464 14.4634 7.50562 13.969 7.50562 12.9077V10.2974C7.50562 9.24268 7.00464 8.7417 5.96973 8.7417H2.0542C1.01929 8.7417 0.518311 9.24268 0.518311 10.2974V12.9077C0.518311 13.969 1.01929 14.4634 2.0542 14.4634ZM10.0303 14.4634H13.9392C14.9741 14.4634 15.4751 13.969 15.4751 12.9077V10.2974C15.4751 9.24268 14.9741 8.7417 13.9392 8.7417H10.0303C8.98877 8.7417 8.48779 9.24268 8.48779 10.2974V12.9077C8.48779 13.969 8.98877 14.4634 10.0303 14.4634ZM2.06079 13.2637C1.83008 13.2637 1.71802 13.1516 1.71802 12.9143V10.2974C1.71802 10.0601 1.83008 9.94141 2.06079 9.94141H5.96313C6.18726 9.94141 6.30591 10.0601 6.30591 10.2974V12.9143C6.30591 13.1516 6.18726 13.2637 5.96313 13.2637H2.06079ZM10.0369 13.2637C9.79956 13.2637 9.69409 13.1516 9.69409 12.9143V10.2974C9.69409 10.0601 9.79956 9.94141 10.0369 9.94141H13.9392C14.1633 9.94141 14.2754 10.0601 14.2754 10.2974V12.9143C14.2754 13.1516 14.1633 13.2637 13.9392 13.2637H10.0369Z"></path>
              </svg>
            </div>

            <p>
              Activa esta función para ver los productos en forma de tarjetas,
              similar a como lo ven los clientes
            </p>
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
