import "./ShoutBox.css";

const ShoutBox = ({ shout }) => {
    return (
        <div className="shout-box">
            <img src={shout.shouter_avatar_url} alt="Shouter's avatar" className="shouter-avatar" />
            <div className="shouter-info">
                <div className="top-section">
                    <p className="shouter-tag">{shout.shouter_username}</p>
                    <div className="creation-date">{new Date(shout.created_at).toDateString() + " , " + new Date(shout.created_at).toLocaleTimeString()}</div>
                </div>
                <div className="shout-content">
                    {shout.content}
                </div>
            </div>
        </div>
    )
};

export default ShoutBox;