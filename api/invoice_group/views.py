# views.py
from rest_framework import generics, status
from rest_framework.response import Response
from .models import InvoiceCategory, InvoiceOption
from .serializers import InvoiceCategorySerializer, InvoiceSelectionSerializer

class CategoryListCreateView(generics.ListCreateAPIView):
    # queryset = Category.objects.all()
    serializer_class = InvoiceCategorySerializer

    def get_queryset(self):
        return  InvoiceCategory.objects.filter(user=self.request.user)
class SelectionListCreateView(generics.ListCreateAPIView):
    queryset = InvoiceOption.objects.all()
    serializer_class = InvoiceSelectionSerializer

    def post(self, request, *args, **kwargs):
        # Extract the required data from the request
        name = request.data.get('name')
        category_id = request.data.get('category')
        
        # Get the category object
        try:
            category = InvoiceCategory.objects.get(id=category_id)
        except InvoiceCategory.DoesNotExist:
            return Response({'error': 'Category not found'}, status=status.HTTP_400_BAD_REQUEST)

        # Get the last option in the category and calculate the next order value
        last_option = InvoiceOption.objects.filter(category=category).order_by('-order').first()
        next_order = last_option.order + 1 if last_option else 1

        # Prepare the data to pass to the serializer
        serializer_data = {
            'name': name,
            'option_name': name,  # Set option_name to the provided name
            'order': next_order,
            'category': category_id
        }

        # Create the serializer instance with the prepared data
        serializer = self.serializer_class(data=serializer_data)

        # Validate and save the serializer
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class OrderByCategoryAPIView(generics.ListAPIView):
    serializer_class = InvoiceSelectionSerializer

    def get_queryset(self):
        category_id = self.kwargs['category_id']
        return InvoiceOption.objects.filter(category__id=category_id, user=self.request.user)
