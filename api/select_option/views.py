# views.py
from rest_framework import generics
from .models import Category, Option
from .serializers import CategorySerializer, SelectionSerializer

class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class SelectionListCreateView(generics.ListCreateAPIView):
    queryset = Option.objects.all()
    serializer_class = SelectionSerializer

class OrderByCategoryAPIView(generics.ListAPIView):
    serializer_class = SelectionSerializer

    def get_queryset(self):
        category_name = self.kwargs['category_name']
        return Option.objects.filter(category__name=category_name)
