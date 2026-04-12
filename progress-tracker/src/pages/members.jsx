import './members.css'
export  function Members(){
    return (
        <>
        
        <div>
            <div className="header">
                <div className="image">
                    <p className="imagetext">R</p>
                </div>
                <div className="name">
                    <p className="name1">Welcome Rahul</p>
                    <p className="name2">overall dashboard</p>
                </div>
            </div>
            <div className="members-content">
            <div className="box-1">
                <p className="box1-title">
                Your Progress
             </p>
                <div className="box1">
                    <p  className="box1-name" style={{
                                    fontWeight: "bold",
                                    fontSize: "large",
                                    fontFamily:
                                        "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif",
                                }}>12</p>
                 <p  className="box1-name">Skill Completed</p>
                </div>
                 <div className="box1">
                    <p className="box1-name" style={{
                                    fontWeight: "bold",
                                    fontSize: "large",
                                    fontFamily:
                                        "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif",
                                }}>1,200</p>
                    <p className="box1-name">Reward Points</p>
                </div>
                 <div className="box1">
                    <p className="box1-name" style={{
                                    fontWeight: "bold",
                                    fontSize: "large",
                                    fontFamily:
                                        "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif",
                                }}>12,0000</p>
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
                    <div className="progress blue"style={{ width: "50%" }} ></div>
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
        <div className="leaderboard">
                <p>
                    S.no</p>
                <p>Student</p>
                <p>Reward points</p>
                <p>Activity points</p>
                <p>1</p>
               <div className="member1">
                    Rahul S
                </div>
                 <div className="member1-RP">
                    10000
                </div>
                 <div className="member1-AP">
                    1000000 
                </div>
                <p>2</p>
                <div className="member2">
                    Akash J
                </div>
                 <div className="member2-RP">
                    10000
                </div>
                 <div className="member2-AP">
                    1000000 
                </div>
                <p>3</p>
                <div className="member3">
                    Dhinesh R
                </div>
                 <div className="member3-RP">
                    10000
                </div>
                 <div className="member3-AP">
                    1000000 
                </div>
                <p>4</p>
                <div className="member4">
                    Gokul v
                </div>
                 <div className="member4-RP">
                    10000
                </div>
                 <div className="member4-AP">
                    1000000 
                </div>
                <p>5</p>
                <div className="member5">
                    Nandhakumar PS
                </div>
                 <div className="member5-RP">
                    10000
                </div>
                 <div className="member5-AP">
                    1000000 
                </div>
                <p>6</p>
                <div className="member6">
                    Raj A
                </div>
                 <div className="member6-RP">
                    10000
                </div>
                 <div className="member6-AP">
                    1000000 
                </div>
            </div>
        </div>
    </>
    );
}