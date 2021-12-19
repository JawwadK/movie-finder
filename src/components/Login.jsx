import { auth } from "../firebase";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import "./Login.css";

//create a login component with firebase login
function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(null);

	useEffect(() => {
		document.title = `Login | Movie Finder`;
	}, []);

	const history = useHistory();

	const onSubmit = async (e) => {
		e.preventDefault();
		try {
			const user = await auth.signInWithEmailAndPassword(email,  password);
			setError(null);
			history.push("/");
		} catch (error) {
			setError(error.message);
		}
	};

	const onChangeEmail = (e) => {
		setEmail(e.target.value);
	};

	const onChangePassword = (e) => {
		setPassword(e.target.value);
	};

	return (
		<div className="login">
			<div className="loginContainer">
				<form onSubmit={onSubmit}>
					<h1>Login</h1>
					{error && <p>{error}</p>}
					<h5>Email</h5>
					<input type="email" id="email" aria-describedby="emailHelp" placeholder="Enter email" value={email} onChange={onChangeEmail} />
					<h5>Password</h5>
					<input type="password" id="password" placeholder="Password" value={password} onChange={onChangePassword} />
					<button type="submit" className="loginSignInButton">
						Submit
					</button>
				</form>
				<div className="linkToregister">
				Don't have an account? <Link className="link-login" to="/register" >Register</Link>
				</div>
			</div>
		</div>
	);
}

export default Login;
