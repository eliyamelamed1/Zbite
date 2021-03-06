from django.contrib.postgres.search import (SearchQuery, SearchRank,
                                            SearchVector)
from rest_framework import permissions
from rest_framework.generics import (CreateAPIView, ListAPIView,
                                     RetrieveUpdateDestroyAPIView)

from apps.posts.recipes.documents import RecipeDocument
from apps.users.accounts.models import UserAccount
from permissions import IsAuthorOrReadOnly

from .models import Recipe
from .serializers import (RecipeCreateSerializer, RecipeSearchSerializer,
                          RecipeSerializer)


class RecipeDetail(RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAuthorOrReadOnly,)
    queryset = Recipe.objects.order_by('-updated_at')
    serializer_class = RecipeSerializer

    def perform_destroy(self, serializer):
        serializer.delete()
        author = UserAccount.objects.get(id=self.request.user.id)
        recipe_count = Recipe.objects.filter(author=author).count()
        author.recipe_count = recipe_count
        author.save()
        

class RecipeCreate(CreateAPIView):
    permission_classes = (permissions.IsAuthenticated, )
    queryset = Recipe.objects.all()
    serializer_class = RecipeCreateSerializer

    def perform_create(self, serializer):
        '''save the the current logged in user as the author of the recipe'''
        serializer.save(author=self.request.user)
        
        author = UserAccount.objects.get(id=self.request.user.id)
        recipe_count = Recipe.objects.filter(author=author).count() 
        author.recipe_count = recipe_count
        author.save()
        

class RecipesOfAccountsFollowed(ListAPIView):
    '''display the recipes of followed users'''
    serializer_class = RecipeSerializer
    permission_classes = (permissions.IsAuthenticated, )

    def get_queryset(self):
        all_recipes = Recipe.get_recipes_of_followed_accounts(self.request)
        queryset = all_recipes.order_by('-created_at')

        return queryset
    
class TopRatedRecipes(ListAPIView):
    '''display the top rated recipes'''
    serializer_class = RecipeSerializer
    queryset = Recipe.objects.order_by('-score')[:10]



class SearchRecipes(ListAPIView):
    serializer_class = RecipeSearchSerializer

    def get_queryset(self, *args, **kwargs):
        value = self.kwargs['value']

        # search 
        elastic_queryset = RecipeDocument.search().query('wildcard',title=f'*{value}*').sort("-score")
        
        # temporary solution (cause elasticsearch fails to index photo_main fields + saves field)
        postgres_queryset = []
        for recipe in elastic_queryset:
            try:
                postgres_queryset.append(Recipe.objects.get(id=recipe.id))
            except:
                pass

        return postgres_queryset
