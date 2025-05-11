import React, { FormEvent, useState } from "react";
import {
  Button,
  Typography,
  TextField,
  Box,
  Paper,
  IconButton,
} from "@mui/material";
import { AddNewContactProps } from "../../Interface/contactInterface/NewContactInterface";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import toast from "react-hot-toast";

const AddNewContact: React.FC<AddNewContactProps> = ({ user, setIsOpen }) => {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");

  const userId = user?.id;

  const handleAddNewContact = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const addContact = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/addNewContact/${userId}`,
        { phone, name },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log("Contact Added Successfully");
      setIsOpen(false);

      if (addContact.status === 200) {
        toast.success("Contact Added Successfully", {
          duration: 2000,
        })
      }
      else {
        toast.error("Unable to add contact", {
          duration: 2000,
        });
      }
    } catch (error: unknown) {
      console.log("Unable to add Contact", error);
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || "Unable to add contact";
        toast.error(message, { duration: 2000 });
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        bgcolor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1300,
        p: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: "100%",
          maxWidth: 400,
          p: 4,
          borderRadius: 3,
          position: "relative",
          bgcolor: "#fff",
        }}
      >
        <IconButton
          onClick={() => setIsOpen(false)}
          sx={{ position: "absolute", top: 10, right: 10 }}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h5" fontWeight={600} gutterBottom>
          Add New Contact
        </Typography>

        <form onSubmit={handleAddNewContact}>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Phone Number"
            fullWidth
            margin="normal"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            inputProps={{ pattern: "[0-9+\\- ]{10,15}" }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Add Contact
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default AddNewContact;
