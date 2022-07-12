import "./Profile.css";
import MainLayout from "../../Layouts/MainLayout";

import { User } from "../../GlobalState/UserState";

import { Navigate } from "react-router-dom";

import { GoUnverified, GoVerified } from "react-icons/go";

import { useState, useEffect, useRef, useCallback } from "react";
import { SupabaseClient } from "../../supabaseClient";
import { toast } from "react-toastify";
import ShoutBox from "../../Components/ShoutBox/ShoutBox";

import ReactLoading from "react-loading";

function Profile() {
    const user = User.get();

    const [shouts, setShouts] = useState(null);
    const [lastIndex, setLastIndex] = useState(5);
    const [shoutsLoading, setShoutsLoading] = useState(true);
    const [revealEmail, setRevealEmail] = useState(false);

    const seeShouts = async () => {
        setShoutsLoading(true);
        const { data, error } = await SupabaseClient.from("shouts").select().eq("shouter_uuid", user.id);
        if (error) {
            toast.error("Something went wrong with fetching shouts");
            console.log(error.message);
        }
        else {
            if (data.length > 0 && data !== []) {
                setShouts(data.reverse());
            }
            else {
                setShouts(null);
            }
        };
        setShoutsLoading(false);
    };
    const loadShouts = useCallback(seeShouts, [user.id]);
    
    
    const shoutMore = () => {
        setLastIndex(lastIndex + 5);
    };
    
    let fetched = useRef(false);
    useEffect(() => {
        if (fetched.current === false) {
            fetched.current = true;
            loadShouts();
        }
    }, [fetched, loadShouts]);

    return (
        <MainLayout>
            {user ?
                <div className="profile">
                    <h1 className="title">Profile</h1>
                    <>
                        <div className="profile-info-box">
                            <div className="top-box">
                                <img src={user.user_metadata.avatar_url} alt="profile" className="profile-image" />
                                <div className="data-group">
                                    <p className="profile-tag">{user.user_metadata.name}</p>
                                    <p className="profile-info-field">{user.id}</p>
                                </div>
                            </div>
                            <div className="bottom-box">
                                <div className="info-box">
                                    <label className="profile-label">USERNAME</label>
                                    <p className="profile-info-field">{user.user_metadata.full_name}</p>
                                </div>
                                <div className="info-box email-box">
                                    <div className="typo-group">
                                        <label className="profile-label">EMAIL</label>
                                        <p className="profile-info-field">{revealEmail ? user.user_metadata.email : "*******************"}</p>
                                    </div>
                                    <button className="reveal-button" onClick={() => setRevealEmail(!revealEmail)}>{revealEmail ? "Hide" : "Reveal"}</button>
                                </div>
                                <div className="info-box">
                                    <label className="profile-label">VERIFIED</label>
                                    <p className="profile-info-field">{user.user_metadata.email_verified ? <span className="green-tag"><GoVerified /> Verified</span> : <span className="red-tag"><GoUnverified /> Unverified</span>}</p>
                                </div>
                            </div>
                        </div>
                        <h1 className="title opinions-title">Shouted opinions: </h1>
                        {shoutsLoading ?
                            <ReactLoading type="spin" color="red" />
                            :
                            <>
                                {shouts ?
                                    <>
                                        <p className="shout-count">Shouts found: <span className="shouts-amount">{shouts.length}</span></p>
                                        <ul className="shouts-list">
                                            {shouts.map((shout, index) => {
                                                if (index < lastIndex) {
                                                    return <ShoutBox shout={shout} key={index} />
                                                }
                                                else {
                                                    return <></>
                                                }
                                            })}
                                        </ul>
                                        {shouts.length > lastIndex ?
                                            <button className="show-btn" onClick={shoutMore}>Show more</button>
                                            :
                                            <></>
                                        }
                                    </>
                                    :
                                    <p>you didn't share anything yet</p>
                                }
                            </>
                        }
                    </>
                </div>
                :
                <Navigate to="/" />
            }
        </MainLayout>
    );
};

export default Profile;