import { useState } from "react";
import { useNavigate} from "react-router-dom"
import myimage from "../assets/image.jpeg";
import './loginpage.css'
export function Loginpage(){
    const navigate = useNavigate();
    const [reg,setreg] = useState("");
    const [error,seterror] = useState("");
    const handlelogin= ()=>{
        if(reg.toLowerCase()==="7376251cs307"){
                   navigate("/members") 
                }
                else if(reg.toLowerCase()==="7376251cs329"){
                    navigate("/members")
                }
                else if(reg.toLowerCase()==="7376251cs247"){
                    navigate("/members")
                }
                else if(reg.toLowerCase()==="7376251cs110"){
                    navigate("/members")
                }
                else if(reg.toLowerCase()==="7376251cs167"){
                    navigate("/members")
                }
                else if(reg.toLowerCase()==="7376251cs185"){
                    navigate("/members")
                }
                else if(reg.toLowerCase()==="7376251cs196"){
                    navigate("/members")
                }
                else if(reg.toLowerCase()==="7376251cs254"){
                    navigate("/members")
                }
                else if(reg.toLowerCase()==="7376251cs353"){
                    navigate("/members")
                }
                else if(reg.toLowerCase()==="7376251cs372"){
                    navigate("/members")
                }
                else if(reg.toLowerCase()==="7376251cs443"){
                    navigate("/members")
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