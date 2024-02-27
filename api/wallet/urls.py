# wallet/urls.py
from django.urls import path
from .views import WalletListCreateView, WalletRetrieveUpdateDestroyView

urlpatterns = [
    path('api/wallets/', WalletListCreateView.as_view(), name='wallet-list-create'),
    path('api/wallets/<int:pk>/', WalletRetrieveUpdateDestroyView.as_view(), name='wallet-retrieve-update-destroy'),
]
