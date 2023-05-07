import { type BuiltInProviderType } from "next-auth/providers";
import { type ClientSafeProvider, type LiteralUnion, getProviders, signIn, useSession } from "next-auth/react"
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useForm, type SubmitHandler } from 'react-hook-form';
// import { api } from "~/utils/api";
import { useCart } from "./ShoppingCart";

interface FormValues {
    address: string;
    city: string;
    phone: string;
}

const phoneRegex = /^[5][0-9]{7}$/;

// steps
type Step = "Session" | "Order" | "Confirm";
const steps: Step[] = ["Session", "Order", "Confirm"];

const BuyingProcess = () => {
    const [providers, setProviders] = useState<Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null>()
    const [currentStep, setCurrentStep] = useState<Step>('Session');
    // const [orderWay, setOrderWay] = useState<"whatsapp" | "online">();
    const session = useSession();
    const router = useRouter();

    const { cart } = useCart()

    // const createOrder = api.order.create.useMutation();

    const {
        handleSubmit,
        register,
        formState: { errors },
        getValues,
        // reset,
        // setError,
        // setValue,
        // clearErrors,
        // resetField,
    } = useForm<FormValues>();

    const submitHandler: SubmitHandler<FormValues> = (data) => {
        if (currentStep === "Order") {
            setCurrentStep("Confirm");
            console.log("submitHandler")
            return;
        }
        console.log("submitHandler", data)
        return
    }

    useEffect(() => {
        const { query } = router;
        if (query["buyingprocess"] && query["buyingprocess"] === "true") {
            const buyModal = document.querySelector<HTMLInputElement>("#buy-modal");
            const cartModal = document.querySelector<HTMLInputElement>("#cart-modal");
            if (buyModal && cartModal) {
                buyModal.checked = true
                cartModal.checked = true
            }
            void router.replace(router.pathname);
        }
    }, [router])

    useEffect(() => {
        void (async () => {
            setProviders(await getProviders())
        })()

        if (session.status === "authenticated" && currentStep === "Session") {
            setCurrentStep('Order');
        }
        if (session.status !== "authenticated") {
            setCurrentStep('Session');
        }

    }, [currentStep, session])

    return (
        <>
            <input type="checkbox" id="buy-modal" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box flex flex-col h-[80%] overflow-visible relative min-w-[300px] max-w-[500px]  min-h-[500px] max-h-[800px] w-11/12">
                    <div className="flex flex-col items-center h-full">
                        <div className="flex flex-row gap-4">
                            {/* 🧑‍🚀📨📭📦💵🗒️🚹🧑💲 */}
                            <ul className="steps steps-horizontal max-[400px]:scale-90 ">
                                <li data-content="🧑‍🚀" className="step step-primary">Sesión</li>
                                <li data-content="📦" className={`step ${steps.indexOf(currentStep) >= steps.indexOf("Order") ? "step-primary" : ""}`}>Pedido</li>
                                <li data-content="💲" className={`step ${steps.indexOf(currentStep) >= steps.indexOf("Confirm") ? "step-primary" : ""}`}>Recibo</li>
                            </ul>
                            <label
                                htmlFor="buy-modal"
                                className="absolute top-7 right-7 max-[400px]:top-4 max-[400px]:right-4 max-[400px]:scale-90 btn btn-ghost cursor-pointer rounded-full">
                                <svg fill="none" viewBox="0 0 24 24" width={18} height={18} stroke='currentColor'>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </label>
                        </div>
                        <div className="flex items-center justify-evenly flex-col w-full h-full">
                            {providers && currentStep === "Session" &&
                                <>
                                    <h1 className="w-2/3 text-center font-medium text-md"> Primero inicia sesión para que podamos saber quien eres 🧙‍♂️ </h1>
                                    {Object.values(providers).map((provider) => (
                                        <button key={provider.name} className={`btn border-none btn-primary gap-2 ${provider.id === "google" ? "bg-[#fff]" : "bg-[#7289DA]"}`} onClick={() => void signIn(provider.id, {
                                            callbackUrl: `${router.pathname}?buyingprocess=true`,
                                        })}>
                                            {provider.id === "google" &&
                                                <svg width={20} height={20} viewBox="0 0 24 24">
                                                    <title>Google icon</title>
                                                    <path fill="#EA4335 " d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z" />
                                                    <path fill="#34A853" d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z" />
                                                    <path fill="#4A90E2" d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z" />
                                                    <path fill="#FBBC05" d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z" />
                                                </svg>
                                            }
                                            {provider.id === "discord" &&
                                                <svg width={20} height={20} viewBox="0 0 256 293" preserveAspectRatio="xMidYMid">
                                                    <path fill="#fff" d="M226.011 0H29.99C13.459 0 0 13.458 0 30.135v197.778c0 16.677 13.458 30.135 29.989 30.135h165.888l-7.754-27.063 18.725 17.408 17.7 16.384L256 292.571V30.135C256 13.458 242.542 0 226.011 0zm-56.466 191.05s-5.266-6.291-9.655-11.85c19.164-5.413 26.478-17.408 26.478-17.408-5.998 3.95-11.703 6.73-16.823 8.63-7.314 3.073-14.336 5.12-21.211 6.291-14.044 2.633-26.917 1.902-37.888-.146-8.339-1.61-15.507-3.95-21.504-6.29-3.365-1.317-7.022-2.926-10.68-4.974-.438-.293-.877-.439-1.316-.732-.292-.146-.439-.292-.585-.438-2.633-1.463-4.096-2.487-4.096-2.487s7.022 11.703 25.6 17.261c-4.388 5.56-9.801 12.142-9.801 12.142-32.33-1.024-44.617-22.235-44.617-22.235 0-47.104 21.065-85.285 21.065-85.285 21.065-15.799 41.106-15.36 41.106-15.36l1.463 1.756C80.75 77.53 68.608 89.088 68.608 89.088s3.218-1.755 8.63-4.242c15.653-6.876 28.088-8.777 33.208-9.216.877-.147 1.609-.293 2.487-.293a123.776 123.776 0 0 1 29.55-.292c13.896 1.609 28.818 5.705 44.031 14.043 0 0-11.556-10.971-36.425-18.578l2.048-2.34s20.041-.44 41.106 15.36c0 0 21.066 38.18 21.066 85.284 0 0-12.435 21.211-44.764 22.235zm-68.023-68.316c-8.338 0-14.92 7.314-14.92 16.237 0 8.924 6.728 16.238 14.92 16.238 8.339 0 14.921-7.314 14.921-16.238.147-8.923-6.582-16.237-14.92-16.237m53.394 0c-8.339 0-14.922 7.314-14.922 16.237 0 8.924 6.73 16.238 14.922 16.238 8.338 0 14.92-7.314 14.92-16.238 0-8.923-6.582-16.237-14.92-16.237" />
                                                </svg>
                                            }
                                            Inicia sessión con {provider.name}
                                        </button>
                                    ))}
                                </>
                            }
                            {currentStep === "Order" &&
                                <form
                                    // eslint-disable-next-line @typescript-eslint/no-misused-promises
                                    onSubmit={handleSubmit(submitHandler)}
                                    id="shipping-info"
                                    className="flex h-full items-center flex-col w-full"
                                >
                                    <h1 className="w-2/3 text-center font-medium text-md"> Rellene el formulario con la información de envío para completar su pedido 😊 </h1>
                                    <button onClick={() => {
                                        console.log("WhatsApp")
                                    }} className="btn btn-sm btn-primary absolute bottom-8 left-5 border-none gap-2 max-[330px]:hidden">
                                        <svg viewBox="0 0 48 48" width={20} height={20} fillRule="evenodd" clipRule="evenodd"><path fill="#fff" d="M4.9,43.3l2.7-9.8C5.9,30.6,5,27.3,5,24C5,13.5,13.5,5,24,5c5.1,0,9.8,2,13.4,5.6	C41,14.2,43,18.9,43,24c0,10.5-8.5,19-19,19c0,0,0,0,0,0h0c-3.2,0-6.3-0.8-9.1-2.3L4.9,43.3z" /><path fill="#fff" d="M4.9,43.8c-0.1,0-0.3-0.1-0.4-0.1c-0.1-0.1-0.2-0.3-0.1-0.5L7,33.5c-1.6-2.9-2.5-6.2-2.5-9.6	C4.5,13.2,13.3,4.5,24,4.5c5.2,0,10.1,2,13.8,5.7c3.7,3.7,5.7,8.6,5.7,13.8c0,10.7-8.7,19.5-19.5,19.5c-3.2,0-6.3-0.8-9.1-2.3	L5,43.8C5,43.8,4.9,43.8,4.9,43.8z" /><path fill="#cfd8dc" d="M24,5c5.1,0,9.8,2,13.4,5.6C41,14.2,43,18.9,43,24c0,10.5-8.5,19-19,19h0c-3.2,0-6.3-0.8-9.1-2.3	L4.9,43.3l2.7-9.8C5.9,30.6,5,27.3,5,24C5,13.5,13.5,5,24,5 M24,43L24,43L24,43 M24,43L24,43L24,43 M24,4L24,4C13,4,4,13,4,24	c0,3.4,0.8,6.7,2.5,9.6L3.9,43c-0.1,0.3,0,0.7,0.3,1c0.2,0.2,0.4,0.3,0.7,0.3c0.1,0,0.2,0,0.3,0l9.7-2.5c2.8,1.5,6,2.2,9.2,2.2	c11,0,20-9,20-20c0-5.3-2.1-10.4-5.8-14.1C34.4,6.1,29.4,4,24,4L24,4z" /><path fill="#40c351" d="M35.2,12.8c-3-3-6.9-4.6-11.2-4.6C15.3,8.2,8.2,15.3,8.2,24c0,3,0.8,5.9,2.4,8.4L11,33l-1.6,5.8	l6-1.6l0.6,0.3c2.4,1.4,5.2,2.2,8,2.2h0c8.7,0,15.8-7.1,15.8-15.8C39.8,19.8,38.2,15.8,35.2,12.8z" /><path fill="#fff" fillRule="evenodd" d="M19.3,16c-0.4-0.8-0.7-0.8-1.1-0.8c-0.3,0-0.6,0-0.9,0	s-0.8,0.1-1.3,0.6c-0.4,0.5-1.7,1.6-1.7,4s1.7,4.6,1.9,4.9s3.3,5.3,8.1,7.2c4,1.6,4.8,1.3,5.7,1.2c0.9-0.1,2.8-1.1,3.2-2.3	c0.4-1.1,0.4-2.1,0.3-2.3c-0.1-0.2-0.4-0.3-0.9-0.6s-2.8-1.4-3.2-1.5c-0.4-0.2-0.8-0.2-1.1,0.2c-0.3,0.5-1.2,1.5-1.5,1.9	c-0.3,0.3-0.6,0.4-1,0.1c-0.5-0.2-2-0.7-3.8-2.4c-1.4-1.3-2.4-2.8-2.6-3.3c-0.3-0.5,0-0.7,0.2-1c0.2-0.2,0.5-0.6,0.7-0.8	c0.2-0.3,0.3-0.5,0.5-0.8c0.2-0.3,0.1-0.6,0-0.8C20.6,19.3,19.7,17,19.3,16z" clipRule="evenodd" /></svg>

                                    </button>
                                    <div className="flex flex-col justify-center overflow-y-auto h-full w-full items-center">
                                        <div className="max-w-[240px] flex flex-col">
                                            <h2 className="text-md">
                                                Dirección:
                                            </h2>
                                            <textarea placeholder="Dirección"
                                                {...register('address', { required: "Obligatorio" })}
                                                className="textarea textarea-primary  max-h-20 w-full"></textarea>
                                            {errors.address ? (
                                                <div className="badge-warning badge my-[2px] gap-2">
                                                    <svg
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        className="inline-block h-4 w-4 stroke-current"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M6 18L18 6M6 6l12 12"
                                                        ></path>
                                                    </svg>
                                                    {errors.address.message}
                                                </div>
                                            ) : (
                                                <div className="h-6"></div>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap w-full justify-evenly" >
                                            <div className="max-w-[140px] flex flex-col">
                                                <h2 className="text-md">
                                                    Municipio:
                                                </h2>
                                                <input
                                                    type="text"
                                                    placeholder="Municipio"
                                                    {...register('city', { required: "Obligatorio" })}
                                                    className="input input-primary input-bordered"
                                                />
                                                {errors.city ? (
                                                    <div className="badge-warning badge my-[2px] gap-2">
                                                        <svg
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            className="inline-block h-4 w-4 stroke-current"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                                d="M6 18L18 6M6 6l12 12"
                                                            ></path>
                                                        </svg>
                                                        {errors.city.message}
                                                    </div>
                                                ) : (
                                                    <div className="h-6"></div>
                                                )}
                                            </div>
                                            <div className="max-w-[140px] flex flex-col">
                                                <h2 className="text-md">
                                                    Teléfono (Móvil):
                                                </h2>
                                                <input
                                                    type="number"
                                                    placeholder="Móvil"
                                                    {...register('phone', { required: "Obligatorio", pattern: phoneRegex, maxLength: 8, minLength: 8 })}
                                                    className="input input-primary input-bordered"
                                                />
                                                {errors.phone ? (
                                                    <div className="badge-warning badge my-[2px] gap-2">
                                                        <svg
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            className="inline-block h-4 w-4 stroke-current"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                                d="M6 18L18 6M6 6l12 12"
                                                            ></path>
                                                        </svg>
                                                        {errors.phone.message || 'No válido'}
                                                    </div>
                                                ) : (
                                                    <div className="h-6"></div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            }
                        </div>
                    </div>
                    <div className="modal-action mt-0 w-full">
                        <button onClick={() => {
                            const prevStep = steps[steps.indexOf(currentStep) - 1];
                            if (!prevStep) {
                                throw new Error("No previous Step")
                            }
                            setCurrentStep(prevStep);
                        }} className={`btn ${currentStep !== steps[2] ? "btn-disabled" : "btn-secondary"}`}>Anterior</button>
                        <button
                            form={currentStep === "Confirm" ? "submit-order" : "shipping-info"}
                            onClick={() => {
                                if (currentStep === "Confirm") {
                                    if (
                                        session.status === "authenticated"
                                        && session.data
                                        && session.data.user
                                        && session.data.user.email
                                        && session.data.user.name
                                    ) {
                                        const productsIdArr = cart.items.map(item => Array(item.quantity).fill(item.productId));
                                        const productsId = productsIdArr.flat();

                                        console.log("createOrder-input", {
                                            address: getValues("address"),
                                            city: getValues("city"),
                                            phone: getValues("phone"),
                                            state: "La Habana",
                                            email: session.data.user.email,
                                            name: session.data.user.name,
                                            productsId: productsId,
                                            totalPrice: cart.total,
                                            zipCode: "10600"
                                        })

                                        // createOrder.mutate({
                                        //     address: getValues("address"),
                                        //     city: getValues("city"),
                                        //     phone: getValues("phone"),
                                        //     state: "La Habana",
                                        //     email: session.data.user.email,
                                        //     name: session.data.user.name,
                                        //     productsId: productsId,
                                        //     totalPrice: cart.total,
                                        //     zipCode: "10600"
                                        // })
                                    } else {
                                        throw new Error("No se encuentra autenticado");
                                    }
                                }
                            }}
                            type="submit" className={`btn ${currentStep === steps[0] ? "btn-disabled" : "btn-secondary"}`}>{currentStep === "Confirm" ? "Completar" : "Siguiente"}</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BuyingProcess;

/* 
The overscroll-behavior CSS property sets what a browser does when reaching the boundary of a scrolling area.

onClick={() => {
    const nextStep = steps[steps.indexOf(currentStep) + 1];
    if (currentStep === "Confirm") {
        handleFinish();
        return;
    }
    if (!nextStep) {
        throw new Error("No previous Step")
    }
    setCurrentStep(nextStep);
}}

<div className="flex w-full justify-evenly">
    <button onClick={() => {
        setOrderWay("whatsapp");
    }} className="btn btn-primary border-none gap-2">
        <svg viewBox="0 0 48 48" width={20} height={20} fillRule="evenodd" clipRule="evenodd"><path fill="#fff" d="M4.9,43.3l2.7-9.8C5.9,30.6,5,27.3,5,24C5,13.5,13.5,5,24,5c5.1,0,9.8,2,13.4,5.6	C41,14.2,43,18.9,43,24c0,10.5-8.5,19-19,19c0,0,0,0,0,0h0c-3.2,0-6.3-0.8-9.1-2.3L4.9,43.3z" /><path fill="#fff" d="M4.9,43.8c-0.1,0-0.3-0.1-0.4-0.1c-0.1-0.1-0.2-0.3-0.1-0.5L7,33.5c-1.6-2.9-2.5-6.2-2.5-9.6	C4.5,13.2,13.3,4.5,24,4.5c5.2,0,10.1,2,13.8,5.7c3.7,3.7,5.7,8.6,5.7,13.8c0,10.7-8.7,19.5-19.5,19.5c-3.2,0-6.3-0.8-9.1-2.3	L5,43.8C5,43.8,4.9,43.8,4.9,43.8z" /><path fill="#cfd8dc" d="M24,5c5.1,0,9.8,2,13.4,5.6C41,14.2,43,18.9,43,24c0,10.5-8.5,19-19,19h0c-3.2,0-6.3-0.8-9.1-2.3	L4.9,43.3l2.7-9.8C5.9,30.6,5,27.3,5,24C5,13.5,13.5,5,24,5 M24,43L24,43L24,43 M24,43L24,43L24,43 M24,4L24,4C13,4,4,13,4,24	c0,3.4,0.8,6.7,2.5,9.6L3.9,43c-0.1,0.3,0,0.7,0.3,1c0.2,0.2,0.4,0.3,0.7,0.3c0.1,0,0.2,0,0.3,0l9.7-2.5c2.8,1.5,6,2.2,9.2,2.2	c11,0,20-9,20-20c0-5.3-2.1-10.4-5.8-14.1C34.4,6.1,29.4,4,24,4L24,4z" /><path fill="#40c351" d="M35.2,12.8c-3-3-6.9-4.6-11.2-4.6C15.3,8.2,8.2,15.3,8.2,24c0,3,0.8,5.9,2.4,8.4L11,33l-1.6,5.8	l6-1.6l0.6,0.3c2.4,1.4,5.2,2.2,8,2.2h0c8.7,0,15.8-7.1,15.8-15.8C39.8,19.8,38.2,15.8,35.2,12.8z" /><path fill="#fff" fillRule="evenodd" d="M19.3,16c-0.4-0.8-0.7-0.8-1.1-0.8c-0.3,0-0.6,0-0.9,0	s-0.8,0.1-1.3,0.6c-0.4,0.5-1.7,1.6-1.7,4s1.7,4.6,1.9,4.9s3.3,5.3,8.1,7.2c4,1.6,4.8,1.3,5.7,1.2c0.9-0.1,2.8-1.1,3.2-2.3	c0.4-1.1,0.4-2.1,0.3-2.3c-0.1-0.2-0.4-0.3-0.9-0.6s-2.8-1.4-3.2-1.5c-0.4-0.2-0.8-0.2-1.1,0.2c-0.3,0.5-1.2,1.5-1.5,1.9	c-0.3,0.3-0.6,0.4-1,0.1c-0.5-0.2-2-0.7-3.8-2.4c-1.4-1.3-2.4-2.8-2.6-3.3c-0.3-0.5,0-0.7,0.2-1c0.2-0.2,0.5-0.6,0.7-0.8	c0.2-0.3,0.3-0.5,0.5-0.8c0.2-0.3,0.1-0.6,0-0.8C20.6,19.3,19.7,17,19.3,16z" clipRule="evenodd" /></svg>
        WhatsApp
    </button>
    <button onClick={() => {
        setOrderWay("online");
    }} className="btn btn-primary border-none gap-2">
        <svg width={22} height={22} version="1.1" id="Layer_1"
            viewBox="0 0 512 512" xmlSpace="preserve">
            <path fill="#FFDC64" d="M418.472,367.165H25.119c-9.446,0-17.102-7.656-17.102-17.102V93.528
                c0-9.446,7.656-17.102,17.102-17.102h393.353c9.446,0,17.102,7.656,17.102,17.102v256.534
                C435.574,359.508,427.918,367.165,418.472,367.165z"/>
            <g>
                <path fill="#FFC850" d="M136.284,204.693H67.875c-4.722,0-8.551-3.829-8.551-8.551v-51.307c0-4.722,3.829-8.551,8.551-8.551
                    h68.409c4.722,0,8.551,3.829,8.551,8.551v51.307C144.835,200.864,141.006,204.693,136.284,204.693z"/>
                <path fill="#FFC850" d="M401.37,204.693c-70.839,0-128.267,57.427-128.267,128.267c0,11.865,1.739,23.3,4.753,34.205
                    h140.616c9.445,0,17.102-7.658,17.102-17.102V209.448C424.67,206.432,413.234,204.693,401.37,204.693z"/>
            </g>
            <circle fill="#FF507D" cx="294.48" cy="166.213" r="38.48" />
            <circle fill="#FFC850" cx="345.787" cy="166.213" r="38.48" />
            <path fill="#FF8C66" d="M307.307,166.213c0,11.352,5.008,21.451,12.827,28.493c7.819-7.043,12.827-17.142,12.827-28.493
                c0-11.352-5.008-21.451-12.827-28.493C312.315,144.762,307.307,154.861,307.307,166.213z"/>
            <circle fill="#B4E66E" cx="401.37" cy="332.96" r="102.614" />
            <path fill="#A0D755" d="M452.676,415.051c-56.672,0-102.614-45.942-102.614-102.614c0-33.271,15.905-62.756,40.449-81.505
                c-51.564,5.426-91.756,49.025-91.756,102.028c0,56.672,45.942,102.614,102.614,102.614c23.401,0,44.901-7.922,62.165-21.108
                C459.964,414.842,456.345,415.051,452.676,415.051z"/>
            <path d="M273.102,359.148H25.119c-5.01,0-9.086-4.076-9.086-9.086V93.528c0-5.01,4.076-9.086,9.086-9.086h393.353
                c5.01,0,9.086,4.076,9.086,9.086v111.167c0,4.427,3.589,8.017,8.017,8.017c4.427,0,8.017-3.589,8.017-8.017V93.528
                c0-13.851-11.268-25.119-25.119-25.119H25.119C11.268,68.409,0,79.677,0,93.528v256.534c0,13.851,11.268,25.119,25.119,25.119
                h247.983c4.427,0,8.017-3.589,8.017-8.017C281.119,362.738,277.53,359.148,273.102,359.148z"/>
            <path d="M401.37,222.33c-61.002,0-110.63,49.629-110.63,110.63s49.629,110.63,110.63,110.63S512,393.962,512,332.96
                S462.371,222.33,401.37,222.33z M401.37,427.557c-52.161,0-94.597-42.436-94.597-94.597s42.436-94.597,94.597-94.597
                s94.597,42.436,94.597,94.597S453.53,427.557,401.37,427.557z"/>
            <path d="M67.875,212.71h68.409c9.136,0,16.568-7.432,16.568-16.568v-51.307c0-9.136-7.432-16.568-16.568-16.568H67.875
                c-9.136,0-16.568,7.432-16.568,16.568v51.307C51.307,205.278,58.739,212.71,67.875,212.71z M136.818,144.835v51.307
                c0,0.295-0.239,0.534-0.534,0.534h-34.739v-18.171h9.086c4.427,0,8.017-3.589,8.017-8.017s-3.589-8.017-8.017-8.017h-9.086v-18.171
                h34.739C136.579,144.301,136.818,144.54,136.818,144.835z M67.34,144.835c0-0.295,0.239-0.534,0.534-0.534h17.637v52.376H67.875
                c-0.295,0-0.534-0.239-0.534-0.534V144.835z"/>
            <path d="M320.155,127.445c-7.571-5.017-16.489-7.729-25.675-7.729c-25.638,0-46.497,20.858-46.497,46.497
                s20.858,46.497,46.497,46.497c9.47,0,18.284-2.853,25.641-7.735c7.572,5.013,16.499,7.735,25.666,7.735
                c25.638,0,46.497-20.858,46.497-46.497s-20.858-46.497-46.497-46.497C336.32,119.716,327.509,122.567,320.155,127.445z
                M264.017,166.213c0-16.798,13.666-30.463,30.463-30.463c4.781,0,9.448,1.127,13.652,3.234c-5.555,7.66-8.842,17.065-8.842,27.229
                c0,9.885,3.145,19.378,8.824,27.23c-4.106,2.064-8.735,3.233-13.634,3.233C277.683,196.676,264.017,183.011,264.017,166.213z
                M376.251,166.213c0,16.798-13.666,30.463-30.463,30.463c-4.773,0-9.444-1.129-13.65-3.237c5.554-7.66,8.84-17.064,8.84-27.227
                c0-4.427-3.589-8.017-8.017-8.017c-4.427,0-8.017,3.589-8.017,8.017c0,6.037-1.772,11.666-4.814,16.404
                c-3.102-4.849-4.806-10.52-4.806-16.404c0-16.798,13.666-30.463,30.463-30.463C362.585,135.749,376.251,149.415,376.251,166.213z"/>
            <path d="M59.324,272.568h68.409c4.427,0,8.017-3.589,8.017-8.017c0-4.427-3.589-8.017-8.017-8.017H59.324
                c-4.427,0-8.017,3.589-8.017,8.017C51.307,268.979,54.896,272.568,59.324,272.568z"/>
            <path d="M59.324,323.875h205.228c4.427,0,8.017-3.589,8.017-8.017c0-4.427-3.589-8.017-8.017-8.017H59.324
                c-4.427,0-8.017,3.589-8.017,8.017C51.307,320.285,54.896,323.875,59.324,323.875z"/>
            <path d="M230.347,272.568c4.427,0,8.017-3.589,8.017-8.017c0-4.427-3.589-8.017-8.017-8.017h-68.409
                c-4.427,0-8.017,3.589-8.017,8.017c0,4.427,3.589,8.017,8.017,8.017H230.347z"/>
            <path d="M281.653,256.534h-17.102c-4.427,0-8.017,3.589-8.017,8.017c0,4.427,3.589,8.017,8.017,8.017h17.102
                c4.427,0,8.017-3.589,8.017-8.017C289.67,260.124,286.081,256.534,281.653,256.534z"/>
            <path d="M466.896,293.087c-3.131-3.131-8.207-3.131-11.337,0l-71.292,71.291l-37.087-37.087c-3.131-3.131-8.207-3.131-11.337,0
                c-3.131,3.131-3.131,8.206,0,11.337l42.756,42.756c1.565,1.566,3.617,2.348,5.668,2.348s4.103-0.782,5.668-2.348l76.96-76.96
                C470.027,301.293,470.027,296.218,466.896,293.087z"/>
        </svg>
        Online
    </button>
</div>
*/