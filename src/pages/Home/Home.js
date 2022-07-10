import "./Home.css";
import MainLayout from "../../Layouts/MainLayout";

import { useState, useEffect, useRef } from "react";
import { SupabaseClient } from "../../supabaseClient";
import { toast } from "react-toastify";

import ReactLoading from "react-loading";

import { BiRefresh } from "react-icons/bi";

function Home() {
  const [shouts, setShouts] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchShouts = async () => {
    setLoading(true);
    const { data, error } = await SupabaseClient.from("shouts").select();
    if (error) {
      toast.error("Something went wrong with fetching shouts.");
      console.log(error.message);
    }
    else {
      if (data.length > 0 && data !== []) {
        setShouts(data);
      }
      else
      {
        setShouts(null);
      }
      setLoading(false);
    }
  };

  let fetched = useRef(false);
  useEffect(() => {
    if (fetched.current === false) {
      fetched.current = true;
      fetchShouts();
    }
  }, [fetched]);

  return (
    <MainLayout>
      {loading ?
        <ReactLoading type="balls" color="red" />
        :
        <>
          {shouts ?
            <>
              <h1>Recent shouts: </h1>
              {shouts.map((shout, index) => (
                <div key={index} className="shout-box">
                  <div className="shouter-info">
                    <img src={shout.shouter_avatar_url} alt="Shouter's avatar" className="shouter-avatar" />
                    <p className="shouter-tag">{shout.shouter_username}</p>
                  </div>
                  <div className="shout-content">
                    {shout.content}
                  </div>
                  <div className="creation-date">{new Date(shout.created_at).toDateString() + " , " + new Date(shout.created_at).toLocaleTimeString()}</div>
                </div>
              ))}
            </>
            :
            <h1>No one has shouted anything yet!</h1>
          }
          <button className="refresh-button" onClick={fetchShouts}><BiRefresh /> Refresh</button>
        </>
      }
    </MainLayout>
  );
}

export default Home;