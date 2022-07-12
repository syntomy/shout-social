import "./Home.css";
import MainLayout from "../../Layouts/MainLayout";

import { useState, useEffect, useRef } from "react";
import { SupabaseClient } from "../../supabaseClient";
import { toast } from "react-toastify";

import ReactLoading from "react-loading";

import { BiRefresh } from "react-icons/bi";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";

import ShoutBox from "../../Components/ShoutBox/ShoutBox";

function Home() {
  const [shouts, setShouts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stopIndex, setStopIndex] = useState(5);
  const [announcement, setAnnouncement] = useState(null);

  const showMore = () => {
    setStopIndex(stopIndex + 5);
  };

  const fetchShouts = async () => {
    setLoading(true);
    setStopIndex(5);
    const { data, error } = await SupabaseClient.from("shouts").select();
    if (error) {
      toast.error("Something went wrong with fetching shouts.");
      console.log(error.message);
    }
    else {
      if (data.length > 0 && data !== []) {
        setShouts(data.reverse());
      }
      else {
        setShouts(null);
      }
      setLoading(false);
    }
  };

  const fetchAnnouncements = async () => {
    const { data, error } = await SupabaseClient.from("announcements").select();
    if(error)
    {
      toast.error("Something went wrong with fetching announcements");
      console.log(error.message);
    }
    else
    {
      setAnnouncement(data.reverse()[0]);
    }
  }

  let fetched = useRef(false);
  useEffect(() => {
    if (fetched.current === false) {
      fetched.current = true;
      fetchShouts();
      fetchAnnouncements();
    }
  }, [fetched]);

  return (
    <MainLayout>
      {loading ?
        <div className="loading-screen">
          <ReactLoading type="spin" color="red" />
        </div>
        :
        <div className="home-page">
          {announcement ?
            <>
              <h1 className="title">Public Announcement</h1>
              <div className="announcement-box">
                <img className="announcement-avatar" alt="announcement avatar" src={announcement.announcement_avatar} />
                <h1 className="announcement-text">{announcement.announcement_text}</h1>
                <div className="caption">~ {announcement.announcement_author}</div>
              </div>
            </>
            :
            ""
          }
          <h1 className="title">The Forbidden Wall</h1>
          <div className="shouts-actions">
            <button className="refresh-button" onClick={fetchShouts}><BiRefresh /> Refresh</button>
            {shouts ? <div className="shouts-found">Opinions found: <span className="shouts-amount">{shouts.length}</span></div> : ""}
          </div>
          {shouts ?
            <>
              {shouts.map((shout, index) => {
                if (index < stopIndex) {
                  return <ShoutBox shout={shout} key={index} />
                }
                else
                  return <></>
              })}
              {shouts.length > stopIndex ?
                <button className="show-btn" onClick={showMore}>Show more</button>
                :
                <p className="loaded-message"><IoIosCheckmarkCircleOutline /> congrats you saw every opinion you are now labelled as "the guy/gal who asked"</p>
              }
            </>
            :
            <p>no one has shared anything yet</p>
          }
        </div>
      }
    </MainLayout>
  );
}

export default Home;