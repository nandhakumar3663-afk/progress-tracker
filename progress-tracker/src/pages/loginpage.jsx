import myimage from "../assets/image.jpeg";
export function Loginpage(){
    return (
        <div class="main-content">
        <div class="login-text">
            <h2>Login</h2>
            <p>Enter Roll Number</p>
            <div class="div1">
            <input type="text" />
            <button>Login →</button>
        </div>
        </div>
        <div class="img">
            <img src={myimage} />
        </div>
        </div>
    )
}