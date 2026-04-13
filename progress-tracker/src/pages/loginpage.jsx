import { useState } from "react";
import { useNavigate} from "react-router-dom"
import myimage from "../assets/image.jpeg";
import './loginpage.css'
 function Loginpage(){
    const navigate = useNavigate();
    const [reg,setreg] = useState("");
    const [error,seterror] = useState("");
    const users = {
        "7376251cs307": "Nandha Kumar PS",
        "7376251cs329": "Pavithran S",
        "7376251cs247": "Kavinesh D",
        "7376251cs110": "Akash J",
        "7376251cs167": "Dhinesh R",
        "7376251cs185": "Gokul BJ",
        "7376251cs196": "Haffiza S",
        "7376251cs254": "Keerthana R",
        "7376251cs353": "Rahul S",
        "7376251cs372": "Ronisha K",
        "7376251cs443": "Tamizhoviyan S",
    }
    const handlelogin= ()=>{
        const name = users[reg.toLowerCase()]
        if(name){
                   navigate("/members",{state: {name: name}}) 
                }
                else{
                    seterror("• Invalid Reg Number")
                }
    }
    return (
        <div className="login-content">
        <div className="login-text">
            <h2>Login</h2>
            <p>Enter Roll Number</p>
            <div className="div1">
            <input type="text"  value={reg} onChange={(e)=>{setreg(e.target.value) 
                seterror("")
            }}
                onKeyDown={(e) => e.key === "Enter" && handlelogin()}
                placeHolder="Enter Your Reg No"
                />
            {error && <p className="error-msg">{error}</p>}
            <button className="loginbtn" onClick={handlelogin}>Login →</button>
             
        </div>
        </div>
        <div className="img">
            <img src={myimage} />
        </div>
        </div>
    )
}
export default Loginpage;