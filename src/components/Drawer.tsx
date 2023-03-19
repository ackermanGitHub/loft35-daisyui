import NavBar from './NavBar';
import ProductForm from './ProductForm';

const Drawer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="drawer">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        <NavBar />
        {children}
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer-3" className="drawer-overlay"></label>
        <ul className="menu p-4 w-80 bg-base-100">
          {/* <!-- Sidebar content here --> */}
          <li>
            <a>Productos</a>
          </li>
          <li>
            <a>Ordenes</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Drawer;
