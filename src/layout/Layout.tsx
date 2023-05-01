import Link from 'next/link';
import NavBar from './NavBar';
// import SettingsOptions from '~/components/settings/Settings'; // is now in ShoppingCart

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <NavBar />
      <div className="drawer drawer-mobile">
        <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content relative flex flex-col items-center">
          <section className='flex max-w-screen-md flex-col items-center'>
            {children}
          </section>
          {/* <SettingsOptions />  is now in ShoppingCart */}
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
    </>
  );
};

export default Layout;
