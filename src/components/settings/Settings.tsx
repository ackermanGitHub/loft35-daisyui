import { useState } from 'react';
import ThemeSection from './ThemeSection';
import ProductsSection from './ProductsSection';

const SettingsOptions = () => {
  const [currentSection, setCurrentSection] = useState('Theme');

  return (
    <div className="flex overflow-visible static justify-around items-center max-md:justify-between">
      <input type="checkbox" id="setting-modal" className="modal-toggle" />
      <div className="modal overflow-hidden">
        <div className="modal-box overflow-visible h-[70vh]">
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
            {currentSection === 'Theme' && <ThemeSection />}

            {currentSection === 'Products' && <ProductsSection />}
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
