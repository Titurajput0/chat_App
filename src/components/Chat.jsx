import React, { useState, useEffect, useRef } from 'react'
import { db } from '../firebase/config'
import { doc, onSnapshot, updateDoc, arrayUnion } from 'firebase/firestore'

const Chat = ({ roomId, user }) => {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    const roomRef = doc(db, 'rooms', roomId)
    const unsubscribe = onSnapshot(roomRef, (doc) => {
      if (doc.exists()) {
        setMessages(doc.data().messages || [])
      }
    })

    return () => unsubscribe()
  }, [roomId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || sending) return

    setSending(true)
    try {
      await updateDoc(doc(db, 'rooms', roomId), {
        messages: arrayUnion({
          text: newMessage,
          sender: user.uid,
          timestamp: new Date(),
          isSystem: false
        })
      })
      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>Chat</h3>
      </div>
      
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="no-messages">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div 
              key={index} 
              className={`message ${message.sender === user.uid ? 'own-message' : 'other-message'}`}
            >
              <div className="message-content">
                {message.text}
              </div>
              <div className="message-time">
                {new Date(message.timestamp?.toDate?.() || message.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="message-form">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="message-input"
          disabled={sending}
        />
        <button 
          type="submit" 
          disabled={sending || !newMessage.trim()}
          className="send-button"
        >
          {sending ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  )
}

export default Chat