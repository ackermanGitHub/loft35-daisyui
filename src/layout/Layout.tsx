import Link from 'next/link';
import NavBar from './NavBar';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col h-screen">
      <NavBar />
      <div className="drawer drawer-mobile">
        <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content relative flex flex-col">
          <section className='flex m-auto w-full max-w-screen-lg flex-col items-center'>
            {children}
          </section>
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
    </div>
  );
};

export default Layout;
