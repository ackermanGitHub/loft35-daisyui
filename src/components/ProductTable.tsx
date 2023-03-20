import { Category, Image, Product } from '@prisma/client';
import ProductForm from './ProductForm';
import { useEffect, useState } from 'react';
import { api } from '~/utils/api';

const ProductTable: React.FC<{
  products: Product[];
  categories: Category[];
  images: Image[];
}> = ({ products, categories, images }) => {
  useEffect(() => {
    const selectAll = document.getElementById('select-all') as HTMLInputElement;
    const checkboxes = document.querySelectorAll(
      '.checkbox-group'
    ) as NodeListOf<HTMLInputElement>;

    selectAll.addEventListener('click', () => {
      for (let i = 0; i < checkboxes.length; i++) {
        checkboxes[i]!.checked = selectAll.checked;
      }
    });
  }, []);

  let dinamicProducts = api.product.getAll.useQuery().data!;
  let dinamicCategories = api.category.getAll.useQuery().data!;
  let dinamicImages = api.image.getAll.useQuery().data!;

  // const [dinamicProducts, setDinamicProducts] = useState<Product[]>();
  // const [dinamicCategories, setDinamicCategories] = useState<Category[]>();
  // const [dinamicImages, setDinamicImages] = useState<Image[]>();

  const refreshProductsTable = () => {
    // dinamicProducts = api.product.getAll.useQuery().data!;
    // dinamicCategories = api.category.getAll.useQuery().data!;
    // dinamicImages = api.image.getAll.useQuery().data!;

    // setDinamicProducts(fetchedProducts);
    // setDinamicCategories(fetchedCategories);
    // setDinamicImages(fetchedImages);

    console.log(dinamicProducts);
    console.log(dinamicCategories);
    console.log(dinamicImages);
  };

  return (
    <div className="overflow-x-auto w-full">
      <table className="table w-full">
        <thead>
          <tr>
            <th>
              <label>
                <input id="select-all" type="checkbox" className="checkbox" />
              </label>
            </th>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Disponibles</th>
            <th>Descripción</th>
          </tr>
        </thead>
        <tbody>
          {/* rows */}
          {dinamicProducts &&
            dinamicProducts?.map((dinamicProducts) => {
              return (
                <tr>
                  <td>
                    <div className="flex items-center space-x-3">
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                          <img
                            src={
                              dinamicImages &&
                              dinamicImages.find(
                                (dinamicImages) =>
                                  dinamicImages.id ===
                                  dinamicProducts.primaryImageId
                              )?.url
                            }
                            alt="Avatar Tailwind CSS Component"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{dinamicProducts.name}</div>
                        <div className="text-sm opacity-50">
                          ${dinamicProducts.price}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    {dinamicCategories &&
                      dinamicCategories.find(
                        (dinamicCategories) =>
                          dinamicCategories.id === dinamicProducts.categoryId
                      )?.name}
                    <br />
                    <span className="badge badge-ghost badge-sm">
                      ID:
                      {dinamicProducts.priority}
                    </span>
                  </td>
                  <td>{dinamicProducts.categoryName}</td>
                  <td>
                    <input type="checkbox" className="toggle" />
                  </td>
                  <th>
                    <div className="collapse">
                      <input type="checkbox" />
                      <div className="collapse-title text-xl font-medium">
                        Mostrar
                      </div>
                      <div className="collapse-content">
                        <p>{dinamicProducts.description}</p>
                      </div>
                    </div>
                  </th>
                </tr>
              );
            })}
          <tr>
            <th></th>
            <td>
              <div className="flex items-center space-x-3">
                <ProductForm />
              </div>
            </td>
            <td>
              <div className="flex items-center space-x-3">
                <label
                  onClick={() => {
                    const fetchedProducts = api.product.getAll.useQuery().data!;
                    const fetchedCategories =
                      api.category.getAll.useQuery().data!;
                    const fetchedImages = api.image.getAll.useQuery().data!;

                    console.log(fetchedProducts);
                    console.log(fetchedCategories);
                    console.log(fetchedImages);
                  }}
                  className="btn text-xs"
                >
                  Subir Producto
                </label>
              </div>
            </td>
          </tr>
          <tr>
            <th></th>
          </tr>
        </tbody>
        {/* foot */}
        <tfoot>
          <tr>
            <th></th>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Disponibles</th>
            <th>Descripción</th>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default ProductTable;
