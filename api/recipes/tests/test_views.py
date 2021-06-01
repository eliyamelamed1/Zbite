import pytest
from django.urls import resolve, reverse

from accounts.models import UserAccount
from factories import RecipeFactory, UserFactory
from recipes.models import Recipe

# add test to get info from recipe detail page
# ------------------------------------------------ Tests
pytestmark = pytest.mark.django_db
recipe_list_url = Recipe.get_list_url()
create_recipe_url = Recipe.get_create_url()
search_recipe_url = Recipe.get_search_url()

followed_users_recipes_url = Recipe.get_followed_users_recipes_url()
top_rated_recipes_url = Recipe.get_top_rated_recipes_url()

class TestRecipeListView:
    class TestAuthenticatedUsers:
        def test_recipe_list_page_render(self, api_client):
            new_user = UserAccount()
            api_client.force_authenticate(new_user)

            recipe_list_page_render = api_client.get(recipe_list_url)

            assert recipe_list_page_render.status_code == 200

    class TestGuestUsers:
        def test_recipe_list_page_render(self, api_client):
            recipe_list_page_render = api_client.get(recipe_list_url)

            assert recipe_list_page_render.status_code == 200


class TestRecipeCreateView:
    class TestAuthenticatedUsers:
        def test_recipe_create_page_render(self, api_client):
            new_user = UserAccount()
            api_client.force_authenticate(new_user)
            create_recipe_page_render = api_client.get(create_recipe_url)

            assert create_recipe_page_render.status_code == 405 # 405 = method not allowed - get isnt allowed only post

        def test_recipe_create_post_request(self, api_client):
            new_user = UserFactory()
            api_client.force_authenticate(new_user)
            recipe_data = RecipeFactory.build()
            data = {
                'title': {recipe_data.title},
                'description': {recipe_data.description},
                'flavor_type': {recipe_data.flavor_type}, 
            }
            response = api_client.post(create_recipe_url, data)

            assert response.status_code == 201
        
        def test_recipe_author_is_current_logged_in_user(self, api_client):
                ''' testing the method perform_create '''
                first_user = UserFactory()
                api_client.force_authenticate(first_user)
                recipe_data = RecipeFactory.build()
                data = {
                    'title': {recipe_data.title},
                    'description': {recipe_data.description},
                    'flavor_type': {recipe_data.flavor_type}, 
                }
                api_client.post(create_recipe_url, data)
                new_recipe = Recipe.objects.get(title=recipe_data.title)

                assert new_recipe.author == first_user


    class TestGuestUsers:
        def test_recipe_create_page_should_not_render(self, api_client):
            response = api_client.get(create_recipe_url)

            assert response.status_code == 401 

        def test_recipe_create_post_request_not_allowed(self, api_client):
            new_user = UserFactory()
            recipe_data = RecipeFactory.build()
            data = {
                'author': {new_user.id},
                'title': {recipe_data.title},
                'description': {recipe_data.description},
                'flavor_type': {recipe_data.flavor_type}, 
            }
            response = api_client.post(create_recipe_url, data)            

            assert response.status_code == 401


class TestRecipeSearchView:
    class TestAuthenticatedUsers:
        def test_recipe_search_page_render(self, api_client):
            new_user = UserAccount()
            api_client.force_authenticate(new_user)
            response = api_client.get(search_recipe_url)

            assert response.status_code == 405 # 405 = method not allowed - get isnt allowed only post

        def test_recipe_search_post_request_allowed(self, api_client, signup_and_login, search_recipe_response):
            response = search_recipe_response

            assert response.status_code == 200


    class TestGuestUsers:
        def test_recipe_search_page_render(self, api_client):
            response = api_client.get(search_recipe_url)

            assert response.status_code == 405 # 405 = method not allowed - get isnt allowed only post

        def test_recipe_search_post_request_allowed(self,api_client,search_recipe_response):
            response = search_recipe_response

            assert response.status_code == 200

class TestRecipeDetailsView:
        class TestAuthenticatedUsers:
            def test_recipe_detail_page_render(self ,api_client):
                new_recipe = RecipeFactory()
                api_client.force_authenticate(new_recipe.author)
                response = api_client.get(new_recipe.get_absolute_url())

                assert response.status_code == 200
                
        class TestGuestUsers:
            def test_recipe_detail_page_render(self, api_client):
                new_recipe = RecipeFactory()
                response = api_client.get(new_recipe.get_absolute_url())

                assert response.status_code == 200



class TestDeleteRecipeView:
    class TestIsAuthorOrReadOnly:
        def test_author_can_delete_own_recipe(self, api_client):
            new_recipe = RecipeFactory()
            api_client.force_authenticate(new_recipe.author)
            response = api_client.delete(new_recipe.get_absolute_url())

            assert response.status_code == 204 

        def test_not_author_cant_delete_recipe(self, api_client):
            new_recipe = RecipeFactory()
            random_user = UserFactory()
            api_client.force_authenticate(random_user)
            response = api_client.delete(new_recipe.get_absolute_url())

            assert response.status_code == 403

    class TestGuestUsers:
        def test_recipe_delete(self, api_client):
            new_recipe = RecipeFactory()
            response = api_client.delete(new_recipe.get_absolute_url())

            assert response.status_code == 401


