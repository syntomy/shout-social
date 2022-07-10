import ReactLoading from "react-loading";
import { useEffect } from "react";

const AuthRedirect = () => {
    useEffect(() => {
        setTimeout(() => {
            window.location.replace("/?loginSuccess");
        }, 2000);
    }, []);

    return (
        <>
            <ReactLoading type="bubbles" color="green"/>
            <div>logging you in..........</div>
        </>
    )
}

export default AuthRedirect;