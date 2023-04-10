const themes = [
  'light',
  'dark',
  'cupcake',
  'bumblebee',
  'emerald',
  'corporate',
  'synthwave',
  'retro',
  'cyberpunk',
  'valentine',
  'halloween',
  'garden',
  'forest',
  'aqua',
  'lofi',
  'pastel',
  'fantasy',
  'wireframe',
  'black',
  'luxury',
  'dracula',
  'cmyk',
  'autumn',
  'business',
  'acid',
  'lemonade',
  'night',
  'coffee',
  'winter',
];

interface IProps {
  onChangeFn: (theme: string) => void;
}

const ChangeTheme: React.FC<IProps> = ({ onChangeFn }) => {
  return (
    <div>
      <div className="dropdown">
        <label tabIndex={0} className="select select-info">
          Theme
        </label>
        <div className="dropdown-content bg-base-200 text-base-content rounded-t-box rounded-b-box top-px max-h-96 h-[70vh] w-52 overflow-y-auto shadow-2xl mt-16">
          <div className="grid grid-cols-1 gap-3 p-3" tabIndex={0}>
            {themes.map((theme, index) => (
              <button
                key={index}
                className="outline-base-content overflow-hidden rounded-lg text-left"
                data-set-theme={theme}
                onClick={() => {
                  onChangeFn(theme);
                }}
              >
                <div
                  data-theme={theme}
                  className="bg-base-100 text-base-content w-full cursor-pointer font-sans"
                >
                  <div className="grid grid-cols-5 grid-rows-3">
                    <div className="col-span-5 row-span-3 row-start-1 flex gap-2 py-3 px-4 items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-3 h-3 invisible"
                      >
                        <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"></path>
                      </svg>{' '}
                      <div className="flex-grow text-sm font-bold">{theme}</div>{' '}
                      <div className="flex flex-shrink-0 flex-wrap gap-1 h-full">
                        <div className="bg-primary w-2 rounded"></div>{' '}
                        <div className="bg-secondary w-2 rounded"></div>{' '}
                        <div className="bg-accent w-2 rounded"></div>{' '}
                        <div className="bg-neutral w-2 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeTheme;
