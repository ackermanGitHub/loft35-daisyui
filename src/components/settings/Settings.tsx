import { useState } from 'react';
import ThemeSection from './ThemeSection';
import ProductsSection from './ProductsSection';

const SettingsOptions = () => {
  const [currentSection, setCurrentSection] = useState('Theme');

  return (
    <div className="flex static justify-around items-center max-md:justify-between">
      <input type="checkbox" id="setting-modal" className="modal-toggle" />
      <label htmlFor="setting-modal" className="modal cursor-pointer">
        <label className="modal-box relative">
          <label
            htmlFor="setting-modal"
            className="absolute top-4 right-4 max-[335px]:hidden max-[350px]:right-0 max-[400px]:scale-75 btn btn-ghost cursor-pointer rounded-full">
            <svg fill="none" viewBox="0 0 24 24" width={18} height={18} stroke='currentColor'>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </label>
          <div className="flex flex-wrap items-end h-8">
            <button
              className={`tab tab-lifted ${currentSection === 'Theme' && 'tab-active'
                }`}
              onClick={() => {
                setCurrentSection('Theme');
              }}
            >
              Theme
            </button>
            <button
              className={`tab tab-lifted ${currentSection === 'Products' && 'tab-active'
                }`}
              onClick={() => {
                setCurrentSection('Products');
              }}
            >
              Products
            </button>
            <button
              className={`tab tab-lifted ${currentSection === 'Orders' && 'tab-active'
                }`}
              onClick={() => {
                setCurrentSection('Orders');
              }}
            >
              Orders
            </button>
          </div>
          <div className="flex flex-col items-center w-auto h-[60vh] overflow-x-hidden overflow-y-auto">
            {currentSection === 'Theme' && <ThemeSection />}
            {currentSection === 'Products' && <ProductsSection />}
          </div>
          <div className="modal-action">
            <label htmlFor="setting-modal" className="btn">
              Cerrar
            </label>
          </div>
        </label>
      </label>
    </div>
  );
};

export default SettingsOptions;
