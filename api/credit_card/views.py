from rest_framework import viewsets
from .models import CreditCard
from .serializers import CreditCardSerializer

class CreditCardViewSet(viewsets.ModelViewSet):
    queryset = CreditCard.objects.all()
    serializer_class = CreditCardSerializer
