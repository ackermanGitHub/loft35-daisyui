import { useContext, useEffect, useRef, useState } from 'react';
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
  const timeoutId = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    setMessagesShown(true);
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }
    timeoutId.current = setTimeout(() => {
      setMessagesShown(false);
    }, 5000);
  }, [stateMessages]);
  return (
    <>
      <Drawer>{children}</Drawer>
      <div className="chat w-1/2 gap-4 chat-end absolute bottom-20 right-8 pointer-events-none">
        {stateMessages.messages.map((message) => (
          <div
            key={message.id}
            className={`chat-bubble chat-bubble-${message.type} transition-opacity duration-700`}
            style={{
              opacity: isMessagesShown ? '0.5' : '0',
            }}
          >
            <p className="opacity-100">{message.text}.</p>
          </div>
        ))}
      </div>
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
