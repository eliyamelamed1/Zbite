import uuid

from django.contrib.auth import get_user_model
from django.db import models
from django.urls import reverse

from accounts.models import UserAccount


class Recipe(models.Model):
    class FlavorType(models.TextChoices):
        SOUR = 'Sour'
        SWEET = 'Sweet'
        SALTY = 'Salty'

    id = models.UUIDField( 
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )
    author = models.ForeignKey(get_user_model() , on_delete=models.CASCADE, null=True, related_name='author') # TODO - change author to profile
    title = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    flavor_type = models.CharField(max_length=50, choices=FlavorType.choices)
    photo_main = models.ImageField(upload_to='media/', blank=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    likes = models.ManyToManyField(get_user_model(), default=None, blank=True)
    stars = models.TextField(blank=True)

    def __str__(self):
        return self.title
    
    def get_all_likes(self):
        return self.likes.all().count()

    def get_absolute_url(self):
        """Return absolute URL to the Recipe Detail page."""
        return reverse('recipes:detail', kwargs={"pk": self.id})

    @classmethod
    def get_create_url(cls):
        return reverse('recipes:create')
    
    @classmethod
    def get_search_url(cls):
        return reverse('recipes:search')
    
    @classmethod
    def get_list_url(cls):
        return reverse('recipes:list')

    @classmethod
    def get_followed_users_recipes_url(cls):
        return reverse('recipes:followed')
        
    @classmethod
    def get_top_rated_recipes_url(cls):
        return reverse('recipes:top')

    @classmethod
    def get_users_followed(cls, request):
        user = request.user
        user = UserAccount.objects.all().get(id=user.id)
        users_followed = user.following.all()
        all_recipes = Recipe.objects.none()

        for user in users_followed:
            try:
                all_recipes = all_recipes | Recipe.objects.all().filter(author=user.id)

            except:
                pass

        return all_recipes