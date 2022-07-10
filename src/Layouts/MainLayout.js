import "./MainLayout.css";
import { Link, useSearchParams } from "react-router-dom";

import { useState, useEffect } from "react";

import { IoMdCreate } from "react-icons/io";
import { AiFillHome } from "react-icons/ai";
import { BsFillPersonFill } from "react-icons/bs";
import { RiAccountCircleFill } from "react-icons/ri";
import { MdExitToApp } from "react-icons/md";
import { FaDiscord } from "react-icons/fa";

import { User } from "../GlobalState/UserState";
import { SupabaseClient } from "../supabaseClient";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Modal from "react-modal";

function MainLayout({ children }) {
    const [query, setQuery] = useSearchParams();

    const [authModalIsOpen, setAuthModal] = useState(false);
    const user = User.use();

    const signIn = async () => {
        await SupabaseClient.auth.signIn({
            provider: "discord"
        }, {redirectTo: "http://localhost:3000/auth/redirect"});
    };

    const logout = async () => {
        const { error } = await SupabaseClient.auth.signOut();
        if (error) {
            toast.error("Could not signout!");
            console.log(error.message);
        }
        else {
            toast.success("Logged out successfully!");
            User.set(null);
        }
    };

    const openAuthModal = () => {
        setAuthModal(true);
    };

    const closeAuthModal = () => {
        setAuthModal(false);
    };

    useEffect(() => {
        const loginSuccess = query.has("loginSuccess");
        if(loginSuccess)
        {
            toast.success("Successfully logged in with discord!");
            query.delete("loginSuccess");
            setQuery(query);
        };
    }, [query, setQuery]);

    return (
        <div className="app">
            <div className="sidebar">
                <div className="top-area">
                    <h1 className="logo">Shout</h1>
                    <p className="small-credits">by syntomy#0007</p>
                </div>
                <div className="actions-area">
                    <ul className="actions-list">
                        <li className="action"><Link to="/"><AiFillHome /> Home</Link></li>
                        {user ?
                            <>
                                <li className="action"><Link to="/profile"><BsFillPersonFill /> Profile</Link></li>
                                <li className="action"><button className="logout-btn" onClick={logout}><MdExitToApp /> Logout</button></li>
                            </>
                            :
                            <>
                                <li className="action"><button className="auth-button" onClick={openAuthModal}><RiAccountCircleFill /> Signup / Login</button></li>
                            </>
                        }
                        <li className="action"><button className="shout-button"><IoMdCreate /> Shout an opinion</button></li>
                    </ul>
                </div>
            </div>
            <Modal
                isOpen={authModalIsOpen}
                onRequestClose={closeAuthModal}
                contentLabel="Authentication Modal"
                style={{
                    content: {
                        top: "50%",
                        left: "50%",
                        right: "auto",
                        bottom: "auto",
                        marginRight: "-50%",
                        transform: "translate(-50%, -50%)",
                    }
                }}  
            >
                <div className="auth-modal">
                    <div className="top-bar">
                        <div className="typography">
                            <h2>Sign in</h2>
                            <p>i only use your discord username and avatar</p>
                        </div>
                        <button class="close-button" onClick={closeAuthModal}>X</button>
                    </div>
                    <button className="discord-button" onClick={signIn}><FaDiscord /> Continue with discord</button>
                </div>
            </Modal>
            <div className="content">
                {children}
            </div>
            <ToastContainer
                position="bottom-left"
            />
        </div>
    )
}

export default MainLayout;