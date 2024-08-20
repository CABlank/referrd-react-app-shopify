import { useSession } from "../context/SessionContext";
var useRedirectOnSession = function () {
    var session = useSession().session;
};
export default useRedirectOnSession;
