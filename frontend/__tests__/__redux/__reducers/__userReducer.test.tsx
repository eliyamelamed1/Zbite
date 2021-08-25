import '@testing-library/jest-dom/extend-expect';

import { cleanup } from '@testing-library/react';
import store from '../../../redux/store';

describe('reducers - auth ', () => {
    afterEach(() => {
        cleanup();
    });
    let initialState;
    beforeEach(() => {
        initialState = {
            auth_token: 'initialValue',
            isUserAuthenticated: 'initialValue',
            loggedUserData: 'initialValue',
            listOfUsers: 'initialValue',
            requestedUserData: 'initialValue',
        };
        store.dispatch({ type: 'TEST_CASE_AUTH', payload: initialState });
        return initialState;
    });
    test('case GET_USER_DETAILS_FAIL', () => {
        initialState['requestedUserData'] = { email: 'testEmail', name: 'testName', id: 'testId' };
        store.dispatch({ type: 'GET_USER_DETAILS_FAIL', payload: initialState.requestedUserData });
        initialState = store.getState();

        expect(initialState.userReducer.isUserAuthenticated).toBe('initialValue');
        expect(initialState.userReducer.auth_token).toBe('initialValue');
        expect(initialState.userReducer.loggedUserData).toBe('initialValue');
        expect(initialState.userReducer.listOfUsers).toBe('initialValue');
        expect(initialState.userReducer.requestedUserData).toBe('initialValue');
    });
    test('case GET_USER_DETAILS_SUCCESS', () => {
        initialState['requestedUserData'] = { email: 'testEmail', name: 'testName', id: 'testId' };
        store.dispatch({ type: 'GET_USER_DETAILS_SUCCESS', payload: initialState.requestedUserData });
        initialState = store.getState();

        expect(initialState.userReducer.isUserAuthenticated).toBe('initialValue');
        expect(initialState.userReducer.auth_token).toBe('initialValue');
        expect(initialState.userReducer.loggedUserData).toBe('initialValue');
        expect(initialState.userReducer.listOfUsers).toBe('initialValue');
        expect(initialState.userReducer.requestedUserData).toStrictEqual({
            email: 'testEmail',
            name: 'testName',
            id: 'testId',
        });
    });
    test('case GET_USER_LIST_FAIL', () => {
        initialState['listOfUsers'] = { firstUser: { name: 'testName' }, secondeUser: { name: 'testName2' } };
        store.dispatch({ type: 'GET_USER_LIST_FAIL', payload: initialState.listOfUsers });
        initialState = store.getState();

        expect(initialState.userReducer.isUserAuthenticated).toBe('initialValue');
        expect(initialState.userReducer.auth_token).toBe('initialValue');
        expect(initialState.userReducer.loggedUserData).toBe('initialValue');
        expect(initialState.userReducer.listOfUsers).toBe('initialValue');
        expect(initialState.userReducer.requestedUserData).toBe('initialValue');
    });
    test('case GET_USER_LIST_SUCCESS', () => {
        initialState['listOfUsers'] = { firstUser: { name: 'testName' }, secondeUser: { name: 'testName2' } };
        store.dispatch({ type: 'GET_USER_LIST_SUCCESS', payload: initialState.listOfUsers });
        initialState = store.getState();

        expect(initialState.userReducer.isUserAuthenticated).toBe('initialValue');
        expect(initialState.userReducer.auth_token).toBe('initialValue');
        expect(initialState.userReducer.loggedUserData).toBe('initialValue');
        expect(initialState.userReducer.listOfUsers).toStrictEqual({
            firstUser: { name: 'testName' },
            secondeUser: { name: 'testName2' },
        });
        expect(initialState.userReducer.requestedUserData).toBe('initialValue');
    });
    test('case DELETE_USER_FAIL', () => {
        initialState['loggedUserData'] = { email: 'testEmail', name: 'testName', id: 'testId' };
        initialState['auth_token'] = 'testToken';
        initialState['isUserAuthenticated'] = true;
        store.dispatch({ type: 'TEST_CASE_AUTH', payload: initialState });
        store.dispatch({ type: 'DELETE_USER_FAIL' });
        initialState = store.getState();

        expect(initialState.userReducer.isUserAuthenticated).toBe(true);
        expect(initialState.userReducer.auth_token).toBe('testToken');
        expect(initialState.userReducer.loggedUserData).toStrictEqual({
            email: 'testEmail',
            name: 'testName',
            id: 'testId',
        });
        expect(initialState.userReducer.listOfUsers).toBe('initialValue');
        expect(initialState.userReducer.requestedUserData).toBe('initialValue');
    });
    test('case DELETE_USER_SUCCESS', () => {
        initialState['loggedUserData'] = { email: 'testEmail', name: 'testName', id: 'testId' };
        initialState['auth_token'] = 'testToken';
        initialState['isUserAuthenticated'] = true;
        store.dispatch({ type: 'TEST_CASE_AUTH', payload: initialState });
        store.dispatch({ type: 'DELETE_USER_SUCCESS' });
        initialState = store.getState();

        expect(initialState.userReducer.auth_token).toBe(null);
        expect(initialState.userReducer.isUserAuthenticated).toBe(false);
        expect(initialState.userReducer.loggedUserData).toBe(null);
        expect(initialState.userReducer.listOfUsers).toBe('initialValue');
        expect(initialState.userReducer.requestedUserData).toBe('initialValue');
    });

    test('case UPDATE_USER_FAIL ', () => {
        initialState['loggedUserData'] = { email: 'testEmail', name: 'testName', id: 'testId' };
        store.dispatch({ type: 'TEST_CASE_AUTH', payload: initialState });
        initialState['loggedUserData'] = { email: 'testEmail2', name: 'testName2' };
        store.dispatch({ type: 'UPDATE_USER_FAIL', payload: initialState });
        initialState = store.getState();

        expect(initialState.userReducer.isUserAuthenticated).toBe('initialValue');
        expect(initialState.userReducer.auth_token).toBe('initialValue');
        expect(initialState.userReducer.loggedUserData).toStrictEqual({
            email: 'testEmail',
            name: 'testName',
            id: 'testId',
        });
        expect(initialState.userReducer.listOfUsers).toBe('initialValue');
        expect(initialState.userReducer.requestedUserData).toBe('initialValue');
    });
    test('case UPDATE_USER_SUCCESS ', () => {
        initialState['loggedUserData'] = { email: 'testEmail', name: 'testName', id: 'testId' };
        store.dispatch({ type: 'TEST_CASE_AUTH', payload: initialState });
        initialState['loggedUserData'] = { email: 'testEmail2', name: 'testName2' };
        store.dispatch({ type: 'UPDATE_USER_SUCCESS', payload: initialState.loggedUserData });
        initialState = store.getState();

        expect(initialState.userReducer.isUserAuthenticated).toBe('initialValue');
        expect(initialState.userReducer.auth_token).toBe('initialValue');
        expect(initialState.userReducer.loggedUserData).toStrictEqual({
            email: 'testEmail2',
            name: 'testName2',
        });
        expect(initialState.userReducer.listOfUsers).toBe('initialValue');
        expect(initialState.userReducer.requestedUserData).toBe('initialValue');
    });

    test('case LOGIN_SUCCESS', () => {
        initialState['auth_token'] = 'testToken';
        initialState['loggedUserData'] = { email: 'testEmail', name: 'testName', id: 'testId' };
        store.dispatch({ type: 'LOGIN_SUCCESS', payload: initialState });
        initialState = store.getState();
        expect(initialState.userReducer.isUserAuthenticated).toBe(true);
        expect(initialState.userReducer.auth_token).toBe('testToken');
        expect(initialState.userReducer.loggedUserData).toBe('initialValue');
        expect(initialState.userReducer.listOfUsers).toBe('initialValue');
        expect(initialState.userReducer.requestedUserData).toBe('initialValue');
    });
    test('case GET_LOGGED_USER_DETAILS_SUCCESS', () => {
        initialState['loggedUserData'] = { email: 'testEmail', name: 'testName', id: 'testId' };
        store.dispatch({ type: 'GET_LOGGED_USER_DETAILS_SUCCESS', payload: initialState.loggedUserData });
        initialState = store.getState();

        expect(initialState.userReducer.auth_token).toBe('initialValue');
        expect(initialState.userReducer.isUserAuthenticated).toBe('initialValue');
        expect(initialState.userReducer.loggedUserData).toStrictEqual({
            email: 'testEmail',
            name: 'testName',
            id: 'testId',
        });
        expect(initialState.userReducer.listOfUsers).toBe('initialValue');
        expect(initialState.userReducer.requestedUserData).toBe('initialValue');
    });
    test('case SIGNUP_SUCCESS', () => {
        store.dispatch({ type: 'SIGNUP_SUCCESS' });
        initialState = store.getState();
        expect(initialState.userReducer.auth_token).toBe('initialValue');
        expect(initialState.userReducer.isUserAuthenticated).toBe(false);
        expect(initialState.userReducer.loggedUserData).toBe('initialValue');
        expect(initialState.userReducer.listOfUsers).toBe('initialValue');
        expect(initialState.userReducer.requestedUserData).toBe('initialValue');
    });
    test('case GET_LOGGED_USER_DETAILS_FAIL', () => {
        store.dispatch({ type: 'GET_LOGGED_USER_DETAILS_FAIL' });
        initialState = store.getState();
        expect(initialState.userReducer.auth_token).toBe('initialValue');
        expect(initialState.userReducer.isUserAuthenticated).toBe('initialValue');
        expect(initialState.userReducer.loggedUserData).toBe(null);
        expect(initialState.userReducer.listOfUsers).toBe('initialValue');
        expect(initialState.userReducer.requestedUserData).toBe('initialValue');
    });
    test('case SIGNUP_FAIL', () => {
        store.dispatch({ type: 'SIGNUP_FAIL' });
        initialState = store.getState();
        expect(initialState.userReducer.auth_token).toBe(null);
        expect(initialState.userReducer.isUserAuthenticated).toBe(false);
        expect(initialState.userReducer.loggedUserData).toBe(null);
        expect(initialState.userReducer.listOfUsers).toBe('initialValue');
        expect(initialState.userReducer.requestedUserData).toBe('initialValue');
    });
    test('case LOGIN_FAIL', () => {
        store.dispatch({ type: 'LOGIN_FAIL' });
        initialState = store.getState();
        expect(initialState.userReducer.auth_token).toBe(null);
        expect(initialState.userReducer.isUserAuthenticated).toBe(false);
        expect(initialState.userReducer.loggedUserData).toBe(null);
        expect(initialState.userReducer.listOfUsers).toBe('initialValue');
        expect(initialState.userReducer.requestedUserData).toBe('initialValue');
    });
    test('case LOGOUT', () => {
        store.dispatch({ type: 'LOGOUT' });
        initialState = store.getState();
        expect(initialState.userReducer.auth_token).toBe(null);
        expect(initialState.userReducer.isUserAuthenticated).toBe(false);
        expect(initialState.userReducer.loggedUserData).toBe(null);
        expect(initialState.userReducer.listOfUsers).toBe('initialValue');
        expect(initialState.userReducer.requestedUserData).toBe('initialValue');
    });
    test('case default', () => {
        initialState = store.getState();
        expect(initialState.userReducer.auth_token).toBe('initialValue');
        expect(initialState.userReducer.isUserAuthenticated).toBe('initialValue');
        expect(initialState.userReducer.loggedUserData).toBe('initialValue');
        expect(initialState.userReducer.listOfUsers).toBe('initialValue');
        expect(initialState.userReducer.requestedUserData).toBe('initialValue');
    });
});