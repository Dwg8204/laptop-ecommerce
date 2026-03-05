import { useState } from 'react'
import { FiMessageCircle, FiX } from 'react-icons/fi'
import '../styles/Chatbot.css'

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Chào bạn! Tôi có thể giúp gì hôm nay?' }
  ])
  const [input, setInput] = useState('')

  const sendMessage = () => {
    if (!input.trim()) return
    const userMsg = { from: 'user', text: input }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    // simulate bot reply
    setTimeout(() => {
      setMessages((prev) => [...prev, { from: 'bot', text: 'Cảm ơn bạn đã hỏi! Chúng tôi đang xử lý.' }])
    }, 800)
  }

  return (
    <div className={open ? 'chatbot-container open' : 'chatbot-container'}>
      <div className="chatbot-header" onClick={() => setOpen(!open)}>
        <span>LaptopShop AI</span>
        {open ? <FiX size={20} /> : <FiMessageCircle size={20} />}
      </div>
      {open && (
        <div className="chatbot-body">
          <div className="chatbot-messages">
            {messages.map((m, idx) => (
              <div key={idx} className={`chatmsg ${m.from}`}>
                {m.text}
              </div>
            ))}
          </div>
          <div className="chatbot-input">
            <input
              type="text"
              placeholder="Hỏi tôi bất cứ điều gì..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button onClick={sendMessage}>Gửi</button>
          </div>
        </div>
      )}
    </div>
  )
}