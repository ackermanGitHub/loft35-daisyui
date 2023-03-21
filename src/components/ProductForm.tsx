import { ChangeEvent, useState } from 'react';
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
  } = useForm<FormValues>();

  const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {};

  const onUpldProClick = async (data: FormValues) => {
    if (
      upldProState === 'Cargando' ||
      upldProState === 'Error' ||
      upldProState === 'Subida'
    ) {
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

    let metadataSecondaryImages: Buffer[] = [];
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

    productList.mutate(
      {
        name: data.name,
        description: data.description,
        primaryImage: primaryImageBuffer,
        deleted: false,
        active: false,
        color: '',
        secondaryImages: metadataSecondaryImages,
        price: parseInt(data.price),
        stock: parseInt(data.stock),
        categoryName: data.categoryName,
      },
      {
        onError: () => {
          setUpldProstate('Error');
        },
        onSuccess() {
          setUpldProstate('Subida');
          onUploadSucces();
          reset();
        },
      }
    );
  };

  return (
    <div className="flex justify-around max-md:justify-between">
      <label htmlFor="my-modal-5" className="btn text-xs">
        Subir
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
                  console.log('bbb');

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
                This field is required
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
              {...register('secondaryImages', { required: true })}
              className="file-input-bordered file-input w-full max-w-xs"
            />
            {errors.secondaryImages ? (
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
                This field is required
              </div>
            ) : (
              <div className="h-6"></div>
            )}
          </div>
          <input
            type="text"
            placeholder="Nombre"
            {...register('name', { required: true })}
            className="input-bordered input-secondary input  w-full max-w-xs"
          />
          {errors.name ? (
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
              This field is required
            </div>
          ) : (
            <div className="h-6"></div>
          )}
          <input
            type="text"
            placeholder="Precio"
            {...register('price', { required: true })}
            className="input-bordered input-secondary input  w-full max-w-xs"
          />
          {errors.price ? (
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
              This field is required
            </div>
          ) : (
            <div className="h-6"></div>
          )}

          <input
            type="text"
            placeholder="Cantidad Disponible"
            {...register('stock', { required: true })}
            className="input-bordered input-secondary input  w-full max-w-xs"
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
              This field is required
            </div>
          ) : (
            <div className="h-6"></div>
          )}

          <input
            type="text"
            placeholder="Categoría"
            {...register('categoryName', { required: true })}
            className="input-bordered input-secondary input  w-full max-w-xs"
          />
          {errors.description ? (
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
              This field is required
            </div>
          ) : (
            <div className="h-6"></div>
          )}
          <textarea
            className="textarea-secondary textarea  w-full max-w-xs"
            placeholder="Descripción"
            {...register('description', { required: true })}
          ></textarea>
          {errors.categoryName ? (
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
              This field is required
            </div>
          ) : (
            <div className="h-6"></div>
          )}

          <div className={`modal-action`}>
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
