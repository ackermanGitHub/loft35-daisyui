import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { api } from '../utils/api';
// import sharp from 'sharp';

interface FormValues {
  name: string;
  price: string;
  stock: string;
  secondaryImages: FileList[];
  description: string;
  categoryName: string;
  primaryImage: FileList;
}

interface IProps {
  onUploadSucces: () => void;
}

const ProductForm: React.FC<IProps> = ({ onUploadSucces }) => {
  const [upldProState, setUpldProstate] = useState<string>('Subir');

  const productList = api.product.create.useMutation({});

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    setError,
  } = useForm<FormValues>();

  const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

  // const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {};

  const onUpldProClick = async (data: FormValues) => {
    if (upldProState === 'Error' || upldProState === 'Subida') {
      setUpldProstate('Subir');
      return;
    }

    if (!data.primaryImage[0]) return;
    setUpldProstate('Cargando');

    const arrayBufferPrimaryImage = await data.primaryImage[0].arrayBuffer();
    const primaryImageBuffer = Buffer.from(arrayBufferPrimaryImage);

    // const sharpPrimaryImage = sharp(primaryImageBuffer);
    // let metadataPrimaryImage = await sharpPrimaryImage
    //   .metadata()
    //   .then(function (metadata) {
    //     return sharpPrimaryImage
    //       .resize(Math.round(metadata.width! / 2))
    //       .jpeg()
    //       .toBuffer();
    //   });

    const metadataSecondaryImages: Buffer[] = [];
    // data.secondaryImages.map(async (secondaryImage) => {
    //   const arrayBufferSecondaryImage = await secondaryImage[0]?.arrayBuffer();
    //   if (!arrayBufferSecondaryImage) return;
    //   const secondaryImageBuffer = Buffer.from(arrayBufferSecondaryImage);

    //   // const sharpSecondaryImage = sharp(secondaryImageBuffer);
    //   //
    //   // // Devuelve una promesa resolviendo el objeto Sharp modificado
    //   // let metadataSecondaryImage = await sharpSecondaryImage
    //   //   .metadata()
    //   //   .then(function (metadata) {
    //   //     return sharpPrimaryImage
    //   //       .resize(Math.round(metadata.width! / 2))
    //   //       .jpeg()
    //   //       .toBuffer();
    //   //   });

    //   metadataSecondaryImages.push(secondaryImageBuffer);
    // });

    setTimeout(() => {
      Math.random() > 0.5
        ? setUpldProstate('Error')
        : setUpldProstate('Subida');
    }, 3000);

    console.log('ProductForm', data);
    //  productList.mutate(
    //    {
    //      name: data.name,
    //      description: data.description,
    //      primaryImage: primaryImageBuffer,
    //      color: '',
    //      secondaryImages: metadataSecondaryImages,
    //      price: parseInt(data.price),
    //      stock: parseInt(data.stock),
    //      categoryName: data.categoryName,
    //    },
    //    {
    //      onError: () => {
    //        setUpldProstate('Error');
    //      },
    //      onSuccess() {
    //        setUpldProstate('Subida');
    //        onUploadSucces();
    //        reset();
    //      },
    //    }
    //  );
  };

  return (
    <div className="flex justify-around max-md:justify-between">
      <label htmlFor="my-modal-5" className="btn btn-ghost">
        <svg
          width="25px"
          height="25px"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="Edit / Add_To_Queue">
            <path
              id="Vector"
              d="M3 9V19.4C3 19.9601 3 20.2399 3.10899 20.4538C3.20487 20.642 3.35774 20.7952 3.5459 20.8911C3.7596 21 4.0395 21 4.59846 21H15.0001M14 13V10M14 10V7M14 10H11M14 10H17M7 13.8002V6.2002C7 5.08009 7 4.51962 7.21799 4.0918C7.40973 3.71547 7.71547 3.40973 8.0918 3.21799C8.51962 3 9.08009 3 10.2002 3H17.8002C18.9203 3 19.4801 3 19.9079 3.21799C20.2842 3.40973 20.5905 3.71547 20.7822 4.0918C21.0002 4.51962 21.0002 5.07969 21.0002 6.19978L21.0002 13.7998C21.0002 14.9199 21.0002 15.48 20.7822 15.9078C20.5905 16.2841 20.2842 16.5905 19.9079 16.7822C19.4805 17 18.9215 17 17.8036 17H10.1969C9.07899 17 8.5192 17 8.0918 16.7822C7.71547 16.5905 7.40973 16.2842 7.21799 15.9079C7 15.4801 7 14.9203 7 13.8002Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </svg>
      </label>
      <input type="checkbox" id="my-modal-5" className="modal-toggle" />
      <div className="modal">
        <form
          className="modal-box flex w-auto max-w-5xl flex-col"
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onSubmit={handleSubmit(onUpldProClick)}
        >
          <h3 className="card-title">Sube un Producto!</h3>
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Imágen Principal</span>
            </label>
            <input
              type="file"
              accept="image/*"
              {...register('primaryImage', {
                required: true,
                onChange: (e) => {
                  const file = e.target.files[0];
                  if (file.size > MAX_IMAGE_SIZE) {
                    alert('The selected image is too large');
                    return;
                  }
                  // Use the file as needed
                },
              })}
              className="file-input-bordered file-input w-full max-w-xs"
            />
            {errors.primaryImage ? (
              <div className="badge-warning  badge my-[2px] gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
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
                obligatorio
              </div>
            ) : (
              <div className="h-6"></div>
            )}
          </div>
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Imágenes Secundarias</span>
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              {...register('secondaryImages', {
                required: true,
                maxLength: 3,
                max: 3,
                onChange(event) {
                  const files = event.target.files;
                  console.log('secondaryImages-onChange', files);

                  if (Array.from(files).length > 3) {
                    setError('secondaryImages', {
                      message: 'demasiadas',
                    });
                    console.log(errors);
                  }
                  // Use the file as needed
                },
              })}
              className="file-input-bordered file-input w-full max-w-xs"
            />
            {errors.secondaryImages ? (
              <div className="badge-warning badge my-[2px] gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
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
                {errors.secondaryImages.message || 'obligatorio'}
              </div>
            ) : (
              <div className="h-6"></div>
            )}
          </div>
          <div className="flex justify-between max-w-xs">
            <div className="w-[47%] flex flex-col">
              <input
                type="text"
                placeholder="Nombre"
                {...register('name', { required: true })}
                className="input-bordered input w-full max-w-xs"
              />
              {errors.name ? (
                <div className="badge-warning badge my-[2px] gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
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
                  obligatorio
                </div>
              ) : (
                <div className="h-6"></div>
              )}
            </div>
            <div className="w-[47%] flex flex-col">
              <input
                type="text"
                placeholder="Precio"
                {...register('price', { required: true })}
                className="input-bordered input w-full max-w-xs"
              />
              {errors.price ? (
                <div className="badge-warning badge my-[2px] gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
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
                  obligatorio
                </div>
              ) : (
                <div className="h-6"></div>
              )}
            </div>
          </div>
          <div className="flex justify-between max-w-xs">
            <div className="flex flex-col w-[47%]">
              <input
                type="number"
                placeholder="Cantidad"
                {...register('stock', { required: true })}
                className="input input-bordered"
              />
              {errors.stock ? (
                <div className="badge-warning  badge my-[2px] gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
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
                  obligatorio
                </div>
              ) : (
                <div className="h-6"></div>
              )}
            </div>
            <div className="flex flex-col w-[47%]">
              <select
                className="select select-bordered"
                {...register('categoryName', { required: true })}
              >
                <option value={'<categoryId>'}>T-shirts</option>
                <option value={'<categoryId>'}>Mugs</option>
              </select>
              {errors.categoryName ? (
                <div className="badge-warning badge my-[2px] gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
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
                  obligatorio
                </div>
              ) : (
                <div className="h-6"></div>
              )}
            </div>
          </div>
          <textarea
            className="textarea-bordered textarea w-full max-w-xs"
            placeholder="Descripción"
            {...register('description', { required: true })}
          ></textarea>
          {errors.description ? (
            <div className="badge-warning badge my-[2px] gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
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
              obligatorio
            </div>
          ) : (
            <div className="h-6"></div>
          )}

          <div className={`modal-action mt-0`}>
            <button
              className={`btn ${upldProState === 'Cargando' ? 'loading' : ''} ${
                upldProState === 'Subida' ? 'btn-success' : ''
              }
                ${upldProState === 'Error' ? 'btn-error' : ''}
                `}
              type="submit"
              disabled={upldProState === 'Cargando'}
            >
              {upldProState}
            </button>
            <label
              onClick={() => {
                setUpldProstate('Subir');
                reset();
              }}
              htmlFor="my-modal-5"
              className="btn"
            >
              Cancelar
            </label>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
