from django.urls import path

from .views import (LoggedUserDetailView, SearchUsers, TopRatedAccounts, UserDetailView, UserSavedRecipes, UserOwnRecipes)

app_name = 'accounts'
urlpatterns = [
    path('<uuid:pk>/', UserDetailView.as_view(), name='detail'),
    path('top/', TopRatedAccounts.as_view(), name='top'),
    path('logged_user/', LoggedUserDetailView.as_view(), name='logged_user'),
    path('saved_recipes/', UserSavedRecipes.as_view(), name='saved_recipes'),
    path('own_recipes/<uuid:pk>/', UserOwnRecipes.as_view(), name='own_recipes'),
    path('search/<value>/', SearchUsers.as_view(), name='search'),
]

