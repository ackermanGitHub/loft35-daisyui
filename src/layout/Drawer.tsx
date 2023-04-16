import Link from 'next/link';
import NavBar from './NavBar';

const Drawer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="drawer transform-none">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content mb-12 from-primary to-secondary bg-gradient-to-br flex flex-col">
        <NavBar />
        {children}
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer-3" className="drawer-overlay"></label>
        <ul className="menu p-4 w-80 bg-base-100">
          <li>
            <Link href="/products">Productos</Link>
          </li>
          <li>
            <Link href="/orders">Ordenes</Link>
          </li>
          <li>
            <Link href="/test">Pruebas</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Drawer;
