import "./AuthRedirect.css";
import ReactLoading from "react-loading";
import { useEffect } from "react";

import { ImCheckmark } from "react-icons/im";

const AuthRedirect = () => {
    useEffect(() => {
        setTimeout(() => {
            window.location.replace("/?loginSuccess");
        }, 2000);
    }, []);

    return (
        <div className="redirect-page">
            <div className="text"><ImCheckmark className="text-icon" /> Redirecting you</div>
            <ReactLoading type="spin" color="green"/>
        </div>
    );
};

export default AuthRedirect;