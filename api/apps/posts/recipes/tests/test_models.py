import pytest
from django.urls import reverse

from factories import RecipeFactory, UserFactory
from apps.posts.recipes.models import Recipe

pytestmark = pytest.mark.django_db

def test__str__():
    new_recipe = RecipeFactory()

    assert new_recipe.__str__() == new_recipe.title

def test_get_absolute_url():
    new_recipe = RecipeFactory()
    
    assert new_recipe.get_absolute_url() == reverse('recipes:detail', kwargs={"pk": new_recipe.id})

def test_get_create_url():
    assert Recipe.get_create_url() == reverse('recipes:create')

def test_get_recipes_of_accounts_followed_url():
    assert Recipe.get_recipes_of_accounts_followed_url() == reverse('recipes:recipes_of_accounts_followed')

def test_get_top_rated_recipes_url():
    assert Recipe.get_top_rated_recipes_url() == reverse('recipes:top_rated')

def test_get_all_saves(api_client):
    new_recipe = RecipeFactory()
    new_user = new_recipe.author
    api_client.force_authenticate(new_user)
    save_url = reverse('saves:save')
    data = {
        'recipe': new_recipe.id
    }
    api_client.post(save_url, data)
    api_client.logout()

    new_user = UserFactory()
    api_client.force_authenticate(new_user)
    save_url = reverse('saves:save')
    data = {
        'recipe': new_recipe.id
    }
    api_client.post(save_url, data)


    assert new_recipe.get_all_saves() == 2
    assert new_recipe.get_all_saves() == new_recipe.saves.all().count()