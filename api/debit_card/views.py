from rest_framework import generics
from .models import DebitCard
from .serializers import DebitCardSerializer

class DebitCardListCreateView(generics.ListCreateAPIView):
    queryset = DebitCard.objects.all()
    serializer_class = DebitCardSerializer

class DebitCardRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = DebitCard.objects.all()
    serializer_class = DebitCardSerializer
