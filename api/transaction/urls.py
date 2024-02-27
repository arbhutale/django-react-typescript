from django.urls import path
from . import views

urlpatterns = [
    path('transactions/', views.TransactionListCreateView.as_view(), name='transaction-list-create'),
    path('transactions/<int:pk>/', views.TransactionRetrieveUpdateDestroyView.as_view(), name='transaction-detail'),
    # Add other URLs as needed for CRUD operations
]
