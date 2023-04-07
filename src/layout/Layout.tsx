import { useContext, useEffect, useState } from 'react';
import { ChatContext } from '~/context/ChatBubbles';
import Drawer from '~/layout/Drawer';

// type MessageType = {
//   id: number;
//   text: string;
//   type: string;
// };

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { stateMessages } = useContext(ChatContext);
  const [isMessagesShown, setMessagesShown] = useState(false);

  useEffect(() => {
    setMessagesShown(true);
    const foo = setTimeout(() => {
      setMessagesShown(false);
    }, 5000);
    clearTimeout(foo);
  }, [stateMessages]);

  return (
    <>
      <Drawer>{children}</Drawer>
      <div className="chat w-1/2 gap-4 chat-end absolute bottom-20 right-8">
        {stateMessages.messages.map((message) => (
          <div
            key={message.id}
            className={`chat-bubble chat-bubble-${message.type} transition-opacity duration-700`}
            style={{
              opacity: isMessagesShown ? '50' : '0',
            }}
          >
            {message.text}.
          </div>
        ))}
      </div>
      {/* This ones are for preloading the chat-bubble themes */}
      <div className="hidden">
        <div className="chat-bubble-error">Teeeest.</div>
        <div className="chat-bubble-warning">Teeeest.</div>
        <div className="chat-bubble-primary">Teeeest.</div>
        <div className="chat-bubble-secondary">Teeeest.</div>
        <div className="chat-bubble-accent">Teeeest.</div>
        <div className="chat-bubble-info">Teeeest.</div>
        <div className="chat-bubble-success">Teeeest.</div>
      </div>
    </>
  );
};

export default Layout;
