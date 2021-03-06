import '@testing-library/jest-dom/extend-expect';

import * as IsRecipeAuthor from '../../../components/recipes/IsRecipeAuthor';
import * as ReviewCreate from '../../../components/reviews/ReviewCreate';
import * as recipeActions from '../../../redux/actions/recipeActions';

import { TEST_CASE_AUTH, TEST_CASE_RECIPE } from '../../../redux/constants';
import { cleanup, render, screen } from '@testing-library/react';

import { Provider } from 'react-redux';
import React from 'react';
import RecipeDetails from '../../../pages/recipes/[RecipeDetails_Id]';
import axios from 'axios';
import { getServerSideProps } from '../../../pages/recipes/[RecipeDetails_Id]';
import store from '../../../redux/store';
import userEvent from '@testing-library/user-event';

const loadRecipeDetailsActionSpy = jest.spyOn(recipeActions, 'loadRecipeDetailsAction');
const reviewsInRecipeActionSpy = jest.spyOn(recipeActions, 'reviewsInRecipeAction');
const ReviewCreateSpy = jest.spyOn(ReviewCreate, 'default');
const IsRecipeAuthorSpy = jest.spyOn(IsRecipeAuthor, 'default');

const recipeParams = {
    existingRecipeId: '5',
    nonExistingRecipeId: 'nonExistingRecipe',
    recipeData: {
        id: '5',
        title: 'recipeTitle',
        description: 'recipeDescription',
        author: { id: 'eliya', name: 'name' },
        photo_main: '/#',
        ingredients_text_list: ['tomato'],
        instructions_text_list: ['buy tomato'],
    },
};
const contextParams = {
    existingRecipe: {
        params: { RecipeDetails_Id: recipeParams.existingRecipeId },
    },
    nonExistingRecipe: {
        params: { RecipeDetails_Id: recipeParams.nonExistingRecipeId },
    },
};

const listOfReviews = [
    {
        recipe: 'bacon',
        id: '1',
        author: { id: 'eliya', name: 'name' },
        stars: '5',
        comment: 'new comment',
        created_at: '2022-01-03T16:36:24.778530Z',
    },
];

describe('RecipeDetails - getServerSideProps', () => {
    beforeEach(() => {
        cleanup();
        jest.clearAllMocks();
        axios.get.mockReturnValueOnce({ data: recipeParams.recipeData });
        axios.post.mockReturnValueOnce({ data: 'reviews data' });
    });
    test('should dispatch loadRecipeDetailsAction', async () => {
        await getServerSideProps(contextParams.existingRecipe);
        const timesActionDispatched = loadRecipeDetailsActionSpy.mock.calls.length;

        expect(timesActionDispatched).toBe(1);
        expect(loadRecipeDetailsActionSpy.mock.calls[0][0].id).toBe(recipeParams.existingRecipeId);
    });
    test('should dispatch reviewsInRecipeAction', async () => {
        await getServerSideProps(contextParams.existingRecipe);
        const timesActionDispatched = reviewsInRecipeActionSpy.mock.calls.length;

        expect(timesActionDispatched).toBe(1);
        expect(reviewsInRecipeActionSpy.mock.calls[0][0].recipeId).toBe(recipeParams.existingRecipeId);
    });
    test('should return matching props', async () => {
        const props = (await getServerSideProps(contextParams.existingRecipe)).props;
        expect(props.serverRecipeData).toEqual(recipeParams.recipeData);
        expect(props.serverReviewsData).toEqual('reviews data');
    });
    test('if recipe doesnt exist return not found', async () => {
        const notFound = (await getServerSideProps(contextParams.nonExistingRecipe)).notFound;
        expect(notFound).toEqual(true);
    });
});

