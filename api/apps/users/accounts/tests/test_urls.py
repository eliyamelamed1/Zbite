import pytest
from django.urls import resolve, reverse

from factories import UserFactory
pytestmark = pytest.mark.django_db

class TestDetailUrl:
    def test_detail_reverse(self):
        new_user = UserFactory()
        url = reverse('accounts:detail', kwargs={'pk': new_user.id})
        assert url == f'/api/accounts/{new_user.id}/'

    def test_detail_resolve(self):
        new_user = UserFactory()
        url = f'/api/accounts/{new_user.id}/'
        assert resolve(url).view_name == 'accounts:detail'
class TestTopRatedAccountsUrl:
    def test_top_rated_accounts_url_reverse(self):
        url = reverse('accounts:top')
        assert url == f'/api/accounts/top/'

    def test_top_rated_accounts_url_resolve(self):
        url = f'/api/accounts/top/'
        assert resolve(url).view_name == 'accounts:top'
class TestLoggedUserDetailViewUrl:
    def test_logged_user_details_url_reverse(self):
        url = reverse('accounts:logged_user')
        assert url == f'/api/accounts/logged_user/'

    def test_logged_user_details_url_resolve(self):
        url = f'/api/accounts/logged_user/'
        assert resolve(url).view_name == 'accounts:logged_user'

class TestUserSavedRecipes:
    def test_logged_user_saved_recipes_url_reverse(self):
        url = reverse('accounts:saved_recipes')
        assert url == f'/api/accounts/saved_recipes/'
        
    def test_logged_user_saved_recipes_url_resolve(self):
        url = f'/api/accounts/saved_recipes/'
        assert resolve(url).view_name == 'accounts:saved_recipes'
