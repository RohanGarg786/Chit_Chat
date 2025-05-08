import { User } from "../userInterface/user";

export interface Contact {
  id: number;
  name: string;
  phoneNumber: string;
  userId: string;
  contactId: string;
};

export interface AddNewContactProps {
    user: User | null;
    setIsOpen: (isOpen: boolean) => void;
  }

export interface AllContactProps {
  user: User | null;
  setIsAllContact: (isAllContact: boolean) => void;
  setSelectedContact: (selectedContact: Contact | null) => void;
}