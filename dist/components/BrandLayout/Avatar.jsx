import React from "react";
import { useSession } from "../../contexts/SessionContext";
var Avatar = function () {
    var name = useSession().name;
    // Function to get the first two initials from the user's first name
    var getInitials = function (name) {
        if (!name)
            return "NN";
        return name.slice(0, 2).toUpperCase(); // Return only the first two characters
    };
    var initials = getInitials(name);
    return (<div className="w-10 h-10 rounded-full bg-[#851087] flex items-center justify-center text-white font-bold text-lg shadow-md">
      {initials}
    </div>);
};
export default Avatar;
