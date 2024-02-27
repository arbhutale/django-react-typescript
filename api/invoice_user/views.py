# views.py
from rest_framework import generics
from .models import User
from .serializers import InvoiceUserSerializer

class UserListCreateView(generics.ListCreateAPIView):
    # queryset = User.objects.all()
    serializer_class = InvoiceUserSerializer

    def get_queryset(self):
        # Get the current user from the request
        current_user = self.request.user
        
        # Filter the queryset based on the current user
        queryset = User.objects.filter(id=current_user.id)
        return queryset
