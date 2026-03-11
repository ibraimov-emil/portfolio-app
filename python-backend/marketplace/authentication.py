from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth.models import User
from jose import jwt, JWTError
from django.conf import settings
import time

class StrapiJWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return None

        try:
            token = auth_header.split(' ')[1]
        except IndexError:
            return None

        try:
            # Verify token using the shared secret
            payload = jwt.decode(token, settings.JWT_SECRET, algorithms=['HS256'])
        except JWTError:
            raise AuthenticationFailed('Invalid token')

        # Check for expiration if present (Strapi tokens usually have exp)
        if 'exp' in payload and payload['exp'] < time.time():
             raise AuthenticationFailed('Token expired')

        # Map Strapi user to Django User
        # We use the Strapi ID to find or create a local Django user stub
        strapi_id = payload.get('id')
        if not strapi_id:
            raise AuthenticationFailed('Invalid token payload')

        # Use a prefix to avoid collision with potential local admin users
        username = f"strapi_{strapi_id}"
        
        user, created = User.objects.get_or_create(username=username)
        # Store strapi payload in user object purely for request duration if needed
        # user.strapi_payload = payload 
        
        return (user, None)
