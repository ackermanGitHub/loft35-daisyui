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
        htmlFor={`${isDisabled ? '' : 'confirm-modal'}`}
        className={`btn btn-sm btn-${isDisabled ? 'disabled' : 'ghost'}`}
      >
        {children}
      </label>

      {/* Put this part before </body> tag */}
      <input
        type="checkbox"
        id="confirm-modal"
        className="modal-toggle"
        disabled={isDisabled}
      />
      <div className="modal absolute modal-bottom sm:modal-middle">
        <div className="modal-box ">
          <div className="flex flex-row items-center gap-3">
            <svg
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

            <p className="font-bold text-lg">{title}</p>
          </div>
          {/* TODO: fix the inheritance overflow problem */}
          <p className="py-4 whitespace-break-spaces">{description}</p>
          <div className="modal-action">
            <label
              onClick={onOkFn}
              htmlFor="confirm-modal"
              className="btn btn-secondary"
            >
              {okBtnText}
            </label>
            <label htmlFor="confirm-modal" className="btn btn-secondary">
              Cancelar
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirm;