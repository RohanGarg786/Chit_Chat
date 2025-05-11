import { useContext, useEffect, useRef, useState } from "react";
import "./Home.css";
import { Avatar } from "@mui/material";
import axios from "axios";
import { Socket, io } from "socket.io-client";
import AddNewContact from "../../pages/AddNewContact/AddNewContact";
import AllContacts from "../../pages/AllContacts/AllContacts";
import { GlobalStateContext } from "../../components/ContextApi/GlobalStateProvide";
import { User } from "../../Interface/userInterface/user";
import { Contact } from "../../Interface/contactInterface/NewContactInterface";
import { MessageInterface } from "../../Interface/chatInterface";
import Picker, { EmojiClickData } from "emoji-picker-react";
import { useDebounce } from 'use-debounce'; 
import { 
  MessageSquare, 
  MoreVertical, 
  Search, 
  Video, 
  Smile, 
  Paperclip, 
  Send, 
  Mic, 
  X, 
  CheckCheck
} from 'lucide-react';
import Speech from "../../components/SpeechRecognition";

const Home = () => {
  const [results, setResult] = useState<MessageInterface>();
  const [emoji, setEmoji] = useState("");
  const [selectEmoji, setselectEmoji] = useState(false);
  const [allContacts, setAllContacts] = useState<Contact[] | undefined>();
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isAllContact, setIsAllContact] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [vertIconClick, setVertIconClick] = useState(false);
  const socket = useRef<Socket | null>(null);
  const [speechToggle, setSpeechToggle] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  const [showChatPanel, setShowChatPanel] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch] = useDebounce(searchQuery, 300);


  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      console.log("Selected file:", selectedFile);
    }
  };
  
  // Add responsive layout handling
  useEffect(() => {
    const handleResize = () => {
      const mobileView = window.innerWidth <= 768;
      setIsMobileView(mobileView);
      
      // On larger screens, always show both panels
      if (!mobileView) {
        setShowChatPanel(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Select contact handler for mobile
  const handleContactSelect = (contact: Contact) => {
    setSelectedContact(contact);
    if (isMobileView) {
      setShowChatPanel(true);
    }
  };
  
  // Back button handler for mobile
  const handleBackToContacts = () => {
    setShowChatPanel(false);
  };

  useEffect(() => {
    // Initialize socket only once
    socket.current = io(`${import.meta.env.VITE_BACKEND_URL}`);

    return () => {
      // Clean up socket connection when component unmounts
      socket.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (user?.id && selectedContact?.contactId) {
      const roomId =
        String(user.id) < String(selectedContact.contactId)
          ? `${user.id}_${selectedContact.contactId}`
          : `${selectedContact.contactId}_${user.id}`;

      socket.current?.emit("join-room", roomId);
    }
  }, [user, selectedContact]);

  // Scroll to bottom whenever new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [results?.messages]);

  function handleClick() {
     if (!message.trim()) return;
    if (user?.id && selectedContact?.id) {
      const roomId =
        String(user.id) < String(selectedContact.contactId)
          ? `${user.id}_${selectedContact.contactId}`
          : `${selectedContact.contactId}_${user.id}`;

      socket.current?.emit("join-room", roomId);
      const timeStamp = new Date().toISOString();
      socket.current?.emit(
        "send-message",
        {
          selectedContact: selectedContact,
          content: message,
          timeStamp: timeStamp,
        },
        roomId
      );
      setMessage("");
    }
  }

  useEffect(() => {
    if (user?.id && selectedContact?.contactId) {
      socket.current?.on("emit-message", (newMessage) => {
        setResult((oldResult) => {
          const newResult = structuredClone(oldResult) || {};

          if (!newResult.messages) {
            newResult.messages = [];
          }

          newResult?.messages?.push({
            chatsId: "",
            content: newMessage.content,
            createdAt: newMessage.timeStamp,
            id: "",
            isRead: false,
            receiverId: newMessage.selectedContact.contactId,
            senderId: newMessage.selectedContact.userId,
            updatedAt: "",
          });

          return newResult;
        });
      });

      return () => {
        socket.current?.off("emit-message");
      };
    }
  }, [user, selectedContact, results]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      setUser(data.data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (user) {
      const fetchContacts = async () => {
        const result = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/allContacts/${user?.id}`
        );

        if (result) {
          setAllContacts(result.data.data);
          setEmoji(getRandomEmoji());
        }
      };

      fetchContacts();
    }
  }, [user]);

  useEffect(() => {
    if (user && selectedContact) {
      const fetchData = async () => {
        const result = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/allMessages/${user?.id}/${selectedContact?.contactId}`
        );

        if (result) {
          setResult(result.data);
        }
      };
      fetchData();
    }
  }, [user, selectedContact]);

  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error("useGlobalState must be used within a GlobalStateProvider");
  }

  const onEmojiClick = (emojiObject: EmojiClickData) => {
    setMessage((prevMsg) => prevMsg + emojiObject.emoji);
    if (isMobileView) {
      setselectEmoji(false);
    }
  };

  const filteredContacts = allContacts?.filter((contact) =>
    contact.name.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const { avatar } = context;

  // Temporary function until actual implementation is provided
  const getRandomEmoji = () => {
    const emojis = ["🙂", "😊", "🎉", "👋", "💬", "✨", "🔥", "👍"];
    return emojis[Math.floor(Math.random() * emojis.length)];
  };

  const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${
    selectedContact?.name ? selectedContact?.name : "username"
  }`;

  return (
    <div className="home">
      {/* Left Panel - Contacts */}
      <div className={`homeleft ${isMobileView && showChatPanel ? 'hidden' : ''}`}>
        <div className="leftUpperPanel">
          <h2>Chats</h2>
          <div className="sidebar">
            <MessageSquare className="add-icon" />
            <div className="more-icon-container" onClick={() => setVertIconClick(!vertIconClick)}>
              <MoreVertical className="more-icon" />
              {vertIconClick && (
                <div className="vertIconSelectBox">
                  <div className="vertIconItems" onClick={() => setIsOpen(!isOpen)}>
                    Add new contact
                  </div>
                  <div className="vertIconItems">Theme</div>
                  <div className="vertIconItems">Settings</div>
                  <div className="vertIconItems" onClick={() => setIsAllContact(!isAllContact)}>
                    All Contacts
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="leftSearch">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="leftFilter">
          <button className="filter-active">All</button>
          <button>Unread</button>
          <button>Favourites</button>
          <button>Groups</button>
        </div>
        
        <div className="leftBottomPanel">
          {filteredContacts && filteredContacts.length > 0 ? (
            filteredContacts.map((contact: Contact, index) => (
              <div
                key={index}
                className={`contactList ${selectedContact?.id === contact.id ? 'active' : ''}`}
                onClick={() => handleContactSelect(contact)}
              >
                <span className="contactListDp">
                  <Avatar
                    src={`https://avatar.iran.liara.run/public/boy?username=${contact?.name}`}
                    alt={contact?.name}
                  />
                </span>
                <div className="contactListInfo">
                  <span className="contactListName">{contact?.name}</span>
                  <span className="contactListLastMessage">Tap to chat</span>
                </div>
                <div className="contactListMeta">
                  <span className="contactListTime">Now</span>
                  <span className="contactListEmoji">{emoji}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="no-contacts">
              <p>No Contacts</p>
              <button className="add-contact-btn" onClick={() => setIsOpen(true)}>
                Add Contact
              </button>
            </div>
          )}
        </div>

        {isOpen && (
          <div className="AddNewContact">
            <AddNewContact user={user} setIsOpen={setIsOpen} />
          </div>
        )}
        
        {isAllContact && (
          <div className="AllContacts">
            <div className="close-btn" onClick={() => setIsAllContact(false)}>
              <X size={24} />
            </div>
            <AllContacts
              user={user}
              setIsAllContact={setIsAllContact}
              setSelectedContact={setSelectedContact}
            />
          </div>
        )}
      </div>

      {/* Right Panel - Chat */}
      <div className={`homeright ${isMobileView && !showChatPanel ? 'hidden' : ''}`}>
        <div className="upperPanel">
          <div style={{ display: "flex" }}>
            {isMobileView && (
            <button className="back-button" onClick={handleBackToContacts}>
              <X size={24} />
            </button>
          )}
          
          <div className="upperPanelRight">
            <Avatar
              src={boyProfilePic}
              alt="User"
            />
            <div className="user-info">
              <h3>{selectedContact?.name || "Select a contact"}</h3>
              <p className="user-status">
                {selectedContact ? "Online" : "No contact selected"}
              </p>
            </div>
          </div>
          </div>
          
          <div className="upperPanelLeft">
            <Video className="panel-icon" />
            <Search className="panel-icon" />
            <MoreVertical className="panel-icon" />
          </div>
        </div>

        {/* Middle Panel For Messages */}
        <div className="rightMiddlePanel" ref={chatContainerRef}>
          {selectedContact ? (
            <ul className="msgss">
              {results?.messages?.map((message, index) => {
                const createdAtDate = new Date(message.createdAt);
                const formattedTime = createdAtDate.toLocaleTimeString(
                  "en-US",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  }
                );

                if (message?.senderId === user?.id) {
                  return (
                    <li key={index} className="sender">
                      <div className="message-content">
                        <span className="message-text">{message.content}</span>
                        <div className="message-meta">
                          <span className="messageTime">{formattedTime}</span>
                          <CheckCheck size={14} className="read-receipt" />
                        </div>
                      </div>
                    </li>
                  );
                } else {
                  return (
                    <li key={index} className="receiver">
                      <div className="message-content">
                        <span className="message-text">{message.content}</span>
                        <span className="messageTime">{formattedTime}</span>
                      </div>
                    </li>
                  );
                }
              })}
            </ul>
          ) : (
            <div className="no-chat-selected">
              <div className="no-chat-content">
                <MessageSquare size={64} className="no-chat-icon" />
                <h3>No chat selected</h3>
                <p>Select a contact to start chatting</p>
              </div>
            </div>
          )}
          
          {selectEmoji && (
            <div className="emojiPicker">
              <Picker
                onEmojiClick={onEmojiClick}
                width={isMobileView ? "300px" : "350px"}
                height="350px"
              />
            </div>
          )}
        </div>
        
        {selectedContact && (
          <div className="rightBottomPanel">
            <div className="message-input-container">
              <div className="icons">
                <button className="icon-btn" onClick={() => setselectEmoji(!selectEmoji)}>
                  <Smile className="message-icon" />
                </button>
                <button className="icon-btn" onClick={handleIconClick}>
                  <Paperclip className="message-icon" />
                </button>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
              </div>
              
              <input
                type="text"
                placeholder="Type a message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleClick();
                  }
                }}
              />
              
              {message === "" || speechToggle ? (
                <button className="send-btn" onClick={() => setSpeechToggle(!speechToggle)}>
                  <Speech speechToggle={speechToggle} setMessage={setMessage} />
                </button>
              ) : (
                <button className="send-btn" onClick={handleClick}>
                  <Send className="send-icon" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;