describe('RecipeDetails - recipe author', () => {
    const userInitialState = {
        loggedUserData: { id: 'eliya' },
        isUserAuthenticated: true,
    };
    const recipeInitialState = {
        requestedRecipeData: {
            id: '5',
            title: 'recipeTitle',
            description: 'recipeDescription',
            author: { id: 'eliya', name: 'name' },
            saves: [],
            photo_main: '/#',
            ingredients_text_list: ['onion'],
            instructions_text_list: ['buy onion'],
        },
        listOfFilteredReviews: null,
    };

    let updatedRecipe = {
        id: '5',
        title: 'updatedRecipeTitle',
        description: 'updatedRecipeDescription',
        author: { id: 'eliya', name: 'name' },
        saves: ['someUser'],
        photo_main: '/#',
    };
    beforeEach(async () => {
        jest.clearAllMocks();
        cleanup();

        store.dispatch({ type: TEST_CASE_AUTH, payload: userInitialState });
        store.dispatch({ type: TEST_CASE_RECIPE, payload: recipeInitialState });

        const serverRecipeData = recipeParams.recipeData;
        const serverReviewsData = listOfReviews;
        render(
            <Provider store={store}>
                <RecipeDetails serverRecipeData={serverRecipeData} serverReviewsData={serverReviewsData} />
            </Provider>
        );
    });

    test('should render without crashing', () => {});
    test('should render match own data-testid', () => {
        const recipeDetailsTestId = screen.getByTestId('recipeDetails');
        expect(recipeDetailsTestId).toBeInTheDocument();
    });
    test('should render the recipe details ', () => {
        const recipeTitle = screen.getByText(/recipeTitle/i);
        const recipeDescription = screen.getByText(/recipeDescription/i);

        expect(recipeTitle).toBeInTheDocument();
        expect(recipeDescription).toBeInTheDocument();
    });
    test('authorLinks should contain IsRecipeAuthor component', () => {
        const optionsDotsButton = screen.getByTestId('optionsDots');
        userEvent.click(optionsDotsButton);
        expect(IsRecipeAuthorSpy).toHaveBeenCalled();
    });
    test('IsRecipeAuthor should render RecipeUpdate component', () => {
        const optionsDotsButton = screen.getByTestId('optionsDots');
        userEvent.click(optionsDotsButton);
        const recipeUpdateTestId = screen.getByTestId('recipeUpdate');

        expect(recipeUpdateTestId).toBeInTheDocument();
    });
    test('should render ReviewCreate', () => {
        expect(ReviewCreateSpy).toHaveBeenCalled();
        expect(ReviewCreateSpy.mock.calls[0][0].recipeId).toBe(recipeParams.recipeData.id);
    });
    test('should display updated recipeData', async () => {
        // migrateRequestedRecipeData isUserDataMatchReqId === true
        const initialState = {
            requestedRecipeData: updatedRecipe,
        };
        await store.dispatch({ type: TEST_CASE_RECIPE, payload: initialState });
        const updatedTitle = await screen.findByText(updatedRecipe.title);
        const updatedDescription = await screen.findByText(updatedRecipe.description);
        const updatedSaves = await screen.findByTestId('savesCount');

        expect(updatedTitle).toBeInTheDocument();
        expect(updatedDescription).toBeInTheDocument();
        expect(updatedSaves.innerHTML).toBe('1');
    });
    test('should not display updated recipe data of other recipe', async () => {
        updatedRecipe = {
            ...updatedRecipe,
            id: 'differentRecipeId',
        };
        const initialState = {
            requestedRecipeData: updatedRecipe,
        };
        await store.dispatch({ type: TEST_CASE_RECIPE, payload: initialState });
        const updatedTitle = await screen.queryByText(updatedRecipe.title);
        const updatedDescription = await screen.queryByText(updatedRecipe.description);

        expect(updatedTitle).not.toBeInTheDocument();
        expect(updatedDescription).not.toBeInTheDocument();
    });
    test('should display updated reviewsData', async () => {
        // migrateListOfFilteredReviews isReviewsOfThisRecipe === true -
        const initialState = {
            listOfFilteredReviews: [
                {
                    recipe: '5',
                    id: '1',
                    author: { id: 'eliya', name: 'name' },
                    stars: '1.2',
                    comment: 'updated comment',
                    created_at: '2032-01-03T16:36:24.778530Z',
                },
            ],
        };
        await store.dispatch({ type: TEST_CASE_RECIPE, payload: initialState });

        const updatedStars = await screen.findByText(/(1.2)/i);
        expect(updatedStars).toBeInTheDocument();
    });
    test('should not display updated review data of other recipe', async () => {
        // migrateListOfFilteredReviews isReviewsOfThisRecipe === false
        const initialState = {
            listOfFilteredReviews: [
                {
                    recipe: 'pizza',
                    id: '1',
                    author: { id: 'eliya', name: 'name' },
                    stars: 'updated stars',
                    comment: 'updated comment',
                    created_at: '2043-01-03T16:36:24.778530Z',
                },
            ],
        };
        await store.dispatch({ type: TEST_CASE_RECIPE, payload: initialState });

        const updatedStars = await screen.queryByText(/updated stars/i);
        expect(updatedStars).not.toBeInTheDocument();
    });
});

