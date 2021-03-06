import os
from pathlib import Path

from environs import Env

env = Env()
env.read_env()

# Build paths inside the project save this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


ALLOWED_HOSTS = ['127.0.0.1', 'localhost', 'zbite.herokuapp.com',]

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',
    'django.contrib.postgres',
    
    # browser api
    'dj_rest_auth',

    #3rd party
    'whitenoise.runserver_nostatic',
    'djoser',
    'corsheaders',
    'rest_framework',
    'rest_framework.authtoken',
    'django_extensions',
    'drf_yasg', # docs
    'elasticsearch_dsl',
    'django_elasticsearch_dsl',
    'storages', # amazons s3

    # Local apps
        # Users
        'apps.users.accounts',
        'apps.users.followers',

        # Posts
        'apps.posts.recipes',
        'apps.posts.saves',
        'apps.posts.reviews',

        # Chats
        'apps.chats.chat_groups',
        'apps.chats.chat_duos',
        'apps.chats.chat_massages',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'build')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

# ---------- heroku Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': env('DB_NAME',default='postgres'),
        'USER': env('DB_USER',default='postgres'),
        'PASSWORD': env('DB_PASSWORD',default='postgres'),
        'HOST': env('DB_HOST',default='localhost'),
        'PORT': '5432',
    },
}

# Send emails
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.sendgrid.net'
EMAIL_USE_TLS = True 
EMAIL_PORT = 587
EMAIL_HOST_USER=env('SENDGRID_USER',default='SENDGRID_USER')
EMAIL_HOST_PASSWORD=env('SENDGRID_PASSWORD',default='SENDGRID_PASSWORD')
DEFAULT_FROM_EMAIL = env('SENDGRID_FROM_EMAIL',default='email@gmail.com')

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
STATIC_URL = '/static/'
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'build/static')
]
STATIC_ROOT = os.path.join(BASE_DIR, 'static')

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'


# Rest Framework Settings
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ],

    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.TokenAuthentication',
   
        # browser api
        # 'rest_framework.authentication.SessionAuthentication',
    ),
}


# Djoser settings
DOMAIN = 'zbite.vercel.app'
SITE_NAME = 'Zbite'
DJOSER = {
    'LOGIN_FIELD': 'email',
    'USER_CREATE_PASSWORD_RETYPE': True,
    'USERNAME_CHANGED_EMAIL_CONFIRMATION': True, 
    'PASSWORD_CHANGED_EMAIL_CONFIRMATION': True,
    'SEND_CONFIRAMTION_EMAIL': True,
    'SET_USERNAME_RETYPE': True,
    'SET_PASSWORD_RETYPE': True,
    # 'SEND_ACTIVATION_EMAIL': True,

    'PASSWORD_RESET_CONFIRM_URL': 'users/reset_password/UserResetPassword/{uid}/{token}/',
    # 'USERNAME_RESET_CONFIRM_URL': 'email/reset/confirm/{uid}/{token}/',
    # 'ACTIVATION_URL': 'activate/{uid}/{token}',

    'SERIALIZERS': {
        'user_create': 'apps.users.accounts.serializers.UserCreateSerializer',
        'user': 'apps.users.accounts.serializers.UserCreateSerializer',
        'user_delete': 'apps.users.accounts.serializers.UserDeleteSerializer',
    },
}

AUTH_USER_MODEL = 'accounts.UserAccount'

SITE_ID = 1

ELASTICSEARCH_DSL={
    'default':{
        'hosts':'https://3ng0nd8r83:9b711z6cyt@dogwood-516101910.eu-west-1.bonsaisearch.net:443',
    },
}


# amazon s3 storage
AWS_ACCESS_KEY_ID = env('AWS_ACCESS_KEY_ID',default='aws_access_key')
AWS_SECRET_ACCESS_KEY = env('AWS_SECRET_ACCESS_KEY',default='aws_secret_access_key')
AWS_STORAGE_BUCKET_NAME = 'zbite'
AWS_S3_CUSTOM_DOMAIN = '%s.s3.amazonaws.com' % AWS_STORAGE_BUCKET_NAME
AWS_S3_OBJECT_PARAMETERS = {
    'CacheControl': 'max-age=86400',
}
AWS_LOCATION = 'static'

STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'build/static'),
]
STATIC_URL = 'https://%s/%s/' % (AWS_S3_CUSTOM_DOMAIN, AWS_LOCATION)
STATICFILES_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'

DEFAULT_FILE_STORAGE = 'config.storage_backends.MediaStorage'

# Security
SECRET_KEY = env("DJANGO_SECRET_KEY", default='secret_key')
DEBUG = env('DJANGO_DEBUG',default=True)
SECURE_HSTS_SECONDS = env("DJANGO_SECURE_HSTS_SECONDS", default=0)
SECURE_HSTS_INCLUDE_SUBDOMAINS = env("DJANGO_SECURE_HSTS_INCLUDE_SUBDOMAINS", default=False)
SECURE_HSTS_PRELOAD = env("DJANGO_SECURE_HSTS_PRELOAD", default=False)
SESSION_COOKIE_SECURE = env("DJANGO_SESSION_COOKIE_SECURE", default=False)
CSRF_COOKIE_SECURE = env("DJANGO_CSRF_COOKIE_SECURE", default=False)
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
CORS_ORIGIN_ALLOW_ALL = False
CORS_ORIGIN_WHITELIST = (
    'http://localhost:3000',
    'https://zbite.vercel.app',
)
SECURE_SSL_REDIRECT = env("DJANGO_SECURE_SSL_REDIRECT", default=False)
