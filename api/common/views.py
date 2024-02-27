# views.py
from rest_framework import generics
from rest_framework.response import Response
from django.apps import apps
from .serializers import BankSerializer, CreditCardSerializer, LoanSerializer, WalletSerializer

class ModelDataAPIView(generics.ListAPIView):
    def get_serializer_class(self):
        model_name = self.kwargs['model_name'].lower()
        model_mapping = {
            'bank': BankSerializer,
            'creditcard': CreditCardSerializer,
            'loan': LoanSerializer,
            'wallet': WalletSerializer
            # Add more models as needed
        }
        return model_mapping.get(model_name, BankSerializer)

    def get_queryset(self):
        model_name = self.kwargs['model_name'].lower()
        app_label = None
        if model_name == "bankaccount":
            app_label = "bank_account"
        if model_name == "creditcard":
            app_label = "credit_card"
        if model_name == "loan":
            app_label = "loan"
        if model_name == "wallet":
            app_label = "wallet"
        model = apps.get_model(app_label = app_label, model_name=model_name)
        return model.objects.all()
