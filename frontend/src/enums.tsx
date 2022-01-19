export const endpointRoute = (id = '') => ({
    users: {
        followUser: `${process.env.NEXT_PUBLIC_API_URL}/api/followers/follow/`,
        loggedUserData: `${process.env.NEXT_PUBLIC_API_URL}/api/accounts/logged_user/`,
        login: `${process.env.NEXT_PUBLIC_API_URL}/api/djoser/token/login/`,
        logout: `${process.env.NEXT_PUBLIC_API_URL}/api/djoser/token/logout/`,
        signup: `${process.env.NEXT_PUBLIC_API_URL}/api/djoser/users/`,
        activate: `${process.env.NEXT_PUBLIC_API_URL}/api/djoser/users/activation/`,
        resetPassword: `${process.env.NEXT_PUBLIC_API_URL}/api/djoser/users/reset_password/`,
        resetPasswordConfirm: `${process.env.NEXT_PUBLIC_API_URL}/api/djoser/users/reset_password_confirm/`,
        details: `${process.env.NEXT_PUBLIC_API_URL}/api/accounts/${id}/`,
        leaderboard: `${process.env.NEXT_PUBLIC_API_URL}/api/accounts/top/`,
    },
    recipes: {
        create: `${process.env.NEXT_PUBLIC_API_URL}/api/recipes/create/`,
        trending: `${process.env.NEXT_PUBLIC_API_URL}/api/recipes/top_rated/`,
        followed: `${process.env.NEXT_PUBLIC_API_URL}/api/recipes/recipes_of_accounts_followed/`,
        details: `${process.env.NEXT_PUBLIC_API_URL}/api/recipes/${id}/`,
        saved_recipes: `${process.env.NEXT_PUBLIC_API_URL}/api/accounts/saved_recipes/`,
        save: `${process.env.NEXT_PUBLIC_API_URL}/api/saves/save/`,
        userOwnRecipes: `${process.env.NEXT_PUBLIC_API_URL}/api/accounts/own_recipes/${id}/`,
        search: `${process.env.NEXT_PUBLIC_API_URL}/api/recipes/search/${id}/`,
    },
    reviews: {
        create: `${process.env.NEXT_PUBLIC_API_URL}/api/reviews/create/`,
        delete: `${process.env.NEXT_PUBLIC_API_URL}/api/reviews/delete/${id}/`,
        reviews_in_recipe: `${process.env.NEXT_PUBLIC_API_URL}/api/reviews/reviews_in_recipe/`,
    },
    ingredients: {
        create: `${process.env.NEXT_PUBLIC_API_URL}/api/ingredients/create/`,
        detail: `${process.env.NEXT_PUBLIC_API_URL}/api/ingredients/${id}/`,
    },
    instructions: {
        create: `${process.env.NEXT_PUBLIC_API_URL}/api/instructions/create/`,
        detail: `${process.env.NEXT_PUBLIC_API_URL}/api/instructions/${id}/`,
    },
});
export const pageRoute = (id = '') => ({
    home: '/',
    login: '/users/UserLogin',
    signup: '/users/UserSignup',
    profile: `/users/${id}`,
    leaderboard: '/users/Leaderboard',
    savedRecipes: '/recipes/SavedRecipes',
    createRecipe: '/recipes/RecipeCreate',
    reset_password: '/users/reset_password/UserResetPassword',
    recipeProfile: `/recipes/${id}/`,
    search: '/{id}/',
});

export const typeOfRecipesEnum = {
    trending: 'trending',
    following: 'following',
};

// tests
export const userParams = {
    loggedUser: {
        id: 'loggedUserId',
        email: 'loggedUser@gmail.com',
        name: 'loggedUser',
        following: [],
        followers: [],
    },
    otherUser: {
        id: 'otherUserId',
        email: 'otherUser@gmail.com',
        name: 'otherUser',
        following: [],
        followers: [],
    },
    otherUser2: {
        id: 'otherUser2',
        email: 'otherUser2@gmail.com',
        name: 'otherUser2',
        following: [],
        followers: [],
    },

    nonExistingUser: {},
};

export const reviewParams = {
    author: { name: 'authorName', id: 'authorId', photo_main: null },
    recipe: 'recipeId',
    stars: '5',
    comment: 'commentText',
    image: null,
    id: 'reviewId',
    created_at: '2022-01-03T16:36:24.778530Z',
};
