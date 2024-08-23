"use client";

import { createContext, useState } from "react";

interface ContextProps {
  children: React.ReactNode;
}

export const ProfileContext = createContext({
  updated: false,
  updateProfile: () => {},
});

export default function ProfileContextProvider({ children }: ContextProps) {
  const [updated, setUpdated] = useState(false);

  const updateProfile = () => {
    setUpdated(!updated);
  };

  return (
    <ProfileContext.Provider value={{ updated, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}
