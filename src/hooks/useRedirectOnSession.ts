import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "../context/SessionContext";

const useRedirectOnSession = () => {
  const { session } = useSession();
};

export default useRedirectOnSession;
