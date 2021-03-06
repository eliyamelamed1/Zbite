import '@testing-library/jest-dom/extend-expect';

import * as DisplayRecipes from '../../components/recipes/DisplayRecipes';
import * as RecipesActions from '../../redux/actions/recipeActions';

import HomePage, { getServerSideProps } from '../../pages';
import { cleanup, render, screen } from '@testing-library/react';

import { Provider } from 'react-redux';
import React from 'react';
import Router from 'next/router';
import { pageRoute } from '../../enums';
import store from '../../redux/store';
import userEvent from '@testing-library/user-event';

jest.mock('next/router');
jest.mock('../../redux/store.tsx');

const displayRecipesSpy = jest.spyOn(DisplayRecipes, 'default');
const loadFollowedRecipesActionSpy = jest.spyOn(RecipesActions, 'loadFollowedRecipesAction');
const loadTrendingRecipesActionSpy = jest.spyOn(RecipesActions, 'loadTrendingRecipesAction');

describe('home page', () => {
    let listOfTrendingRecipes = [
        {
            title: 'trending recipe',
            photo_main: '/recipe image #',
            id: 'trending recipe id',
            author: { id: 'trending recipe author', name: 'name' },
            saves: [],
            stars: 5.0,
        },
        {
            title: 'trending recipe2',
            photo_main: '/recipe image #',
            id: 'trending recipe id2',
            author: { id: 'trending recipe author', name: 'name' },
            saves: [],
            stars: 5.0,
        },
    ];
    let listOfFollowedRecipes = [
        {
            title: 'Followed recipe',
            photo_main: '/recipe image #',
            id: 'Followed recipe id',
            author: { id: 'Followed recipe author', name: 'name2' },
            saves: [],
            stars: 5.0,
        },
        {
            title: 'Followed recipe2',
            photo_main: '/recipe image #',
            id: 'Followed recipe id2',
            author: { id: 'Followed recipe author', name: 'name2' },
            saves: [],
            stars: 5.0,
        },
    ];

    describe('getServerSideProps', () => {
        beforeEach(async () => {
            cleanup();
            jest.clearAllMocks();
            store.getState = () => ({
                recipeReducer: {
                    listOfTrendingRecipes: listOfTrendingRecipes,
                },
            });
        });

        test('getServerSideProps should dispatch loadTrendingRecipesAction', async () => {
            (await getServerSideProps()).props.listOfTrendingRecipes;
            expect(loadTrendingRecipesActionSpy).toHaveBeenCalled();
        });
        // test('getStaticProps - should return matching revalidate', async () => {
        //     const revalidate = (await getServerSideProps()).revalidate;
        //     expect(revalidate).toBe(10);
        // });
        test('getServerSideProps - should return matching props', async () => {
            const props = (await getServerSideProps()).props;
            expect(props.listOfTrendingRecipes).toEqual(listOfTrendingRecipes);
        });
    });

    describe('logged accounts', () => {
        beforeEach(async () => {
            cleanup();
            jest.clearAllMocks();
            store.getState = () => ({
                userReducer: { isUserAuthenticated: true },
                recipeReducer: {
                    listOfTrendingRecipes: listOfTrendingRecipes,
                    listOfFollowedRecipes: listOfFollowedRecipes,
                },
            });

            render(
                <Provider store={store}>
                    <HomePage listOfTrendingRecipes={listOfTrendingRecipes} />
                </Provider>
            );
        });
        test('should render successfully', () => {});

        test('should render trending recipes', () => {
            expect(displayRecipesSpy).toHaveBeenCalled();
            expect(displayRecipesSpy).toHaveBeenCalledWith({ recipesToDisplay: listOfTrendingRecipes }, {});
        });

        test('clicking the following button should dispatch', () => {
            const followingButton = screen.getByRole('button', { name: 'Following' });
            userEvent.click(followingButton);

            expect(loadFollowedRecipesActionSpy.mock.calls.length).toBe(1);
        });

        test('clicking the following button should display followed recipes', async () => {
            const followingButton = screen.getByRole('button', { name: 'Following' });
            userEvent.click(followingButton);

            await expect(displayRecipesSpy).toHaveBeenCalled();
            expect(displayRecipesSpy).toHaveBeenCalledWith({ recipesToDisplay: listOfFollowedRecipes }, {});
        });
        test('clicking trending button after the following button should display trending recipes', async () => {
            const followingButton = screen.getByRole('button', { name: 'Following' });
            await userEvent.click(followingButton);

            const trendingButton = screen.getByRole('button', { name: 'Trending' });
            await userEvent.click(trendingButton);

            expect(displayRecipesSpy).toHaveBeenCalled();
            expect(displayRecipesSpy).toHaveBeenCalledWith({ recipesToDisplay: listOfTrendingRecipes }, {});
        });
    });
    describe('guest accounts', () => {
        beforeEach(async () => {
            cleanup();
            jest.clearAllMocks();
            store.getState = () => ({
                userReducer: { isUserAuthenticated: false },
                recipeReducer: {
                    listOfTrendingRecipes: listOfTrendingRecipes,
                    listOfFollowedRecipes: listOfFollowedRecipes,
                },
            });

            render(
                <Provider store={store}>
                    <HomePage listOfTrendingRecipes={listOfTrendingRecipes} />
                </Provider>
            );
        });
        test('should render successfully', () => {});
        test('should render trending recipes', () => {
            expect(displayRecipesSpy).toHaveBeenCalled();
            expect(displayRecipesSpy).toHaveBeenCalledWith({ recipesToDisplay: listOfTrendingRecipes }, {});
        });
        test('clicking the following button should redirect to login page', () => {
            const followingButton = screen.getByRole('button', { name: 'Following' });
            userEvent.click(followingButton);

            expect(Router.push.mock.calls.length).toBe(1);
            expect(Router.push.mock.calls[0][0]).toBe(pageRoute().login);
        });
    });
});
