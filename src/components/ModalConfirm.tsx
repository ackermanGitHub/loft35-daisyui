interface IProps {
  onOkFn: () => void;
  title: string;
  description: string;
  children: React.ReactNode;
  okBtnText: string;
  isDisabled: boolean;
}

const ModalConfirm: React.FC<IProps> = ({
  onOkFn,
  title,
  description,
  children,
  okBtnText,
  isDisabled,
}) => {
  return (
    <div className="flex justify-around max-md:justify-between">
      <label
        htmlFor={`${isDisabled ? 'my-modal-6' : ''}`}
        className={`btn btn-${isDisabled ? 'ghost' : 'disabled'}`}
      >
        {children}
      </label>

      {/* Put this part before </body> tag */}
      <input type="checkbox" id="my-modal-6" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle ">
        <div className="modal-box">
          <div className="flex flex-row items-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current flex-shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>

            <h3 className="font-bold text-lg">{title}</h3>
          </div>
          <p className="py-4">{description}</p>
          <div className="modal-action">
            <label
              onClick={onOkFn}
              htmlFor="my-modal-6"
              className="btn btn-secondary"
            >
              {okBtnText}
            </label>
            <label htmlFor="my-modal-6" className="btn btn-secondary">
              Cancelar
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirm;
