import "./ShoutBox.css";

const ShoutBox = ({ shout }) => {
    return (
        <div className="shout-box">
            <div className="shouter-info">
                <img src={shout.shouter_avatar_url} alt="Shouter's avatar" className="shouter-avatar" />
                <p className="shouter-tag">{shout.shouter_username}</p>
            </div>
            <div className="shout-content">
                {shout.content}
            </div>
            <div className="creation-date">{new Date(shout.created_at).toDateString() + " , " + new Date(shout.created_at).toLocaleTimeString()}</div>
        </div>
    )
};

export default ShoutBox;