import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "../contexts/SessionContext";

const useRedirectOnSession = () => {
  const { session } = useSession();
};

export default useRedirectOnSession;
