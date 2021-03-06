import pytest
from django.urls import resolve, reverse

from factories import RecipeFactory

pytestmark = pytest.mark.django_db


class TestCreateUrl:
    def test_create_reverse(self):
        assert reverse('recipes:create') == '/api/recipes/create/'

    def test_create_resolve(self):
        assert resolve('/api/recipes/create/').view_name == 'recipes:create'

class TestDetailUrl:
    def test_detail_reverse(self):
        new_recipe = RecipeFactory()
        url = reverse('recipes:detail', kwargs={'pk': new_recipe.id})
        assert url == f'/api/recipes/{new_recipe.id}/'

    def test_detail_resolve(self):
        new_recipe = RecipeFactory()
        url = f'/api/recipes/{new_recipe.id}/'
        assert resolve(url).view_name == 'recipes:detail'

class TestFollowedUsersRecipesUrl:
    def test_followed_account_recipes_reverse(self):
        url = reverse('recipes:recipes_of_accounts_followed')
        assert url == f'/api/recipes/recipes_of_accounts_followed/'

    def test_followed_account_recipes_resolve(self):
        url = f'/api/recipes/recipes_of_accounts_followed/'
        assert resolve(url).view_name == 'recipes:recipes_of_accounts_followed'
class TestTopRatedRecipesUrl:
    def test_top_rated_recipes_url_reverse(self):
        url = reverse('recipes:top_rated')
        assert url == f'/api/recipes/top_rated/'

    def test_top_rated_recipes_url_resolve(self):
        url = f'/api/recipes/top_rated/'
        assert resolve(url).view_name == 'recipes:top_rated'
