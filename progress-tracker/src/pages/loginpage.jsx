import LoginLive from "./loginLive";
export default LoginLive;
/*
import { useState } from "react";
import { useNavigate} from "react-router-dom"
import myimage from "../assets/image.jpeg";
import { getStudentById } from "../data/students";
import './loginpage.css'
 function Loginpage(){
    const navigate = useNavigate();
    const [reg,setreg] = useState("");
    const [error,seterror] = useState("");
    const handlelogin= ()=>{
        const student = getStudentById(reg)
        if(student){
    
    navigate(`/members?user=${student.id}`, {
        state: { 
            name: student.displayName,
            id: student.id
        }
    });
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
                placeholder="Enter Your Reg No"
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
*/
