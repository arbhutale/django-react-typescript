from rest_framework import viewsets
from .models import BankAccount
from .serializers import BankAccountSerializer

class BankAccountViewSet(viewsets.ModelViewSet):
    queryset = BankAccount.objects.all()
    serializer_class = BankAccountSerializer

    def get_queryset(self):
        # Get the current user from the request
        user = self.request.user
        
        # Filter the queryset to only include the bank account of the current user
        queryset = BankAccount.objects.filter(user=user)
        return queryset
