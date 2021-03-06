import uuid

from django.contrib.auth import get_user_model
from django.db import models
from django.urls import reverse

from apps.users.accounts.models import UserAccount
from django.contrib.postgres.fields import ArrayField


class Recipe(models.Model):
    id = models.UUIDField( 
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )
    author = models.ForeignKey(get_user_model() , on_delete=models.CASCADE, null=True, related_name='author') 
    photo_main = models.ImageField(upload_to='media/', blank=True)
    title = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    serving = models.TextField()
    cook_time = models.TextField()
    stars = models.FloatField(default=0)
    review_count = models.IntegerField(default=0)
    score = models.FloatField(default=0)
    saves = models.ManyToManyField(get_user_model(), default=None, blank=True)
    instructions_text_list = ArrayField(models.CharField(max_length=100,),default=list, size=15,)
    ingredients_text_list = ArrayField(models.CharField(max_length=100,),default=list, size=15,)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def get_absolute_url(self):
        """Return absolute URL to the Recipe Detail page."""
        return reverse('recipes:detail', kwargs={"pk": self.id})

    def __str__(self):
        return self.title
    
    def get_all_saves(self):
        return self.saves.all().count()

    @classmethod
    def get_recipes_of_followed_accounts(cls, request):
        user = request.user
        user = UserAccount.objects.all().get(id=user.id)
        users_followed = user.following.all()
        recipes_of_followed_accounts = Recipe.objects.none()

        for user in users_followed:
            try:
                recipes_of_followed_accounts = recipes_of_followed_accounts | Recipe.objects.all().filter(author=user.id)

            except:
                pass

        return recipes_of_followed_accounts

    
    # -----urls
    @classmethod
    def get_create_url(cls):
        return reverse('recipes:create')
    
    @classmethod
    def get_recipes_of_accounts_followed_url(cls):
        return reverse('recipes:recipes_of_accounts_followed')
    
    @classmethod
    def get_top_rated_recipes_url(cls):
        return reverse('recipes:top_rated')

    @classmethod
    def get_search_url(cls,value):
        """Return to the Recipe search page."""
        return reverse('recipes:search', kwargs={"value": value})
