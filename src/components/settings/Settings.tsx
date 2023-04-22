import { useState } from 'react';
import ThemeSection from './ThemeSection';
import ProductsSection from './ProductsSection';

const SettingsOptions = () => {
  const [currentSection, setCurrentSection] = useState('Theme');

  return (
    <div className="flex overflow-visible static justify-around items-center max-md:justify-between">
      <input type="checkbox" id="setting-modal" className="modal-toggle" />
      <label htmlFor="setting-modal" className="modal cursor-pointer">
        <label className="modal-box relative h-[70vh]">
          <div className="flex flex-col h-full justify-between">
            <div className="tabs">
              <button
                className={`tab tab-lifted ${
                  currentSection === 'Theme' && 'tab-active'
                }`}
                onClick={() => {
                  setCurrentSection('Theme');
                }}
              >
                Theme
              </button>
              <button
                className={`tab tab-lifted ${
                  currentSection === 'Products' && 'tab-active'
                }`}
                onClick={() => {
                  setCurrentSection('Products');
                }}
              >
                Products
              </button>
              <button
                className={`tab tab-lifted ${
                  currentSection === 'Orders' && 'tab-active'
                }`}
                onClick={() => {
                  setCurrentSection('Orders');
                }}
              >
                Orders
              </button>
            </div>
            <div className="overflow-auto">
              {currentSection === 'Theme' && <ThemeSection />}

              {currentSection === 'Products' && <ProductsSection />}
            </div>
            <div className="modal-action">
              <label htmlFor="setting-modal" className="btn">
                Cerrar
              </label>
            </div>
          </div>
        </label>
      </label>
    </div>
  );
};

export default SettingsOptions;
