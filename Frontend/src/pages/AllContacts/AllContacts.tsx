import React, { useEffect, useState } from 'react';
import './AllContacts.css'
import axios from 'axios'
import DeleteIcon from '@mui/icons-material/Delete';
import { AllContactProps, Contact } from '../../Interface/contactInterface/NewContactInterface';

const AllContacts: React.FC<AllContactProps> = ({user, setIsAllContact, setSelectedContact}) => {
    
  const [allContacts, setIsAllContacts] = useState([]);
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const result = await axios.get(`http://localhost:8000/api/v1/user/allContacts/${user?.id}`, {
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
    await axios.delete(`http://localhost:8000/api/v1/user/deleteContact/${contact?.id}`,{
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true
    })
  }

  return (
    <div style={{position:'absolute', left:'20px', height: '100%'}}>
      <h2 style={{left: '0', top: '10px'}}>All Contacts</h2>
      <ul style={{left: '1px', padding: '0px'}}>
        {allContacts.map((contact: Contact) => (
         <div className='contactListDiv'>
          <li className='contactli' key={contact.id} onClick={() => handleContact(contact)} >{contact.name} </li>
          <div onClick={() => handleContactDelete(contact)}>
          <DeleteIcon />
          </div>
         </div>
        ))}
      </ul>
    </div>
    // allContacts.map((item: any) => {
    //   <div className='AllContact'>
    //   <div className='contactImage'>image</div>
    //   <div className='contactName'>name</div>
    // </div>
    // })
  )
}

export default AllContacts
