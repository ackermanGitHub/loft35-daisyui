// import { useState } from 'react';

const BuyingProcess = () => {
    // const [currentStep, setCurrentStep] = useState('Theme');

    return (
        <>
            {/* Screen for buying the products on the cart  */}
            < input type="checkbox" id="buy-modal" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box h-4/6 w-11/12 max-w-5xl">
                    {/* Bottom navegations for documenting the steps */}
                    <div className="btm-nav top-0">
                        <button className="bg-pink-200 text-pink-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                            <span className="btm-nav-label">Home</span>
                        </button>
                        <button className="active bg-neutral text-neutral-content">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span className="btm-nav-label">Warnings</span>
                        </button>
                        <button className="bg-teal-200 text-teal-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                            <span className="btm-nav-label">Statics</span>
                        </button>
                    </div>

                    <h3 className="font-bold text-lg">Congratulations random Internet user!</h3>
                    <p className="py-4">You&apos;ve been selected for a chance to get one year of subscription to use Wikipedia for free!</p>
                    <div className="modal-action w-full">
                        <label htmlFor="buy-modal" className="btn">Cerrar</label>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BuyingProcess;
