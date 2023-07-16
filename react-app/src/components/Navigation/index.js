import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }){
	const sessionUser = useSelector(state => state.session.user);

	return (
		<ul>
			<li>
				<NavLink exact to="/">Search Cards</NavLink>
			</li>
			<li>
				<NavLink exact to="/build-deck">Build a Deck</NavLink>
			</li>
			<li>
				<NavLink exact to="/play"> Play Game </NavLink>
			</li>

			{isLoaded && (
				<li>
					<ProfileButton user={sessionUser} />
				</li>
			)}
		</ul>
	);
}

export default Navigation;
