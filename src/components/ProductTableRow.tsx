import {
  type Product,
  type Category,
  type Image as ProductImage,
} from '@prisma/client';
import Image from 'next/image';

interface IProps {
  product: Product & {
    primaryImage: ProductImage;
  };
  categories: Category[];
  onEditInputClick: (editInputProps: {
    left: number;
    top: number;
    width: number;
    height: number;
    active: boolean;
    value: string;
    productID: number;
    type: string;
    column: string;
  }) => void;
  editInputProps: {
    left: number;
    top: number;
    width: number;
    height: number;
    active: boolean;
    value: string;
    productID: number;
    type: string;
    column: string;
  };
  onCheckBoxToggle: (checkBoxToggle: {
    active: boolean;
    productID: number;
  }) => void;
  onUpdateName: (checkBoxToggle: {
    productID: number;
    newName: string;
  }) => void;
  onUpdatePrice: (checkBoxToggle: {
    productID: number;
    newPrice: number;
  }) => void;
  onUpdateStock: (checkBoxToggle: {
    productID: number;
    newStock: number;
  }) => void;
}

const ProductTableRow: React.FC<IProps> = ({
  product,
  categories,
  onEditInputClick,
  editInputProps,
  onCheckBoxToggle,
  onUpdateName,
  onUpdatePrice,
  onUpdateStock,
}) => {
  return (
    <tr>
      <th>
        <label>
          <input type="checkbox" className="checkbox select-checkbox-group" />
        </label>
      </th>
      <td>
        <div className="flex items-center space-x-3">
          <div className="avatar">
            <div className="mask mask-squircle w-12 h-12">
              <Image
                src={product.primaryImage.url}
                alt="Avatar Tailwind CSS Component"
                width={48}
                height={48}
              />
            </div>
          </div>
          <div className="w-full">
            <div className="font-bold">{product.name}</div>
            <div className="flex justify-around items-center flex-row">
              <div className="text-sm opacity-50">${product.price}</div>
              <div
                className={`badge badge-sm text-sm badge-${
                  product.active ? 'success' : 'warning'
                } gap-2`}
              >
                {product.active ? 'active' : 'disabled'}
              </div>
            </div>
          </div>
        </div>
      </td>
      <td className="relative">
        <div className="flex justify-between items-center w-24">
          <select
            onChange={(e) => {
              if (e.target.value === 'Añadir') {
                onEditInputClick({
                  ...editInputProps,
                  value: e.target.value,
                });
                return;
              }
              onEditInputClick({
                ...editInputProps,
                active: false,
                productID: product.id,
                column: 'category',
                type: 'text',
                value: e.target.value,
              });
            }}
            value={product.categoryId}
            className="select w-full h-[75px] absolute inset-0"
          >
            {categories?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
            <option value={'Añadir'} className="btn">
              + Añadir
            </option>
          </select>
        </div>
      </td>
      <td>
        <input
          type="checkbox"
          className="toggle toggle-active"
          defaultChecked={product.active}
          onChange={() => {
            onCheckBoxToggle({
              productID: product.id,
              active: !product.active,
            });
          }}
        />
      </td>
      <th>
        <div className="flex justify-between">
          <p
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              const target = event.currentTarget as HTMLSpanElement;
              const parent = target.parentElement as HTMLTableCellElement;
              const grandParent = parent.parentElement as HTMLTableCellElement;

              const position = {
                x: grandParent?.offsetLeft,
                y: grandParent?.offsetTop,
              };
              const size = {
                width: grandParent?.offsetWidth,
                height: grandParent?.offsetHeight,
              };

              onEditInputClick({
                left: position.x,
                top: position.y,
                height: size.height,
                width: size.width,
                value: product.name,
                active: true,
                productID: product.id,
                type: 'text',
                column: 'name',
              });
            }}
          >
            {product.name}
          </p>
          {editInputProps.active &&
            editInputProps.productID === product.id &&
            editInputProps.column === 'name' && (
              <div
                onClick={() => {
                  onEditInputClick({
                    ...editInputProps,
                    active: false,
                  });
                  if (product.name === editInputProps.value) return;
                  onUpdateName({
                    productID: product.id,
                    newName: editInputProps.value,
                  });
                  product.name = editInputProps.value;
                }}
                className="fixed inset-0 w-[100vw] h-[100vh] opacity-30 stroke-slate-600"
              ></div>
            )}
        </div>
      </th>
      <th>
        <div className="flex justify-between">
          <p
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              const target = event.currentTarget as HTMLSpanElement;
              const parent = target.parentElement as HTMLTableCellElement;
              const grandParent = parent.parentElement as HTMLTableCellElement;

              const position = {
                x: grandParent?.offsetLeft,
                y: grandParent?.offsetTop,
              };
              const size = {
                width: grandParent?.offsetWidth,
                height: grandParent?.offsetHeight,
              };

              onEditInputClick({
                left: position.x,
                top: position.y,
                height: size.height,
                width: size.width,
                value: product.price.toString(),
                active: true,
                productID: product.id,
                type: 'number',
                column: 'price',
              });
            }}
          >
            {product.price}
          </p>
          {editInputProps.active &&
            editInputProps.productID === product.id &&
            editInputProps.column === 'price' && (
              <div
                onClick={() => {
                  onEditInputClick({
                    ...editInputProps,
                    active: false,
                  });
                  if (product.price.toString() === editInputProps.value) return;
                  onUpdatePrice({
                    productID: product.id,
                    newPrice: parseInt(editInputProps.value),
                  });
                  product.price = parseInt(editInputProps.value);
                }}
                className="fixed inset-0 w-[100vw] h-[100vh] opacity-30 stroke-slate-600"
              ></div>
            )}
        </div>
      </th>
      <th>
        <div className="flex justify-between">
          <p
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              const target = event.currentTarget as HTMLSpanElement;
              const parent = target.parentElement as HTMLTableCellElement;
              const grandParent = parent.parentElement as HTMLTableCellElement;

              const position = {
                x: grandParent?.offsetLeft,
                y: grandParent?.offsetTop,
              };
              const size = {
                width: grandParent?.offsetWidth,
                height: grandParent?.offsetHeight,
              };

              onEditInputClick({
                left: position.x,
                top: position.y,
                height: size.height,
                width: size.width,
                value: product.stock.toString(),
                active: true,
                productID: product.id,
                type: 'number',
                column: 'stock',
              });
            }}
          >
            {product.stock}
          </p>
          {editInputProps.active &&
            editInputProps.productID === product.id &&
            editInputProps.column === 'stock' && (
              <div
                onClick={() => {
                  onEditInputClick({
                    ...editInputProps,
                    active: false,
                  });
                  if (product.stock.toString() === editInputProps.value) return;
                  onUpdateStock({
                    productID: product.id,
                    newStock: parseInt(editInputProps.value),
                  });
                  product.stock = parseInt(editInputProps.value);
                }}
                className="fixed inset-0 w-[100vw] h-[100vh] opacity-30 stroke-slate-600"
              ></div>
            )}
        </div>
      </th>
      <th>
        <p>{product.priority}</p>
      </th>
    </tr>
  );
};

export default ProductTableRow;
