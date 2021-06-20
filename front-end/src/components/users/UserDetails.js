import { Helmet, HelmetProvider } from 'react-helmet-async';
import React, { useEffect, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';

import NotFound from '../NotFound';
import UserDelete from './UserDelete';
import UserUpdate from './UserUpdate';
import { loadUserDetailsAction } from '../../redux/actions/auth';

const userDetails = (props) => {
    const [isAuthor, setIsAuthor] = useState(false);
    const [userExist, setUserExist] = useState(false);
    const loggedUserData = useSelector((state) => state.authReducer.loggedUserData);
    const userDetailsData = useSelector((state) => state.authReducer.userDetailsData);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(loadUserDetailsAction(props.match.params.id));
    }, [props.match.params.id, dispatch]);

    useEffect(() => {
        if (userDetailsData) {
            if (Object.prototype.hasOwnProperty.call(userDetailsData, 'name')) {
                setUserExist(true);
            }
        }
    }, [userDetailsData]);

    useEffect(() => {
        if (loggedUserData != null) {
            if (loggedUserData.id == props.match.params.id) {
                setIsAuthor(true);
            }
        }
    }, [props.match.params.id, loggedUserData]);

    const guestLinks = (
        <main>
            {userExist ? (
                <div>
                    <p>user name: {userDetailsData.name}</p>
                    <p>user email: {userDetailsData.email}</p>
                </div>
            ) : (
                <NotFound />
            )}
        </main>
    );

    const authorLinks = (
        <div>
            <UserDelete id={props.match.params.id} />
            <UserUpdate id={props.match.params.id} />
            {loggedUserData ? (
                <div>
                    <div>user name: {loggedUserData.name}</div>
                    <div>user email: {loggedUserData.email}</div>
                </div>
            ) : (
                { guestLinks }
            )}
        </div>
    );

    return (
        <div data-testid='userDetails'>
            <HelmetProvider>
                <Helmet>
                    <title>ZBite - User Details Page </title>
                    <meta name='description' content='recipes detail' />
                </Helmet>
            </HelmetProvider>
            <div>
                <div>{isAuthor == true ? <p>{authorLinks}</p> : <p>{guestLinks}</p>}</div>
            </div>
        </div>
    );
};

export default connect()(userDetails);