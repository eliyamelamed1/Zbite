from .views import ChatMassageCreate, ChatMassageDetails, ChatMassagesInRoom
from django.urls import path


app_name = 'chat_massages'

urlpatterns = [
    path('create/', ChatMassageCreate.as_view(), name='create'),
    path('<uuid:pk>/', ChatMassageDetails.as_view(), name='details'),
    path('massages_in_room/', ChatMassagesInRoom.as_view(), name='massages_in_room'),
]
