import "./Profile.css";
import MainLayout from "../../Layouts/MainLayout";

import { User } from "../../GlobalState/UserState";

import { Navigate } from "react-router-dom";

function Profile()
{
    const user = User.get();

    return (
        <MainLayout>
            {user ? 
                <div>{user.user_metadata.name}</div>
            :
                <Navigate to="/" />
            }
        </MainLayout>
    );
};

export default Profile;