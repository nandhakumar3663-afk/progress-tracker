import { useState } from "react";
import { useNavigate } from "react-router-dom";
import myimage from "../assets/image.jpeg";
import { getStudentById } from "../data/students";
import "./loginpage.css";

const ADMIN_USER = "7376251CS307";
const ADMIN_PASS = "03072008";

function LoginLive() {
    const navigate = useNavigate();
    const [reg, setreg] = useState("");
    const [adminUser, setAdminUser] = useState("");
    const [adminPass, setAdminPass] = useState("");
    const [error, seterror] = useState("");
    const [activeTab, setActiveTab] = useState("student");

    const handlelogin = () => {
        const student = getStudentById(reg);

        if (student) {
            navigate(`/members?user=${student.id}`, {
                state: {
                    name: student.displayName,
                    id: student.id,
                },
            });
            return;
        }

        seterror("* Invalid Reg Number");
    };

    const handleAdminLogin = () => {
        if (adminUser.trim().toUpperCase() === ADMIN_USER && adminPass.trim() === ADMIN_PASS) {
            localStorage.setItem("loggedInAs", "admin");
            navigate("/admin");
            return;
        }

        seterror("* Invalid admin credentials");
    };

    const handleSubmit = () => {
        if (activeTab === "admin") {
            handleAdminLogin();
            return;
        }

        handlelogin();
    };

    return (
        <div className="login-content">
            <div className="login-text">
                <h2>Login</h2>
                <div className="login-tabs">
                    <button
                        className={activeTab === "student" ? "active" : ""}
                        onClick={() => {
                            setActiveTab("student");
                            seterror("");
                        }}
                    >
                        Student
                    </button>
                    <button
                        className={activeTab === "admin" ? "active" : ""}
                        onClick={() => {
                            setActiveTab("admin");
                            seterror("");
                        }}
                    >
                        Admin
                    </button>
                </div>
                {activeTab === "student" ? (
                    <div className="div1">
                        <p>Enter Roll Number</p>
                        <input
                            type="text"
                            value={reg}
                            onChange={(e) => {
                                setreg(e.target.value);
                                seterror("");
                            }}
                            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                            placeholder="Enter Your Reg No"
                        />
                    </div>
                ) : (
                    <div className="div1">
                        <p>Username</p>
                        <input
                            type="text"
                            value={adminUser}
                            onChange={(e) => {
                                setAdminUser(e.target.value);
                                seterror("");
                            }}
                            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                            placeholder="Admin username"
                        />
                        <p>Password</p>
                        <input
                            type="password"
                            value={adminPass}
                            onChange={(e) => {
                                setAdminPass(e.target.value);
                                seterror("");
                            }}
                            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                            placeholder="Admin password"
                        />
                    </div>
                )}
                {error && <p className="error-msg">{error}</p>}
                <button className="loginbtn" onClick={handleSubmit}>Login -&gt;</button>
            </div>
            <div className="img">
                <img src={myimage} />
            </div>
        </div>
    );
}

export default LoginLive;
