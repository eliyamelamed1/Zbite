# class BasePermission(object):
#     """
#     A base class from which all permission classes should inherit.
#     """

#     def has_permission(self, request, view):
#         """
#         Return `True` if permission is granted, `False` otherwise.
#         """
#         return True

#     def has_object_permission(self, request, view, obj):
#         """
#         Return `True` if permission is granted, `False` otherwise.
#         """
#         return True

from django.http import request
from rest_framework import permissions

from apps.posts.recipes.models import Recipe


class IsAuthorOrReadOnly(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        # Read-only permissions are allowed for any request
        if request.method in permissions.SAFE_METHODS: # If a request contains HTTP verbs included in SAFE_METHODS–(a tuple containing GET, OPTIONS, and HEAD)–then it is a read-only request and permission is granted.
            return True
        
        # Write permissions are only allowed to the author of a post
        return obj.author == request.user
class IsAuthorOrAccessDenied(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        # Write permissions are only allowed to the author of a post
        return obj.author == request.user

# Chats
class IsMembersOrAccessDenied(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):

        return request.user in obj.members.all()

