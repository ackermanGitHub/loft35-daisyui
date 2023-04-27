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
        if (session) {
            setCurrentStep('Payment');
        }
    }, [currentStep, session])

    return (
        <>
            {/* Screen for buying the products on the cart  */}
            < input type="checkbox" id="buy-modal" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box flex flex-col justify-between content-center min-w-[300px] h-4/6 w-11/12 min max-w-5xl">
                    <ul className="steps steps-horizontal md:steps-vertical overflow-hidden">
                        <li className={`step ${session.status === "authenticated" ? "step-primary" : ""}`}>Sesión</li>
                        <li className="step step-primary">Pago</li>
                        <li className="step ">Pedido</li>
                        <li className="step step-primary">Recibo</li>
                    </ul>
                    <div>
                        {providers && currentStep === "Session" && Object.values(providers).map((provider) => (
                            <div key={provider.name}>
                                <button onClick={() => void signIn(provider.id, {
                                    callbackUrl: "/test"
                                })}>
                                    Sign in with {provider.name}
                                </button>
                            </div>
                        ))}
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