describe('RecipeDetails - not the recipe author', () => {
    const userInitialState = {
        loggedUserData: { id: 'eilon' },
        isUserAuthenticated: true,
    };
    const recipeInitialState = {
        requestedRecipeData: {
            id: '5',
            title: 'recipeTitle',
            description: 'recipeDescription',
            author: { id: 'eliya', name: 'name' },
            saves: [],
            photo_main: '/#',
            ingredients_text_list: ['cucumber'],
            instructions_text_list: ['buy cucumber'],
        },
        listOfFilteredReviews: null,
    };
    beforeEach(async () => {
        cleanup();
        jest.clearAllMocks();

        store.dispatch({ type: TEST_CASE_AUTH, payload: userInitialState });
        store.dispatch({ type: TEST_CASE_RECIPE, payload: recipeInitialState });

        const serverRecipeData = recipeParams.recipeData;
        const serverReviewsData = listOfReviews;

        render(
            <Provider store={store}>
                <RecipeDetails serverRecipeData={serverRecipeData} serverReviewsData={serverReviewsData} />
            </Provider>
        );
    });

    test('should render without crashing', () => {});
    test('should render match own data-testid', () => {
        const recipeDetailsTestId = screen.getByTestId('recipeDetails');
        expect(recipeDetailsTestId).toBeInTheDocument();
    });

    test('should render the recipe details ', () => {
        const recipeTitle = screen.getByText(/recipeTitle/i);
        const recipeDescription = screen.getByText(/recipeDescription/i);

        expect(recipeTitle).toBeInTheDocument();
        expect(recipeDescription).toBeInTheDocument();
    });
    test('should not render authorLinks', () => {
        const authorLinks = screen.queryByTestId('authorLinks');
        expect(authorLinks).not.toBeInTheDocument();
    });
    test('authorLinks should contain IsRecipeAuthor component', () => {
        const optionsDotsButton = screen.getByTestId('optionsDots');
        userEvent.click(optionsDotsButton);
        expect(IsRecipeAuthorSpy).toHaveBeenCalled();
    });
    test('IsRecipeAuthor should not render RecipeUpdate component', () => {
        const optionsDotsButton = screen.getByTestId('optionsDots');
        userEvent.click(optionsDotsButton);
        const recipeUpdateTestId = screen.queryByTestId('recipeUpdate');

        expect(recipeUpdateTestId).not.toBeInTheDocument();
    });
    test('should render ReviewCreate', () => {
        expect(ReviewCreateSpy).toHaveBeenCalled();
        expect(ReviewCreateSpy.mock.calls[0][0].recipeId).toBe(recipeParams.recipeData.id);
    });
    test('should display updated reviewsData', async () => {
        // migrateListOfFilteredReviews isReviewsOfThisRecipe === true
        const initialState = {
            listOfFilteredReviews: [
                {
                    recipe: '5',
                    id: '1',
                    author: { id: 'eliya', name: 'name' },
                    stars: '1.2',
                    comment: 'updated comment',
                    created_at: '2025-01-03T16:36:24.778530Z',
                },
            ],
        };
        await store.dispatch({ type: TEST_CASE_RECIPE, payload: initialState });

        const updatedStars = await screen.findByText(/(1.2)/i);
        expect(updatedStars).toBeInTheDocument();
    });
    test('should no display updated reviewsData of other recipe', async () => {
        // migrateListOfFilteredReviews isReviewsOfThisRecipe === false
        const initialState = {
            listOfFilteredReviews: [
                { recipe: 'pizza', id: '1', author: 'eliya', stars: 'updated stars', comment: 'updated comment' },
            ],
        };
        await store.dispatch({ type: TEST_CASE_RECIPE, payload: initialState });

        const updatedStars = await screen.queryByText(/updated stars/i);
        expect(updatedStars).not.toBeInTheDocument();
    });
});
describe('RecipeDetails - guest user', () => {
    const userInitialState = {
        isUserAuthenticated: null,
    };
    const recipeInitialState = {
        requestedRecipeData: {
            id: '5',
            title: 'recipeTitle',
            description: 'recipeDescription',
            author: { id: 'eliya', name: 'name' },
            photo_main: '/#',
            ingredients_text_list: ['apple'],
            instructions_text_list: ['buy apple'],
        },
        listOfFilteredReviews: null,
    };
    beforeEach(async () => {
        cleanup();
        jest.clearAllMocks();

        store.dispatch({ type: TEST_CASE_AUTH, payload: userInitialState });
        store.dispatch({ type: TEST_CASE_RECIPE, payload: recipeInitialState });

        const serverRecipeData = recipeParams.recipeData;
        const serverReviewsData = listOfReviews;

        render(
            <Provider store={store}>
                <RecipeDetails serverRecipeData={serverRecipeData} serverReviewsData={serverReviewsData} />
            </Provider>
        );
    });

    test('should render without crashing', () => {});

    test('should render match own data-testid', () => {
        const recipeDetailsTestId = screen.getByTestId('recipeDetails');
        expect(recipeDetailsTestId).toBeInTheDocument();
    });

    test('should render the recipe details ', () => {
        const recipeTitle = screen.getByText(/recipeTitle/i);
        const recipeDescription = screen.getByText(/recipeDescription/i);

        expect(recipeTitle).toBeInTheDocument();
        expect(recipeDescription).toBeInTheDocument();
    });
    test('should not render RecipeUpdate component', () => {
        const recipeUpdateTestId = screen.queryByTestId('recipeUpdate');

        expect(recipeUpdateTestId).not.toBeInTheDocument();
    });
    test('should not render ReviewCreate', () => {
        expect(ReviewCreateSpy).toHaveBeenCalled();
    });
});
