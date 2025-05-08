import React, { FormEvent, useState } from "react";
import "./AddNewContact.css";
import { Button, Typography } from "@mui/material";
import axios from "axios";
import { AddNewContactProps } from "../../Interface/contactInterface/NewContactInterface";

const AddNewContact: React.FC<AddNewContactProps> = ( {user,setIsOpen} ) => {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');

  const userId = user?.id
  const handleAddNewContact = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const addContact = await  axios.post(`http://localhost:8000/api/v1/user/addNewContact/${userId}`,{phone,name},{
      headers:{
          'Content-Type':'application/json'
      },
      withCredentials: true // Allows cookies to be sent and received
  })

  setIsOpen(false)
  if(addContact) {
    console.log("Contact Added Successfully")
  }
  else{
    console.log("Unable to add Contact")
  }
  }

  return (
      <div className="innerBox">
       <form onSubmit={handleAddNewContact}>
       <Typography
          variant="h6"
          style={{ fontWeight: "600" }}
        >
          Enter Name
        </Typography>
        <input
          type="name"
          placeholder="Enter Your Friend's Name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Typography
          variant="h6"
          style={{ fontWeight: "600" }}
        >
          Add Phone Number
        </Typography>
        <input
          type="phone"
          placeholder="+91 99xxx-xxxxx"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <Button type="submit" variant="contained">Add Contact</Button>
       </form>
    </div>
  );
};

export default AddNewContact;
