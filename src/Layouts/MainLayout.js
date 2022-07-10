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
import ReactLoading from "react-loading";

Modal.setAppElement('#root');

function MainLayout({ children }) {
    const [query, setQuery] = useSearchParams();

    const [authModalIsOpen, setAuthModal] = useState(false);
    const [shoutModalIsOpen, setShoutModal] = useState(false);
    const [shoutModalLoading, setShoutModalLoading] = useState(false);
    const [shoutContent, setShout] = useState("");

    const user = User.use();

    const signIn = async () => {
        await SupabaseClient.auth.signIn({
            provider: "discord"
        }, { redirectTo: "http://localhost:3000/auth/redirect" });
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

    const shoutPost = async () => {
        if(shoutContent.length > 3 && shoutContent.length < 500)
        {
            setShoutModalLoading(true);
            const { error } = await SupabaseClient.from("shouts").insert({
                content: shoutContent,
                shouter_uuid: user.id,
                shouter_username: user.user_metadata.name,
                shouter_avatar_url: user.user_metadata.avatar_url
            });
            if(error)
            {
                toast.error("Something went wrong with posting the shout..");
                console.log(error.message);
            }
            else
            {
                toast.success("Posted your shout successfully!");
            }
            setShoutModalLoading(false);
            setShout("");
            setShoutModal(false);
        }
        else
        {
            toast.error("Your shout has to be more than 3 letters and less than 500 letters!");
        };
    };

    const openAuthModal = () => {
        setAuthModal(true);
    };
    const closeAuthModal = () => {
        setAuthModal(false);
    };
    const openShoutModal = () => {
        setShoutModal(true);
    };
    const closeShoutModal = () => {
        setShoutModal(false);
    };

    useEffect(() => {
        if (user === null) {
            if (SupabaseClient.auth.user() != null) {
                user.set(SupabaseClient.auth.user());
            }
        }
        const loginSuccess = query.has("loginSuccess");
        if (loginSuccess) {
            toast.success("Successfully logged in with discord!");
            query.delete("loginSuccess");
            setQuery(query);
        };
    }, [query, setQuery, user]);

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
                                <li className="action"><button className="shout-button" onClick={openShoutModal}><IoMdCreate /> Shout an opinion</button></li>
                                <li className="action"><button className="logout-btn" onClick={logout}><MdExitToApp /> Logout</button></li>
                            </>
                            :
                            <>
                                <li className="action"><button className="auth-button" onClick={openAuthModal}><RiAccountCircleFill /> Signup / Login</button></li>
                            </>
                        }
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
                        <button className="close-button" onClick={closeAuthModal}>X</button>
                    </div>
                </div>
                <div className="modal-content">
                    <button className="discord-button" onClick={signIn}><FaDiscord /> Continue with discord</button>
                </div>
            </Modal>
            <Modal
                isOpen={shoutModalIsOpen}
                onRequestClose={closeShoutModal}
                contentLabel="Shout Modal"
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
                <div className="shout-modal">
                    {shoutModalLoading ?
                        <ReactLoading type="bubbles" color="red" />
                        :
                        <>
                            <div className="top-bar">
                                <div className="typography">
                                    <h2>Shout an opinion</h2>
                                    <p>you can shout out an opinion publicly so everybody can see it</p>
                                </div>
                                <button className="close-button" onClick={closeShoutModal}>X</button>
                            </div>
                            <div className="modal-content">
                                <textarea minLength={5} maxLength={500} className="shout-text" value={shoutContent} onChange={(e) => setShout(e.target.value)} />
                                <button className="shout-button" onClick={shoutPost}>Shout it</button>
                            </div>
                        </>
                    }
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