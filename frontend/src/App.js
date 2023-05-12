import './App.css';
import io from 'socket.io-client'
import { useEffect, useState } from 'react';


const socket = io('http://localhost:4000');

function App() {

  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [users, setUsers] = useState(['tú'])


  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit('message', message)
    const newMessage = {
      body: message,
      from: 'tu'
    }
    setMessages([newMessage, ...messages])
    setMessage('')
  }

  useEffect(() => {
    const receiveMessage = (message) => {
      const user = message.from;
      if (!users.includes(`, ${user}`)) {
        setUsers([...users, `, ${user}`]);
      }
      setMessages([message, ...messages]);
    };
    socket.on('message', receiveMessage);
    return () => {
      socket.off('message', receiveMessage);
    };
  }, [messages, users]);

  return (
    <div className="App">
      <div className="container">
        <div className="phone">
          <div className="notch-container">
            <div className="notch"></div>
          </div>
          <div className='chat'>
            <div className='head-chat'>
              <div className='circle'>
                <img src={`${process.env.PUBLIC_URL}/assets/icons/user.png`} alt='user' />
              </div>
              <div className='name'>
                <div style={{display:'flex'}}>{users}</div>
              </div>
            </div>
            <div className='fondo-chat'>
              {messages.map((m, index) => (
                (m.from === 'tu') ?
                  (<span className='conversation-chat' style={{ justifyContent: "flex-end", background: "#703efe", color: "#f5f5f5" }} key={index}>
                    {
                      (m.from === 'tu') ? null : (<div>{m.from}: &nbsp; </div>)
                    }
                    {m.body}
                  </span>)
                  :
                  (<span className='conversation-chat' style={{ justifyContent: 'flex-start', background: "#f5f5f5" }} key={index}>
                    {
                      (m.from === 'tu') ? null : (<div style={{ color: "#545454" }}>{m.from}: &nbsp; </div>)
                    }
                    {m.body}
                  </span>)
              ))}
            </div>
            <form className='form-chat' onSubmit={handleSubmit}>
              <input type="text" onChange={e => setMessage(e.target.value)} value={message} />
              <button>
                <img src={`${process.env.PUBLIC_URL}/assets/icons/send.png`} alt='send'/>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
