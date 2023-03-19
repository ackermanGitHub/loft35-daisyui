import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { api } from '../utils/api';

interface FormValues {
  name: string;
  price: string;
  stock: string;
  description: string;
  categoryName: string;
  image: FileList;
  secImages: FileList;
}

const NavBar: React.FC = () => {
  const [upldProState, setUpldProstate] = useState<string>('Subir');

  const productList = api.product.create.useMutation({});

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<FormValues>();

  const onUpldProClick = async (data: FormValues) => {
    if (
      upldProState === 'Cargando' ||
      upldProState === 'Error' ||
      upldProState === 'Subida'
    ) {
      setUpldProstate('Subir');
      return;
    }

    if (!data.image[0]) return;

    const arrayBuffer = await data.image[0].arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);
    setUpldProstate('Cargando');

    productList.mutate(
      {
        name: data.name,
        description: data.description,
        file: fileBuffer,
        secondaryImages: [],
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
          reset();
        },
      }
    );
  };

  return (
    <nav className="navbar bg-secondary bg-gradient-to-l from-current to-primary">
      <form className="mx-auto h-8">
        <input
          type="text"
          id="search"
          placeholder="Buscar"
          className="h-full max-w-[100px] rounded-l-lg border-[1px] border-r-0 border-[#d3d5dd] bg-[#fff] pl-4 font-medium text-[#555555]"
        />
        <button
          type="submit"
          className="flex h-[inherit] min-w-[40px] items-center justify-center rounded-r-lg border-[1px] border-[#d3d5dd] bg-[#f5f8fa]"
        >
          <svg
            fill="none"
            width={18}
            height={18}
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="#a1a5b7"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </button>
      </form>
      <div className="flex justify-around max-md:justify-between">
        <label htmlFor="my-modal-5" className=" btn-xs btn text-xs">
          Subir Producto
        </label>
        <input type="checkbox" id="my-modal-5" className="modal-toggle" />
        <div className="modal ">
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
                {...register('image', { required: true })}
                className="file-input-bordered file-input w-full max-w-xs"
              />
              {errors.image ? (
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
                {...register('secImages', { required: true })}
                className="file-input-bordered file-input w-full max-w-xs"
              />
              {errors.secImages ? (
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
                className={`btn ${
                  upldProState === 'Cargando' ? 'loading' : ''
                } ${upldProState === 'Subida' ? 'btn-success' : ''}
                ${upldProState === 'Error' ? 'btn-error' : ''}
                `}
                type="submit"
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
    </nav>
  );
};

export default NavBar;
