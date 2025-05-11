import React, { useEffect, useState } from 'react';
import './AllContacts.css'
import axios from 'axios'
import DeleteIcon from '@mui/icons-material/Delete';
import { AllContactProps, Contact } from '../../Interface/contactInterface/NewContactInterface';
import toast from 'react-hot-toast';

const AllContacts: React.FC<AllContactProps> = ({user, setIsAllContact, setSelectedContact}) => {
    
  const [allContacts, setIsAllContacts] = useState([]);
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const result = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/allContacts/${user?.id}`, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
        if(result){
          setIsAllContacts(result?.data?.data)
        }
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    }
    fetchContacts();
  }, [user])
  
  const handleContact = async (contact:Contact)  => {
    setSelectedContact(contact)
    setIsAllContact(false)
  }

  const handleContactDelete = async (contact: Contact) => {
    const contactDeleted = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/deleteContact/${contact?.id}`,{
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true
    })
    
    if(contactDeleted.status === 200) {
      setIsAllContacts((prevContacts) => prevContacts.filter((c: Contact) => c.id !== contact.id));
      toast.success("Contact Deleted Successfully", {
        duration: 2000,
      })
    }
    else {
      toast.error("Unable to delete contact", {
        duration: 2000,
      });
    }

  }

  return (
  <div className="AllContacts">
    <h2>All Contacts</h2>
    <ul>
      {allContacts.map((contact: Contact) => (
        <div className="contactListDiv" key={contact.id}>
          <li className="contactli" onClick={() => handleContact(contact)}>
            {contact.name}
          </li>
          <div onClick={() => handleContactDelete(contact)}>
            <DeleteIcon />
          </div>
        </div>
      ))}
    </ul>
  </div>
);

}

export default AllContacts
