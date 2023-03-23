import Drawer from '~/components/Drawer';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <Drawer>{children}</Drawer>
    </>
  );
};

export default Layout;
