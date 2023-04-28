import { type BuiltInProviderType } from "next-auth/providers";
import { type ClientSafeProvider, type LiteralUnion, getProviders, signIn, useSession } from "next-auth/react"
import { useState, useEffect } from "react";

// steps
type Step = "Session" | "Payment" | "Order" | "Confirm";

const BuyingProcess = () => {
    const [providers, setProviders] = useState<Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null>()
    const [currentStep, setCurrentStep] = useState<Step>('Session');
    const session = useSession();

    useEffect(() => {
        void (async () => {
            setProviders(await getProviders())
        })()

        if (session.status === "authenticated") {
            setCurrentStep('Payment');
        } else {
            setCurrentStep('Session');
        }

    }, [currentStep, session])

    return (
        <>
            {/* Screen for buying the products on the cart  */}
            < input type="checkbox" id="buy-modal" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box min-w-[300px] w-11/12 max-w-5xl">
                    <div className="flex flex-col justify-between items-center md:flex-row">
                        <ul className="steps steps-horizontal md:steps-vertical overflow-hidden">
                            <li className="step step-primary">Sesión</li>
                            <li className={`step ${session.status === "authenticated" ? "step-primary" : ""}`}>Pago</li>
                            <li className="step ">Pedido</li>
                            <li className="step ">Recibo</li>
                        </ul>

                        <div className="flex items-center justify-evenly flex-col h-80">
                            {providers && currentStep === "Session" && Object.values(providers).map((provider) => (
                                <div key={provider.name}>
                                    <button className={`btn border-none btn-primary gap-2 ${provider.id === "google" ? "bg-[#fff]" : "bg-[#7289DA]"}`} onClick={() => void signIn(provider.id, {
                                        callbackUrl: "/test"
                                    })}>
                                        {provider.id === "google" &&
                                            <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <title>Google icon</title>
                                                <path fill="#EA4335 " d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z" />
                                                <path fill="#34A853" d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z" />
                                                <path fill="#4A90E2" d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z" />
                                                <path fill="#FBBC05" d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z" />
                                            </svg>
                                        }
                                        {provider.id === "discord" &&
                                            <svg width="18" height="18" viewBox="0 0 256 293" preserveAspectRatio="xMidYMid">
                                                <path fill="#fff" d="M226.011 0H29.99C13.459 0 0 13.458 0 30.135v197.778c0 16.677 13.458 30.135 29.989 30.135h165.888l-7.754-27.063 18.725 17.408 17.7 16.384L256 292.571V30.135C256 13.458 242.542 0 226.011 0zm-56.466 191.05s-5.266-6.291-9.655-11.85c19.164-5.413 26.478-17.408 26.478-17.408-5.998 3.95-11.703 6.73-16.823 8.63-7.314 3.073-14.336 5.12-21.211 6.291-14.044 2.633-26.917 1.902-37.888-.146-8.339-1.61-15.507-3.95-21.504-6.29-3.365-1.317-7.022-2.926-10.68-4.974-.438-.293-.877-.439-1.316-.732-.292-.146-.439-.292-.585-.438-2.633-1.463-4.096-2.487-4.096-2.487s7.022 11.703 25.6 17.261c-4.388 5.56-9.801 12.142-9.801 12.142-32.33-1.024-44.617-22.235-44.617-22.235 0-47.104 21.065-85.285 21.065-85.285 21.065-15.799 41.106-15.36 41.106-15.36l1.463 1.756C80.75 77.53 68.608 89.088 68.608 89.088s3.218-1.755 8.63-4.242c15.653-6.876 28.088-8.777 33.208-9.216.877-.147 1.609-.293 2.487-.293a123.776 123.776 0 0 1 29.55-.292c13.896 1.609 28.818 5.705 44.031 14.043 0 0-11.556-10.971-36.425-18.578l2.048-2.34s20.041-.44 41.106 15.36c0 0 21.066 38.18 21.066 85.284 0 0-12.435 21.211-44.764 22.235zm-68.023-68.316c-8.338 0-14.92 7.314-14.92 16.237 0 8.924 6.728 16.238 14.92 16.238 8.339 0 14.921-7.314 14.921-16.238.147-8.923-6.582-16.237-14.92-16.237m53.394 0c-8.339 0-14.922 7.314-14.922 16.237 0 8.924 6.73 16.238 14.922 16.238 8.338 0 14.92-7.314 14.92-16.238 0-8.923-6.582-16.237-14.92-16.237" />
                                            </svg>
                                        }
                                        Inicia sessión con {provider.name}
                                    </button>
                                </div>
                            ))}
                        </div>
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
