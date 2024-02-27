# serializers.py
from rest_framework import serializers
from .models import InvoiceCategory, InvoiceOption
from django.core.exceptions import ValidationError
from django.db.models import Q
name_filter = Q()


class InvoiceCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceCategory
        fields = '__all__'
    
    def validate_name(self, value):
        print("test")
        # Check if an option with the same name exists, ignoring case
        normalized_value = value.lower()
        
        # Check if an option with the normalized name exists
        if InvoiceCategory.objects.filter(name__iexact=normalized_value).exists():
            raise ValidationError("Option with this name already exists.")
        return value

class InvoiceSelectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceOption
        fields = '__all__'

