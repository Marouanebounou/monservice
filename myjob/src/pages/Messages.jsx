import React, { useState, useEffect, useRef } from "react";
import { FaSearch, FaPaperclip, FaPaperPlane, FaEllipsisV, FaCheck, FaCheckDouble, FaTimes, FaArrowLeft, FaComment, FaBriefcase, FaTrash } from "react-icons/fa";
import ClientSideBar from "../components/ClientSideBar";
import io from "socket.io-client";
import axios from "axios";
import { useLocation } from "react-router-dom";

const socket = io("http://localhost:3001", {
  transports: ['websocket'],
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000
});

export default function ClientMessages() {
  const [messages, setMessages] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [posts, setPosts] = useState([]);
  const [potentialContacts, setPotentialContacts] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const messagesEndRef = useRef(null);
  const location = useLocation();
  const [longPressTimer, setLongPressTimer] = useState(null);
  const [selectedConversationToDelete, setSelectedConversationToDelete] = useState(null);

  const userId = JSON.parse(localStorage.getItem('user')).id;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Fetch posts with applications
    axios.get("http://localhost:3001/api/posts/client", {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => {
        setPosts(res.data);
        // Fetch conversations
        return axios.get("http://localhost:3001/api/conversations", {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      })
      .then(res => {
        // Map conversations to contacts for sidebar
        const mappedContacts = res.data.map(conv => {
          const other = conv.participants.find(u => u._id !== userId);
          const post = posts.find(p => p._id === conv.post);
          const application = post?.applications?.find(app => app.freelancer._id === other?._id);
          
          // Get the correct name based on role
          let otherName = 'Utilisateur';
          if (other) {
            if (other.role === 'freelancer') {
              // For freelancers, always use companyname
              otherName = other.companyname || 'Freelancer';
            } else {
              // For clients, use full name
              otherName = `${other.firstname} ${other.secondname}`;
            }
          }
          
          return {
            id: conv._id,
            name: otherName,
            avatar: other ? ((other.firstname?.[0] || '') + (other.secondname?.[0] || '') || '?') : '?',
            lastMessage: conv.messages.length > 0 ? conv.messages[conv.messages.length-1].content : '',
            time: conv.messages.length > 0 ? new Date(conv.messages[conv.messages.length-1].timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
            unread: conv.messages.filter(msg => msg.sender !== userId).length,
            online: false,
            conversation: conv,
            post: post,
            application: application,
            status: application?.status || 'pending',
            otherUser: other
          };
        });
        setContacts(mappedContacts);
        setFilteredContacts(mappedContacts);

        // If there's a conversationId in the location state, open that conversation
        if (location.state?.conversationId) {
          const conversation = mappedContacts.find(c => c.id === location.state.conversationId);
          if (conversation) {
            handleContactClick(conversation);
          } else {
            // If conversation not found in initial fetch, try to fetch it directly
            axios.get(`http://localhost:3001/api/conversations/${location.state.conversationId}`, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
              .then(convRes => {
                const conv = convRes.data;
                const other = conv.participants.find(u => u._id !== userId);
                const post = posts.find(p => p._id === conv.post);
                const application = post?.applications?.find(app => app.freelancer._id === other?._id);
                
                // Get the correct name based on role
                let otherName = 'Utilisateur';
                if (other) {
                  if (other.role === 'freelancer') {
                    // For freelancers, always use companyname
                    otherName = other.companyname || 'Freelancer';
                  } else {
                    // For clients, use full name
                    otherName = `${other.firstname} ${other.secondname}`;
                  }
                }
                
                const newContact = {
                  id: conv._id,
                  name: otherName,
                  avatar: other ? ((other.firstname?.[0] || '') + (other.secondname?.[0] || '') || '?') : '?',
                  lastMessage: conv.messages.length > 0 ? conv.messages[conv.messages.length-1].content : '',
                  time: conv.messages.length > 0 ? new Date(conv.messages[conv.messages.length-1].timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
                  unread: conv.messages.filter(msg => msg.sender !== userId).length,
                  online: false,
                  conversation: conv,
                  post: post,
                  application: application,
                  status: application?.status || 'pending',
                  otherUser: other
                };
                
                setContacts(prev => [...prev, newContact]);
                handleContactClick(newContact);
              })
              .catch(err => {
                console.error('Error fetching conversation:', err);
              });
          }
        }
      })
      .catch(err => {
        console.error('Error fetching data:', err);
        setContacts([]);
      });
  }, [location.state]);

  useEffect(() => {
    // Connect to socket when component mounts
    socket.connect();

    // Socket.io event listeners
    socket.on('connect', () => {
      console.log('Connected to socket server');
      // Join all conversation rooms
      contacts.forEach(contact => {
        socket.emit('joinRoom', contact.id);
      });
    });

    socket.on('receiveMessage', (msg) => {
      console.log('Received message:', msg);
      if (selectedContact && msg.conversationId === selectedContact.id) {
        const sender = msg.sender === userId ? 'Vous' : msg.senderName;
        setMessages(prev => [
          ...prev,
          {
            id: prev.length + 1,
            sender: sender,
            content: msg.content,
            time: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'read',
            senderId: msg.sender
          }
        ]);
        scrollToBottom();
      } else {
        // Update unread count for other conversations
        setContacts(prev => prev.map(contact => {
          if (contact.id === msg.conversationId) {
            const senderName = msg.sender === userId ? 'Vous' : msg.senderName;
            return {
              ...contact,
              unread: contact.unread + 1,
              lastMessage: `${senderName}: ${msg.content}`,
              time: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
          }
          return contact;
        }));
      }
    });

    return () => {
      // Leave all conversation rooms
      contacts.forEach(contact => {
        socket.emit('leaveRoom', contact.id);
      });
      socket.off('connect');
      socket.off('receiveMessage');
      socket.disconnect();
    };
  }, [contacts]);

  useEffect(() => {
    // Filter contacts based on search query
    const filtered = contacts.filter(contact => 
      contact.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredContacts(filtered);

    // If search query is at least 3 characters, search for potential contacts
    if (searchQuery.length >= 3) {
      setIsSearching(true);
      setSearchError(null);
      axios.get(`http://localhost:3001/api/users/search?q=${searchQuery}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
        .then(res => {
          // Filter out users who are already contacts
          const newContacts = res.data.filter(user => 
            !contacts.some(contact => contact.id === user._id)
          );
          setPotentialContacts(newContacts);
        })
        .catch(err => {
          console.error('Error searching users:', err);
          setSearchError('Erreur lors de la recherche des utilisateurs');
          setPotentialContacts([]);
        })
        .finally(() => {
          setIsSearching(false);
        });
    } else {
      setPotentialContacts([]);
      setSearchError(null);
    }
  }, [searchQuery, contacts]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() && selectedContact) {
      try {
        const res = await axios.post(
          `http://localhost:3001/api/conversations/${selectedContact.id}/message`,
          { content: newMessage },
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        const msg = res.data;
        
        // Update last message in contacts list
        setContacts(prev => prev.map(contact => {
          if (contact.id === selectedContact.id) {
            return {
              ...contact,
              lastMessage: msg.content,
              time: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
          }
          return contact;
        }));

        setNewMessage("");
        scrollToBottom();
      } catch (err) {
        console.error('Error sending message:', err);
        alert('Erreur lors de l\'envoi du message.');
      }
    }
  };

  const handleContactClick = (contact) => {
    setSelectedContact(contact);
    setShowChat(true);
    setMessages(contact.conversation.messages.map((msg, idx) => {
      const sender = msg.sender === userId ? 'Vous' : contact.name;
      return {
        id: idx + 1,
        sender: sender,
        content: msg.content,
        time: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'read',
        senderId: msg.sender
      };
    }));
    setContacts(prev => prev.map(c => c.id === contact.id ? { ...c, unread: 0 } : c));
    socket.emit('joinRoom', contact.id);
    scrollToBottom();
  };

  const handleCloseChat = () => {
    setShowChat(false);
    setSelectedContact(null);
  };

  const startNewConversation = async (userId, postId) => {
    try {
      // First, check if a conversation already exists with this user and post
      const existingConversation = contacts.find(contact => 
        contact.conversation.participants.some(p => p._id === userId) && 
        contact.conversation.post === postId
      );

      if (existingConversation) {
        // If conversation exists, just open it
        handleContactClick(existingConversation);
        return;
      }

      // Create new conversation
      const res = await axios.post(
        'http://localhost:3001/api/conversations',
        { 
          participant: userId,
          post: postId,
          message: "Bonjour, je souhaite discuter avec vous."
        },
        { 
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!res.data || !res.data._id) {
        throw new Error('Invalid response from server');
      }

      // Add the new conversation to contacts
      const newContact = {
        id: res.data._id,
        name: `${res.data.participants[0].firstname} ${res.data.participants[0].secondname}`,
        avatar: (res.data.participants[0].firstname?.[0] || '?') + (res.data.participants[0].secondname?.[0] || ''),
        lastMessage: res.data.messages[0]?.content || '',
        time: res.data.messages[0]?.timestamp ? new Date(res.data.messages[0].timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
        unread: 0,
        online: false,
        conversation: res.data,
        post: posts.find(p => p._id === postId),
        otherUser: res.data.participants.find(p => p._id !== userId)
      };
      
      setContacts(prev => [...prev, newContact]);
      setFilteredContacts(prev => [...prev, newContact]);
      setPotentialContacts([]);
      setSearchQuery('');
      handleContactClick(newContact);
    } catch (err) {
      console.error('Error starting conversation:', err);
      alert(err.response?.data?.error || 'Erreur lors de la création de la conversation. Veuillez réessayer.');
    }
  };

  const handleLongPress = (contact) => {
    setSelectedConversationToDelete(contact);
  };

  const handleDeleteConversation = async () => {
    if (!selectedConversationToDelete) return;

    try {
      await axios.delete(`http://localhost:3001/api/conversations/${selectedConversationToDelete.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      // Remove the conversation from contacts
      setContacts(prev => prev.filter(c => c.id !== selectedConversationToDelete.id));
      setFilteredContacts(prev => prev.filter(c => c.id !== selectedConversationToDelete.id));
      
      // If the deleted conversation was selected, clear the selection
      if (selectedContact?.id === selectedConversationToDelete.id) {
        setSelectedContact(null);
        setShowChat(false);
        setMessages([]);
      }

      setSelectedConversationToDelete(null);
    } catch (err) {
      console.error('Error deleting conversation:', err);
      alert('Erreur lors de la suppression de la conversation.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex">
        <ClientSideBar />

        {/* Main Content */}
        <div className="flex-1 md:ml-64">
          <div className="flex h-screen">
            {/* Contacts List */}
            <div className={`w-full md:w-1/3 border-r border-gray-200 bg-white transform transition-transform duration-300 ease-in-out ${
              showChat ? 'hidden md:block' : 'block'
            }`}>
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Messages</h2>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Rechercher une conversation ou une personne..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-200"
                  />
                  <FaSearch className="absolute left-3 top-3 text-gray-400" />
                </div>
              </div>

              <div className="overflow-y-auto h-[calc(100vh-73px)]">
                {/* Existing Conversations */}
                {filteredContacts.length > 0 && (
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Conversations</h3>
                    {filteredContacts.map(contact => (
                      <div
                        key={contact.id}
                        className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors duration-200 ${
                          selectedContact?.id === contact.id ? 'bg-teal-50' : ''
                        }`}
                        onClick={() => handleContactClick(contact)}
                        onMouseDown={() => {
                          const timer = setTimeout(() => handleLongPress(contact), 500);
                          setLongPressTimer(timer);
                        }}
                        onMouseUp={() => {
                          if (longPressTimer) {
                            clearTimeout(longPressTimer);
                            setLongPressTimer(null);
                          }
                        }}
                        onMouseLeave={() => {
                          if (longPressTimer) {
                            clearTimeout(longPressTimer);
                            setLongPressTimer(null);
                          }
                        }}
                        onTouchStart={() => {
                          const timer = setTimeout(() => handleLongPress(contact), 500);
                          setLongPressTimer(timer);
                        }}
                        onTouchEnd={() => {
                          if (longPressTimer) {
                            clearTimeout(longPressTimer);
                            setLongPressTimer(null);
                          }
                        }}
                      >
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
                              <span className="text-teal-600 font-medium">{contact.avatar}</span>
                            </div>
                            {contact.online && (
                              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium text-gray-900 truncate">{contact.name}</h3>
                              <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{contact.time}</span>
                            </div>
                            {contact.post && (
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <FaBriefcase className="text-teal-500" />
                                <span className="truncate">{contact.post.title}</span>
                              </div>
                            )}
                            <p className="text-sm text-gray-500 truncate">{contact.lastMessage}</p>
                          </div>
                          {contact.unread > 0 && (
                            <div className="w-5 h-5 rounded-full bg-teal-600 text-white text-xs flex items-center justify-center">
                              {contact.unread}
                            </div>
                          )}
                          {contact.status === 'accepted' && (
                            <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                              Accepté
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Search Results */}
                {searchQuery.length >= 3 && (
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Résultats de recherche</h3>
                    {isSearching ? (
                      <div className="p-4 text-center text-gray-500">
                        Recherche en cours...
                      </div>
                    ) : searchError ? (
                      <div className="p-4 text-center text-red-500">
                        {searchError}
                      </div>
                    ) : potentialContacts.length > 0 ? (
                      potentialContacts.map(user => (
                        <div
                          key={user._id}
                          className="p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
                              <span className="text-teal-600 font-medium">
                                {(user.firstname?.[0] || '?') + (user.secondname?.[0] || '')}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-gray-900">
                                {user.firstname} {user.secondname}
                              </h3>
                              <p className="text-sm text-gray-500">Cliquez pour démarrer une conversation</p>
                            </div>
                            <button
                              onClick={() => startNewConversation(user._id, posts[0]?._id)}
                              className="px-3 py-1 bg-teal-500 text-white rounded-full text-sm hover:bg-teal-600 transition-colors"
                            >
                              Parler
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        Aucun utilisateur trouvé
                      </div>
                    )}
                  </div>
                )}

                {filteredContacts.length === 0 && searchQuery.length < 3 && (
                  <div className="p-4 text-center text-gray-500">
                    Aucune conversation
                  </div>
                )}
              </div>
            </div>

            {/* Chat Area */}
            {showChat && selectedContact && (
              <div className="w-full md:w-2/3 flex flex-col bg-white">
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      className="md:hidden text-gray-500 hover:text-gray-700"
                      onClick={handleCloseChat}
                    >
                      <FaArrowLeft />
                    </button>
                    <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                      <span className="text-teal-600 font-medium">{selectedContact.avatar}</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{selectedContact.name}</h3>
                      {selectedContact.post && (
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <FaBriefcase className="text-teal-500" />
                          <span>{selectedContact.post.title}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <button className="text-gray-500 hover:text-gray-700">
                    <FaEllipsisV />
                  </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'Vous' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.sender === 'Vous'
                            ? 'bg-teal-500 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <div className="flex items-center justify-end gap-1 mt-1">
                          <span className="text-xs opacity-75">{message.time}</span>
                          {message.sender === 'Vous' && (
                            <span className="text-xs">
                              {message.status === 'sent' ? <FaCheck /> : <FaCheckDouble />}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <button
                      type="button"
                      className="p-2 text-gray-500 hover:text-gray-700"
                    >
                      <FaPaperclip />
                    </button>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Tapez votre message..."
                      className="flex-1 rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <button
                      type="submit"
                      className="p-2 text-teal-500 hover:text-teal-600"
                    >
                      <FaPaperPlane />
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {selectedConversationToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Supprimer la conversation
            </h3>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer la conversation avec {selectedConversationToDelete.name} ?
              Cette action est irréversible.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setSelectedConversationToDelete(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteConversation}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2"
              >
                <FaTrash />
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}