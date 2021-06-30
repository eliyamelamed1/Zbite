import '@testing-library/jest-dom/extend-expect';

import { cleanup, render, screen, waitFor } from '@testing-library/react';

import { Provider } from 'react-redux';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import UserList from '../../../components/users/UserList';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

describe('UserList', () => {
    const middlewares = [thunk];
    const mockStore = configureStore(middlewares);
    const initialState = {
        authReducer: {},
    };
    const store = mockStore(initialState);
    beforeEach(() => {
        render(
            <Provider store={store}>
                <Router>
                    <UserList />
                </Router>
            </Provider>
        );
    });

    afterEach(() => {
        cleanup();
    });
    test('render without crashing', () => {});
    test('match userList data-test-id', () => {
        expect(screen.getByTestId('userList')).toBeInTheDocument();
    });
    test('renders displayUsers component', () => {
        expect(screen.getByTestId('displayUsers')).toBeInTheDocument();
    });
    test('users displayed successfully', async () => {
        await waitFor(() => expect(store.getActions()[0].type).toBe('LOAD_USER_LIST_SUCCESS'));
    });
});
