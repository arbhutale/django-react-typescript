from django.urls import path
from . import views

urlpatterns = [
    path('debit-cards/', views.DebitCardListCreateView.as_view(), name='debit-card-list-create'),
    path('debit-cards/<int:pk>/', views.DebitCardRetrieveUpdateDestroyView.as_view(), name='debit-card-detail'),
]
