//imports
import React, { useState, useEffect} from "react";
import { Link, useHistory } from "react-router-dom";
import { auth } from "../firebase";
import "./Login.css";

function Register(props) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const history = useHistory();

	useEffect(() => {
		document.title = `Sign Up | Movie Finder`;
	}, []);

	//create a firebase user with email and password
	const register = (e) => {
		e.preventDefault();
		setLoading(true);

		auth.createUserWithEmailAndPassword(email, password)
			.then((res) => {
				const user = auth.currentUser;
				user.updateProfile({
					displayName: `${firstName} ${lastName}`,
				})
					.then(() => {
						setLoading(false);
						history.push("/");
					})
					.catch((err) => {
						setLoading(false);
						setError(err.message);
					});
			})
			.catch((err) => {
				setLoading(false);
				setError(err.message);
			});
	};

	return (
		<div className="login">
			<div className="loginContainer">
				<form onSubmit={register}>
					<h1>Sign Up</h1>
					<p>Create your Movie Finder account</p>
					<h5>First Name</h5>
					<input type="text" placeholder="First Name" name="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
					<h5>Last Name</h5>
					<input type="text" placeholder="Last Name" name="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
					<h5>Email</h5>
					<input type="email" placeholder="Email Address" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
					<h5>Password</h5>
					<input type="password" placeholder="Password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
					<button type="submit" className="loginSignInButton">
						Submit
					</button>
				</form>
				{error && <p>{error}</p>}
				<div className="linkToregister">
					Already have an account?{" "}
					<Link className="link-login" to="/login">
						Login
					</Link>
				</div>
			</div>
		</div>
	);
}

export default Register;
