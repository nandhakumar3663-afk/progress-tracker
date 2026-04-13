import "./members.css";
export function Members() {
  return (
    <>
      <div className="header">
        <div className="image">
          <img className="imagetext" src="image.jpg" alt="profile" />
        </div>
        <div className="name">
          <p className="name1">Welcome Rahul</p>
          <p className="name2">overall dashboard</p>
        </div>
      </div>
      <div className="main-content">
        <div className="box-1">
          <p className="box1-title">Your Progress</p>
          <div className="box1">
            <p className="box1-name" style={{ fontWeight: "bold", fontSize: "large", fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif" }}>
              12
            </p>
            <p className="box1-name">Skill Completed</p>
          </div>
          <div className="box1">
            <p className="box1-name" style={{ fontWeight: "bold", fontSize: "large", fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif" }}>
              1,200
            </p>
            <p className="box1-name">Reward Points</p>
          </div>
          <div className="box1">
            <p className="box1-name" style={{ fontWeight: "bold", fontSize: "large", fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif" }}>
              1,20,000
            </p>
            <p className="box1-name">Activity Points</p>
          </div>
        </div>
        <div className="box-2">
          <p className="box2-title">Update Your Progress</p>
          <div className="box-3">
            <div className="row">
              <p>C programming</p>
              <div className="controls">
                <button>-</button>
                <span>5</span>
                <button>+</button>
              </div>
              <div className="blue">5</div>
              <div className="progress-bar">
                <div className="progress blue" style={{ width: "60%" }}></div>
              </div>
              <p className="max">Max: 7</p>
            </div>
            <div className="row">
              <p>HTML</p>
              <div className="controls">
                <button>-</button>
                <span>1</span>
                <button>+</button>
              </div>
              <div className="blue">1</div>
              <div className="progress-bar">
                <div className="progress blue" style={{ width: "100%" }}></div>
              </div>
              <p className="max">Max: 1</p>
            </div>
            <div className="row">
              <p>Git Hub</p>
              <div className="controls">
                <button>-</button>
                <span>1</span>
                <button>+</button>
              </div>
              <div className="blue">1</div>
              <div className="progress-bar">
                <div className="progress blue" style={{ width: "100%" }}></div>
              </div>
              <p className="max">Max: 1</p>
            </div>
            <div className="row">
              <p>Java Script</p>
              <div className="controls">
                <button>-</button>
                <span>1</span>
                <button>+</button>
              </div>
              <div className="blue">1</div>
              <div className="progress-bar">
                <div className="progress blue" style={{ width: "50%" }}></div>
              </div>
              <p className="max">Max: 2</p>
            </div>
            <div className="row">
              <p>React</p>
              <div className="controls">
                <button>-</button>
                <span>1</span>
                <button>+</button>
              </div>
              <div className="blue">1</div>
              <div className="progress-bar">
                <div className="progress blue" style={{ width: "33%" }}></div>
              </div>
              <p className="max">Max: 3</p>
            </div>
            <div className="row">
              <p>Node JS</p>
              <div className="controls">
                <button>-</button>
                <span>1</span>
                <button>+</button>
              </div>
              <div className="blue">1</div>
              <div className="progress-bar">
                <div className="progress blue" style={{ width: "33%" }}></div>
              </div>
              <p className="max">Max: 1</p>
            </div>
            <div className="row">
              <p>Linux</p>
              <div className="controls">
                <button>-</button>
                <span>1</span>
                <button>+</button>
              </div>
              <div className="blue">3</div>
              <div className="progress-bar">
                <div className="progress blue" style={{ width: "33%" }}></div>
              </div>
              <p className="max">Max: 3</p>
            </div>
            <div className="row">
              <p>System Administration</p>
              <div className="controls">
                <button>-</button>
                <span>1</span>
                <button>+</button>
              </div>
              <div className="blue">2</div>
              <div className="progress-bar">
                <div className="progress blue" style={{ width: "33%" }}></div>
              </div>
              <p className="max">Max: 2</p>
            </div>
            <div className="row">
              <p>Computer Networking</p>
              <div className="controls">
                <button>-</button>
                <span>1</span>
                <button>+</button>
              </div>
              <div className="blue">2</div>
              <div className="progress-bar">
                <div className="progress blue" style={{ width: "33%" }}></div>
              </div>
              <p className="max">Max: 2</p>
            </div>
            <div className="rp">
              <p>Reward point</p>
              <input type="number" />
            </div>
            <div className="ap">
              <p>Activity point</p>
              <input type="number" />
            </div>
            <center>
              <button className="saveprogress">Save Progress</button>
            </center>
          </div>
        </div>
      </div>
      <p style={{ paddingLeft: "40px", marginBottom: "0px", paddingBottom: "10px", fontWeight: "bold", fontSize: "20px", color: "#11645d" }}>
        Leaderboard
      </p>
      <div className="leaderboard">
        <div className="leaderboard-row heading">
          <p>S.No</p>
          <p>Students</p>
          <p>Reward Points</p>
          <p>Activity Points</p>
        </div>
        <div className="leaderboard-row student">
          <p>1</p><p>Rahul S</p><p>3,500</p><p>10,200</p>
        </div>
        <div className="leaderboard-row student">
          <p>2</p><p>Akash J</p><p>5,000</p><p>12,400</p>
        </div>
        <div className="leaderboard-row student">
          <p>3</p><p>Dhinesh R</p><p>4,600</p><p>13,100</p>
        </div>
        <div className="leaderboard-row student">
          <p>4</p><p>NandhaKumar PS</p><p>4,000</p><p>12,100</p>
        </div>
        <div className="leaderboard-row student">
          <p>5</p><p>Gokul V</p><p>2,300</p><p>9,100</p>
        </div>
        <div className="leaderboard-row student">
          <p>6</p><p>Dharun K</p><p>4,680</p><p>12,900</p>
        </div>
      </div>
    </>
  );
}