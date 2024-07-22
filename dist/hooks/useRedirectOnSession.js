import { useSession } from "../contexts/SessionContext";
var useRedirectOnSession = function () {
    var session = useSession().session;
};
export default useRedirectOnSession;
