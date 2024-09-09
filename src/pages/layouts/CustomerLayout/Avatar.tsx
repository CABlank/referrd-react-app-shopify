import React from "react";
import { useSession } from "../../../context/SessionContext";

const Avatar: React.FC = () => {
  const { name } = useSession();

  // Function to get the first two initials from the user's first name
  const getInitials = (name: string | undefined) => {
    if (!name) return "NN";
    return name.slice(0, 2).toUpperCase(); // Return only the first two characters
  };

  const initials = getInitials(name);

  return (
    <div className="w-10 h-10 rounded-full bg-[#851087] flex items-center justify-center text-white font-bold text-lg shadow-md">
      {initials}
    </div>
  );
};

export default Avatar;
