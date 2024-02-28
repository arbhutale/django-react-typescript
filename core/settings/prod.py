import os

# AH = os.environ.get('ALLOWED_HOSTS')

# if AH:
#     ALLOWED_HOSTS = AH.split(' ')

DEBUG = True

CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SECURE = True
USE_X_FORWARDED_PORT = True
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')


# Sentry 

import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration

SENTRY_DNS = os.environ.get('SENTRY_DNS')

sentry_sdk.init(
    dsn=SENTRY_DNS,
    integrations=[DjangoIntegration()],

    # If you wish to associate users to errors (assuming you are using
    # django.contrib.auth) you may enable sending PII data.
    send_default_pii=True
)

# Django CORS Headers

CORS_ORIGIN_ALLOW_ALL = True

# DRF

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_SCHEMA_CLASS': 'rest_framework.schemas.coreapi.AutoSchema'
}

# Memcached and pylibmc

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.memcached.MemcachedCache',
        'LOCATION': '127.0.0.1:11211',
    }
}