# urls.py
from django.urls import path
from .views import CategoryListCreateView, SelectionListCreateView, OrderByCategoryAPIView

urlpatterns = [
    path('categories/', CategoryListCreateView.as_view(), name='category-list-create'),
    path('selections/', SelectionListCreateView.as_view(), name='selection-list-create'),
    path('category/<int:category_id>/', OrderByCategoryAPIView.as_view(), name='order-by-category'),
]
