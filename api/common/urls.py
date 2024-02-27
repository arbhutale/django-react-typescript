# urls.py
from django.urls import path
from .views import ModelDataAPIView

urlpatterns = [
    path('common/<str:model_name>', ModelDataAPIView.as_view(), name='user-related-models'),
]
