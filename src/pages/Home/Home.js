import "./Home.css";
import MainLayout from "../../Layouts/MainLayout";

import { useState, useEffect, useRef } from "react";
import { SupabaseClient } from "../../supabaseClient";
import { toast } from "react-toastify";

import ReactLoading from "react-loading";

import { BiRefresh } from "react-icons/bi";

import ShoutBox from "../../Components/ShoutBox/ShoutBox";

function Home() {
  const [shouts, setShouts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stopIndex, setStopIndex] = useState(5);

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
              <h1>Public wall: </h1>
              <div>Shouts found: {shouts.length}</div>
              <button className="refresh-button" onClick={fetchShouts}><BiRefresh /> Refresh</button>
              {shouts.map((shout, index) => {
                if(index < stopIndex)
                {
                  return <ShoutBox shout={shout} key={index} />
                }
                else
                  return <></>
              })}
              {shouts.length > stopIndex ?
              <button className="show-btn" onClick={showMore}>Show more</button>
              :
              <p className="loaded-message">Loaded all shouts</p>
              }
            </>
            :
            <h1>No one has shouted anything yet!</h1>
          }
        </>
      }
    </MainLayout>
  );
}

export default Home;