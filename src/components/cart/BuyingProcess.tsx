// import { useState } from 'react';

const BuyingProcess = () => {
    // const [currentStep, setCurrentStep] = useState('Theme');

    return (
        <>
            {/* Screen for buying the products on the cart  */}
            < input type="checkbox" id="buy-modal" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box flex flex-col justify-between content-center min-w-[300px] h-4/6 w-11/12 min max-w-5xl">
                    <ul className="steps steps-horizontal md:steps-vertical overflow-hidden">
                        <li className="step ">Iniciar Sesión</li>
                        <li className="step step-primary">Método de Pago</li>
                        <li className="step ">Pedido</li>
                        <li className="step step-primary">Recibo</li>
                    </ul>
                    <div>

                    </div>
                    <div className="modal-action w-full">
                        <label htmlFor="buy-modal" className="btn">Cerrar</label>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BuyingProcess;
