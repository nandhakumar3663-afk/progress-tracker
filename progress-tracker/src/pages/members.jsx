import "./members.css";
import {useLocation} from "react-router-dom"
import {useState} from "react"
import A from "../assets/A.jpg"
import D from "../assets/D.jpg"
import G from "../assets/G.jpg"
import H from "../assets/H.jpg"
import K from "../assets/K.jpg"
import N from "../assets/N.jpg"
import P from "../assets/P.jpg"
import R from "../assets/R.jpg"
export default function Members() {
    const location = useLocation();
    const name = location.state?.name
    const [htmlprogress,sethtmlprogress] = useState(0);
    const [cprogress,setcprogress] = useState(0);
    const [linuxprogress,setlinuxprogress] = useState(0);
    const [cnprogress,setcnprogress] = useState(0);
    const [saprogress,setsaprogress] = useState(0);
    const [nodeprogress,setnodeprogress] = useState(0);
    const [jsprogress,setjsprogress] = useState(0);
    const [reactprogress,setreactprogress] = useState(0);
    const [gitprogress,setgitprogress] = useState(0);
    const [cnwidth,setcnwidth] = useState(0);
    const [cwidth,setcwidth] = useState(0);
    const [htmlwidth,sethtmlwidth] = useState(0);
    const [gitwidth,setgitwidth] = useState(0);
    const [jswidth,setjswidth] = useState(0);
    const [reactwidth,setreactwidth] = useState(0);
    const [nodewidth,setnodewidth] = useState(0);
    const [sawidth,setsawidth] = useState(0);
    const [linuxwidth,setlinuxwidth] = useState(0);
    
    
    const profile = {A,D,G,H,K,N,P,R}
    const getprofileimage = (name)=>{
        if(name){
            const firstletter = name.trim()[0].toUpperCase();
            return profile[firstletter];
        }
    }
  return (
    <>
      <div className="header">
        <div className="image">
          <img className="imagetext" src={getprofileimage(name)} alt="profile" />
        </div>
        <div className="name">
          <p className="name1">Welcome {name}</p>
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
                <button onClick={()=>{
                    if(cprogress<=0){
                        setcprogress(0);
                    }
                    else{
                        setcprogress(cprogress-1)
                        setcwidth(cwidth-16.5)
                    }
                }}>-</button>
                <span>{cprogress}</span>
                <button onClick={()=>{
                    if(cprogress>=6){
                        setcprogress(6);
                    }
                    else{
                        setcprogress(cprogress+1)
                        setcwidth(cwidth+16.5)
                    }
                }}>+</button>
              </div>
              <div className="blue">{cprogress}</div>
              <div className="progress-bar">
                <div className="progress blue" style={{ width: cwidth+"%" }}></div>
              </div>
              <p className="max">Max: 6</p>
            </div>
            <div className="row">
              <p>HTML</p>
              <div className="controls">
                <button onClick={()=>{
                    if(htmlprogress<=0){
                        sethtmlprogress(0);
                    }
                    else{
                        sethtmlprogress(htmlprogress-1)
                        sethtmlwidth(htmlwidth-100)
                    }
                }}>-</button>
                <span>{htmlprogress}</span>
                <button onClick={()=>{
                    if(htmlprogress>=1){
                        sethtmlprogress(1);
                    }
                    else{
                        sethtmlprogress(htmlprogress+1)
                        sethtmlwidth(htmlwidth+100)
                    }
                }}>+</button>
              </div>
              <div className="blue">{htmlprogress}</div>
              <div className="progress-bar">
                <div className="progress blue" style={{ width: htmlwidth+"%" }}></div>
              </div>
              <p className="max">Max: 1</p>
            </div>
            <div className="row">
              <p>Git Hub</p>
              <div className="controls">
                <button onClick={()=>{
                    if(gitprogress<=0){
                        setgitprogress(0);
                    } 
                    else{
                        setgitprogress(gitprogress-1)
                        setgitwidth(gitwidth-100)
                    }
                }}>-</button>
                <span>{gitprogress}</span>
                <button onClick={()=>{
                    if(gitprogress>=1){
                        setgitprogress(1);
                    }
                    else{
                        setgitprogress(gitprogress+1)
                        setgitwidth(gitwidth+100)
                    }
                }}>+</button>
              </div>
              <div className="blue">{gitprogress}</div>
              <div className="progress-bar">
                <div className="progress blue" style={{ width: gitwidth+"%" }}></div>
              </div>
              <p className="max">Max: 1</p>
            </div>
            <div className="row">
              <p>Java Script</p>
              <div className="controls">
                <button onClick={()=>{
                    if(jsprogress<=0){
                        setjsprogress(0);
                    }
                    else{
                        setjsprogress(jsprogress-1)
                        setjswidth(jswidth-100)
                    }
                }}>-</button>
                <span>{jsprogress}</span>
                <button onClick={()=>{
                    if(jsprogress>=1){
                        setjsprogress(1);
                    }
                    else{
                        setjsprogress(jsprogress+1)
                        setjswidth(jswidth+100)
                    }
                }}>+</button>
              </div>
              <div className="blue">{jsprogress}</div>
              <div className="progress-bar">
                <div className="progress blue" style={{ width: jswidth+"%" }}></div>
              </div>
              <p className="max">Max: 1</p>
            </div>
            <div className="row">
              <p>React</p>
              <div className="controls">
                <button onClick={()=>{
                    if(reactprogress<=0){
                        setreactprogress(0);
                    }
                    else{
                        setreactprogress(reactprogress-1)
                        setreactwidth(reactwidth-100);
                    }
                }}>-</button>
                <span>{reactprogress}</span>
                <button onClick={()=>{
                    if(reactprogress>=1){
                        setreactprogress(1);
                    }
                    else{
                        setreactprogress(reactprogress+1)
                        setreactwidth(reactwidth+100);
                    }
                }}>+</button>
              </div>
              <div className="blue">{reactprogress}</div>
              <div className="progress-bar">
                <div className="progress blue" style={{ width: reactwidth+"%" }}></div>
              </div>
              <p className="max">Max: 1</p>
            </div>
            <div className="row">
              <p>Node JS</p>
              <div className="controls">
                <button onClick={()=>{
                    if(nodeprogress<=0){
                        setnodeprogress(0);
                    }
                    else{
                        setnodeprogress(nodeprogress-1)
                        setnodewidth(nodewidth-100)
                    }
                }}>-</button>
                <span>{nodeprogress}</span>
                <button onClick={()=>{
                    if(nodeprogress>=1){
                        setnodeprogress(1);
                    }
                    else{
                        setnodeprogress(nodeprogress+1)
                        setnodewidth(nodewidth+100)
                    }
                }}>+</button>
              </div>
              <div className="blue">{nodeprogress}</div>
              <div className="progress-bar">
                <div className="progress blue" style={{ width: nodewidth+"%" }}></div>
              </div>
              <p className="max">Max: 1</p>
            </div>
            <div className="row">
              <p>Linux</p>
              <div className="controls">
                <button onClick={()=>{
                    if(linuxprogress<=0){
                        setlinuxprogress(0);
                    }
                    else{
                        setlinuxprogress(linuxprogress-1)
                        setlinuxwidth(linuxwidth-50)
                    }
                }}>-</button>
                <span>{linuxprogress}</span>
                <button onClick={()=>{
                    if(linuxprogress>=2){
                        setlinuxprogress(2);
                    }
                    else{
                        setlinuxprogress(linuxprogress+1)
                        setlinuxwidth(linuxwidth+50)
                    }
                }}>+</button>
              </div>
              <div className="blue">{linuxprogress}</div>
              <div className="progress-bar">
                <div className="progress blue" style={{ width: linuxwidth+"%" }}></div>
              </div>
              <p className="max">Max: 2</p>
            </div>
            <div className="row">
              <p>System Administration</p>
              <div className="controls">
                <button onClick={()=>{
                    if(saprogress<=0){
                        setsaprogress(0);
                    }
                    else{
                        setsaprogress(saprogress-1)
                        setsawidth(sawidth-50)
                    }
                }}>-</button>
                <span>{saprogress}</span>
                <button onClick={()=>{
                    if(saprogress>=2){
                        setsaprogress(2);
                    }
                    else{
                        setsaprogress(saprogress+1)
                        setsawidth(sawidth+50)
                    }
                }}>+</button>
              </div>
              <div className="blue">{saprogress}</div>
              <div className="progress-bar">
                <div className="progress blue" style={{ width: sawidth+"%" }}></div>
              </div>
              <p className="max">Max: 2</p>
            </div>
            <div className="row">
              <p>Computer Networking</p>
              <div className="controls">
                <button onClick={()=>{
                    if(cnprogress<=0){
                        setcnprogress(0);
                    }
                    else{
                        setcnprogress(cnprogress-1)
                        setcnwidth(cnwidth-33);
                    }
                }}>-</button>
                <span>{cnprogress}</span>
                <button onClick={()=>{
                    if(cnprogress>=3){
                        setcnprogress(3);
                    }
                    else{
                        setcnprogress(cnprogress+1)
                        setcnwidth(cnwidth+33);
                    }
                }}>+</button>
              </div>
              <div className="blue">{cnprogress}</div>
              <div className="progress-bar">
                <div className="progress blue" style={{ width: cnwidth + "%" }}></div>
              </div>
              <p className="max">Max: 3</p>
            </div>
            <div className="rp">
              <p>Reward point</p>
              <input type="number" placeHolder="Enter Your RP" />
            </div>
            <div className="ap">
              <p>Activity point</p>
              <input type="number" placeHolder="Enter Your AP"/>
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
          <p>5</p><p>Gokul BJ</p><p>2,300</p><p>9,100</p>
        </div>
        <div className="leaderboard-row student">
          <p>6</p><p>Pavithran S</p><p>4,680</p><p>12,900</p>
        </div>
        <div className="leaderboard-row student">
          <p>7</p><p>Tamizhoviyan S</p><p>4,600</p><p>13,100</p>
        </div>
        <div className="leaderboard-row student">
          <p>8</p><p>Kavinesh D</p><p>4,600</p><p>13,100</p>
        </div>
        <div className="leaderboard-row student">
          <p>9</p><p>Keerthana R</p><p>4,600</p><p>13,100</p>
        </div>
        <div className="leaderboard-row student">
          <p>10</p><p>Ronisha K</p><p>4,600</p><p>13,100</p>
        </div>
        <div className="leaderboard-row student">
          <p>11</p><p>Haffiza S</p><p>4,600</p><p>13,100</p>
        </div>
      </div>
    </>
  );
}