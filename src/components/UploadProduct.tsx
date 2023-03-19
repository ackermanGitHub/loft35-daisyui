import { useForm } from 'react-hook-form';
import { api } from '../utils/api';
import { useState } from 'react';

interface FormValues {
  name: string;
  price: string;
  stock: string;
  description: string;
  categoryName: string;
  image: FileList;
}

const ImageUploadForm: React.FC = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
  } = useForm<FormValues>();

  const [loadingState, setLoadingState] = useState<string | undefined>();

  const productList = api.product.create.useMutation({});

  const onSubmit = async (data: FormValues) => {
    if (!data.image[0]) {
      throw new Error('submit isnt getting any image');
    }

    const arrayBuffer = await data.image[0].arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);
    setLoadingState('Loading');

    productList.mutate(
      {
        name: data.name,
        description: data.description,
        image: fileBuffer,
        imageSize: 2.5,
        secondaryImages: [],
        price: parseInt(data.price),
        stock: parseInt(data.stock),
        categoryName: data.categoryName,
      },
      {
        onError: (e) => {
          setLoadingState('Error' + ': ' + e.message);
          console.error(e);
        },
        onSuccess(data) {
          setLoadingState(data.name + 'uploaded');
          console.log('succes', data);
        },
      }
    );
  };

  return (
    <div
      className={`modal-container onclick-close-modal fixed inset-0 z-10 h-full w-full transform bg-[#bdbcbc7e] transition-transform`}
    >
      <form
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={handleSubmit(onSubmit)}
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="absolute top-1/2 left-1/2 flex h-auto w-[90%] max-w-xs -translate-x-1/2 -translate-y-1/2 transform flex-col items-center justify-center overflow-x-hidden rounded-lg bg-[var(--secondary-bg-color)] py-5 shadow-lg"
      >
        <div>close</div>
        {loadingState && <div>{loadingState}</div>}
        <div className="mb-4 flex flex-col items-center">
          <label htmlFor="image" className="mb-2 block font-bold text-white">
            Image
          </label>
          <input
            type="file"
            id="image"
            {...register('image', { required: true })}
            className="w-full p-2"
          />
          {errors.image && <span>This field is required</span>}
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            {...register('name', { required: true })}
            className="input w-[50%] p-2 text-white"
          />
          {errors.name && <span>This field is required</span>}
          <label htmlFor="price">price</label>
          <input
            type="number"
            id="price"
            {...register('price', { required: true })}
            className="input w-[50%] p-2 text-white"
          />
          {errors.price && <span>This field is required</span>}
          <label htmlFor="stock">stock</label>
          <input
            type="number"
            id="stock"
            {...register('stock', { required: true })}
            className="input w-[50%] p-2 text-white"
          />
          {errors.stock && <span>This field is required</span>}
          <label htmlFor="description">description</label>
          <input
            type="text"
            id="description"
            {...register('description', { required: true })}
            className="input w-[50%] p-2 text-white"
          />
          {errors.description && <span>This field is required</span>}
          <label htmlFor="categoryName">categoryName</label>
          <input
            type="text"
            id="categoryName"
            {...register('categoryName', { required: true })}
            className="input w-[50%] p-2 text-white"
          />
          {errors.categoryName && <span>This field is required</span>}
        </div>
        <button type="submit" className="loading " disabled={!watch('image')}>
          Upload
        </button>
      </form>
    </div>
  );
};

export default ImageUploadForm;

/* 
Para hacer un input específicamente para imágenes en React/Tailwind, se puede utilizar el elemento HTML input con el atributo type establecido en "file". Esto permitirá al usuario seleccionar una imagen de su dispositivo. Para mostrar varias imágenes, se puede agregar el atributo multiple al input.

Aquí hay un ejemplo de cómo se puede crear un input para imágenes en React/Tailwind:

jsx
Copy code
import React, { useState } from "react";

function ImageInput() {
  const [images, setImages] = useState([]);

  const handleImageChange = (event) => {
    const selectedImages = Array.from(event.target.files);
    setImages(selectedImages);
  };

  return (
    <div className="mt-4">
      <label className="block font-medium text-sm text-gray-700">
        Imágenes
      </label>
      <input
        type="file"
        className="mt-1 block w-full"
        accept="image/*"
        multiple
        onChange={handleImageChange}
      />
      {images.length > 0 && (
        <div className="mt-2">
          <h2 className="text-sm font-medium text-gray-700">Imágenes seleccionadas:</h2>
          {images.map((image) => (
            <img
              key={image.name}
              src={URL.createObjectURL(image)}
              className="mt-1 w-20 h-20 object-cover"
              alt={image.name}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ImageInput;
En este ejemplo, se utiliza el hook useState para mantener un estado local de las imágenes seleccionadas por el usuario. Cuando el usuario selecciona una o varias imágenes, se llama a la función handleImageChange, que convierte el objeto FileList devuelto por el
*/
