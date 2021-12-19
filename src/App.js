import { useStateValue } from "./StateProvider";
import { Route, BrowserRouter as Router, Switch, Redirect } from "react-router-dom";
import { useEffect, useState} from "react";
import Header from "./components/Header";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Footer from "./components/Footer";
import MoviePage from "./components/MoviePage";
import ExportDB from "./components/ExportDB";
import { auth } from "./firebase";

function App() {
	const [{ user }, dispatch] = useStateValue();
	const [searchQuery, setSearchQuery] = useState("");
	//console.log(user);
	useEffect(() => {
		auth.onAuthStateChanged((authUser) => {
			console.log("user:", authUser);
			if (authUser) {
				dispatch({
					type: "SET_USER",
					user: authUser,
				});
			} else {
				dispatch({
					type: "SET_USER",
					user: null,
				});
			}
		});
	}, [dispatch]);

	return (
		<div className="container">
			<Router>
				<Header setSearchQuery={setSearchQuery}/>
				<Switch>
					<Route exact path="/login">
						<Login />
					</Route>
					<Route exact path="/register">
						<Register />
					</Route>
					<Route exact path="/movie/:id" render={props => <MoviePage key={props.match.params.id} id={props.match.params.id} />}></Route>
					<Route exact path="/">
						<Home searchQuery={searchQuery} />
					</Route>
					<Route exact path="/export/data">
						{user ? <ExportDB/> : <>Please login to export data!</>}
					</Route>
					<Route>
						<Redirect to="/" />
					</Route>
					
				</Switch>
				<Footer />
			</Router>
		</div>
	);
}

export default App;