# TODO - add test put REQUEST test (update the whole data)
class TestUpdateRecipeView:
    class TestIsAuthorOrReadOnly:
        def test_author_can_update_own_recipe(self, api_client):
            new_recipe = RecipeFactory()
            api_client.force_authenticate(new_recipe.author)
            data = {
                'title': 'updated title'
            }
            response = api_client.patch(new_recipe.get_absolute_url(), data)

            assert response.status_code == 200
        
        def test_not_author_cant_update_recipe(self, api_client): 
            new_recipe = RecipeFactory()
            random_user = UserFactory()
            api_client.force_authenticate(random_user)
            data = {
                'title': 'updated title'
            }
            response = api_client.patch(new_recipe.get_absolute_url(), data)

            assert response.status_code == 403

    class TestGuestUsers:
        def test_guest_user_cant_update_recipe(self, api_client):
            first_recipe = RecipeFactory()
            data = {
                'title': 'updated title'
            }
            response = api_client.patch(first_recipe.get_absolute_url(), data)

            assert response.status_code == 401
        
class TestRecipesOfAccountsFollowedView:
    class TestAuthenticatedUsers:
        def test_followed_users_recipes_page_should_render(self, api_client):
            new_user = UserFactory()
            api_client.force_authenticate(new_user)

            response = api_client.get(followed_users_recipes_url) 

            assert response.status_code == 200
        
        def test_should_only_display_recipes_of_users_that_in_account_following_list(self, api_client):
            first_user = RecipeFactory().author
            api_client.force_authenticate(first_user)
            
            second_recipe = RecipeFactory()
            third_recipe = RecipeFactory()

            first_user.following.add(second_recipe.author)

            response = api_client.get(followed_users_recipes_url)

            assert f'{second_recipe}' in f'{response.content}'
            assert f'{third_recipe}' not in f'{response.content}'

        def test_should_display_all_recipes_of_users_that_in_account_following_list(self, api_client):
            first_user = RecipeFactory().author
            
            second_user = UserFactory()
            api_client.force_authenticate(second_user)
            for i in range(10):
                recipe_data = RecipeFactory.build()
                data = {
                    'title': {recipe_data.title},
                    'description': {recipe_data.description},
                    'flavor_type': {recipe_data.flavor_type}, 
                }
                api_client.post(create_recipe_url, data)
            
            api_client.logout()
            api_client.force_authenticate(first_user)
            first_user.following.add(second_user)

            response = api_client.get(followed_users_recipes_url)
            recipes = Recipe.objects.all().filter(author=second_user)

            for recipe in recipes:
                assert f'{recipe}' in f'{response.content}'
    class TestGuestUsers:
        def test_followed_users_recipes_page_should_not_render(self, api_client):
            response = api_client.get(followed_users_recipes_url) 

            assert response.status_code == 401

class TestTopRatedRecipes:
    class TestAuthenticatedUsers:
        def test_top_rated_recipes_page_should_render(self, api_client):
            new_user = UserFactory()
            api_client.force_authenticate(new_user)
            response = api_client.get(top_rated_recipes_url) 

            assert response.status_code == 200
    

        def test_should_display_top_rated_recipes(self, api_client):
            for i in range(10):
                new_user = UserFactory() 
                api_client.force_authenticate(new_user)
                recipe_data = RecipeFactory.build()
                data = {
                    'title': {recipe_data.title},
                    'description': {recipe_data.description},
                    'flavor_type': {recipe_data.flavor_type}, 
                }
                api_client.post(create_recipe_url, data)
                new_recipe = Recipe.objects.all().get(title=recipe_data.title)
                new_recipe.stars = 5
                new_recipe.save()
                api_client.logout()

            for i in range(10):
                new_user = UserFactory() 
                api_client.force_authenticate(new_user)
                recipe_data = RecipeFactory.build()
                data = {
                    'title': {recipe_data.title},
                    'description': {recipe_data.description},
                    'flavor_type': {recipe_data.flavor_type}, 
                }
                api_client.post(create_recipe_url, data)
                new_recipe = Recipe.objects.all().get(title=recipe_data.title)
                new_recipe.stars = 4
                new_recipe.save()
                api_client.logout()
            
            api_client.force_authenticate(new_user)
            response = api_client.get(top_rated_recipes_url)
            top_rated_recipes = Recipe.objects.all().filter(stars=5)
            bottom_rated_recipes = Recipe.objects.all().filter(stars=4)

            for recipe in top_rated_recipes:
                assert f'{recipe}' in f'{response.content}'
                
            for recipe in bottom_rated_recipes:
                assert f'{recipe}' not in f'{response.content}'
                
    class TestGuestUsers:
        def test_top_rated_recipes_page_should_render(self, api_client):
            response = api_client.get(top_rated_recipes_url) 

            assert response.status_code == 200

        def test_should_display_top_rated_recipes(self, api_client):
            for i in range(10):
                new_user = UserFactory() 
                api_client.force_authenticate(new_user)
                recipe_data = RecipeFactory.build()
                data = {
                    'title': {recipe_data.title},
                    'description': {recipe_data.description},
                    'flavor_type': {recipe_data.flavor_type}, 
                }
                api_client.post(create_recipe_url, data)
                new_recipe = Recipe.objects.all().get(title=recipe_data.title)
                new_recipe.stars = 5
                new_recipe.save()
                api_client.logout()

            for i in range(10):
                new_user = UserFactory() 
                api_client.force_authenticate(new_user)
                recipe_data = RecipeFactory.build()
                data = {
                    'title': {recipe_data.title},
                    'description': {recipe_data.description},
                    'flavor_type': {recipe_data.flavor_type}, 
                }
                api_client.post(create_recipe_url, data)
                new_recipe = Recipe.objects.all().get(title=recipe_data.title)
                new_recipe.stars = 4
                new_recipe.save()
                api_client.logout()
            
            response = api_client.get(top_rated_recipes_url)
            top_rated_recipes = Recipe.objects.all().filter(stars=5)
            bottom_rated_recipes = Recipe.objects.all().filter(stars=4)

            for recipe in top_rated_recipes:
                assert f'{recipe}' in f'{response.content}'
                
            for recipe in bottom_rated_recipes:
                assert f'{recipe}' not in f'{response.content}'
            
