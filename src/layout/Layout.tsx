import Drawer from '~/layout/Drawer';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <Drawer>{children}</Drawer>

      {/* <div className="chat gap-4 chat-end absolute bottom-20 right-8 transition-opacity duration-700 opacity-0">
        <div className="chat-bubble">To be on the Council at your age.</div>
      </div> */}
    </>
  );
};

export default Layout;
