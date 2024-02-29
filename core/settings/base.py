"""
Django settings for es project.

Generated by 'django-admin startproject' using Django 3.0.7.

For more information on this file, see
https://docs.djangoproject.com/en/3.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.0/ref/settings/
"""

import os

PRODUCTION_MODE = (os.getenv('MODE') == 'production')

ALLOWED_HOSTS = ['localhost', '127.0.0.1', '146.190.13.3', 'http://146.190.13.3/', 'http://24.144.92.69/', 'http://24.144.92.69:80', '24.144.92.69', '24.144.92.69:80']
CSRF_COOKIE_SECURE = False
AUTH_USER_MODEL = "users.CustomUser"
CSRF_TRUSTED_ORIGINS = ['http://146.190.13.3/', 'http://24.144.92.69/', 'http://24.144.92.69:80', '24.144.92.69', '24.144.92.69:80', '146.190.13.3', 'http://146.190.113.62', 'http://localhost', 'http://localhost:3001/']

# Django Rest Framework
# https://www.django-rest-framework.org/

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_SCHEMA_CLASS': 'rest_framework.schemas.coreapi.AutoSchema'
}

if (PRODUCTION_MODE):
    from .prod import *
else:
    from dotenv import load_dotenv
    load_dotenv()
    from .dev import *

CDN_NAME = os.environ.get('CDN_NAME')
CDN_API_KEY = os.environ.get('CDN_API_KEY')
CDN_API_SECRET = os.environ.get('CDN_API_SECRET')

TWILIO_ACCOUNT_SID = os.environ.get('TWILIO_ACCOUNT_SID')
TWILIO_AUTH_TOKEN = os.environ.get('TWILIO_AUTH_TOKEN')
TWILIO_WPP_NUMBER = os.environ.get('TWILIO_WPP_NUMBER')

DB_HOST = os.environ.get('DB_HOST')
DB_NAME = os.environ.get('DB_NAME')
DB_USER = os.environ.get('DB_USER')
DB_PASSWORD = os.environ.get('DB_PASSWORD')
DB_PORT = os.environ.get('DB_PORT')

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get('SECRET_KEY', default='w%h-ok)&7l2e@1&ht!#ol3!!qg9zwz9hs$wf@fk4e0-7x1r*#d')

# Application definition

INSTALLED_APPS = [
    'admin_menu',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'drf_yasg',
    'django.contrib.sites',
    'corsheaders',
    'rest_framework',
    'rest_framework.authtoken',
    'django_better_admin_arrayfield',
    'django_filters',
    'frontend',
    'backend',
    'api',
    'api.users',
    'api.bank_account',
    'api.credit_card',
    'api.debit_card',
    'api.loan',
    'api.select_option',
    'api.invoice_group',
    'api.invoice_user',
    'api.invoice',
    'api.transaction',
    'api.common',
    'api.wallet',
    'cloudinary'
]

# https://github.com/cdrx/django-admin-menu

ADMIN_STYLE = {
    'primary-color': '#0C4B33',
    'secondary-color': '#44B78B',
    'tertiary-color': '#F2F9FC'
}

ADMIN_LOGO = 'backend/logo.png'

SITE_ID = 1

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

CORS_ORIGIN_ALLOW_ALL = True
ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            os.path.join(os.path.dirname(BASE_DIR), 'frontend/build')
        ],
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

WSGI_APPLICATION = 'core.wsgi.application'


# Database
# https://docs.djangoproject.com/en/3.0/ref/settings/#databases

if (os.getenv('TEST')):
        DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
        }
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': DB_NAME,
            'USER': DB_USER,
            'PASSWORD': DB_PASSWORD,
            'HOST': DB_HOST,
            # 'PORT': '5432',
            # 'NAME': 'aluxmadq',
            # 'USER': 'aluxmadq',
            # 'PASSWORD': 'tszRA7jrY1Oy5n1egvzkCXcCgoR7DSSl',
            # 'HOST': 'satao.db.elephantsql.com',
            # 'PORT': '5432',
            # 'NAME': 'personal',
            # 'USER': 'postgres',
            # 'PASSWORD': 'docker',
            # 'HOST': 'host.docker.internal',
            'PORT': DB_PORT,
        }
    }


# Password validation
# https://docs.djangoproject.com/en/3.0/ref/settings/#auth-password-validators

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
# https://docs.djangoproject.com/en/3.0/topics/i18n/

LANGUAGE_CODE = 'en'

TIME_ZONE = 'America/New_York'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.0/howto/static-files/

STATIC_URL = '/static/'
# STATIC_ROOT = os.path.join(BASE_DIR, 'static/')
STATIC_FILES = [
    os.path.join( os.path.join(os.path.dirname(BASE_DIR)), 'frontend/build/static')
]
BASE_DIR1 = '/usr/src/app/'
STATICFILES_DIRS = [
    os.path.join(BASE_DIR1, 'frontend', 'build', 'static'),  # Adjust as needed
]
STATIC_ROOT = os.path.join(BASE_DIR, 'static')
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media/')

# STATIC_URL = '/static/'
# STATIC_ROOT = os.path.join(BASE_DIR, 'static/')


# Cloudinary
# https://cloudinary.com/documentation/django_integration

from cloudinary import config

config( 
  cloud_name = CDN_NAME, 
  api_key = CDN_API_KEY, 
  api_secret = CDN_API_SECRET,
  secure = True
)

# Email 
# https://docs.djangoproject.com/en/3.0/topics/email/

# Gmail SMTP requirements
# https://support.google.com/a/answer/176600?hl=en

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend' if PRODUCTION_MODE else 'django.core.mail.backends.dummy.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_HOST_USER = os.environ.get('SMTP_HOST_USER')
EMAIL_HOST_PASSWORD = os.environ.get('SMTP_HOST_PASSWORD')
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_USE_SSL = False

SWAGGER_SETTINGS = {
    'USE_SESSION_AUTH': False,
    'SECURITY_DEFINITIONS': {
        'Bearer': {
            'type': 'apiKey',
            'name': 'Authorization',
            'in': 'header'
        }
    }
}