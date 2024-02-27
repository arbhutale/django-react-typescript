# serializers.py
from rest_framework import serializers
from .models import Category, Option
from django.core.exceptions import ValidationError
from django.db.models import Q
name_filter = Q()


class InvoiceCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'
    
    def validate_name(self, value):
        print("test")
        # Check if an option with the same name exists, ignoring case
        normalized_value = value.lower()
        
        # Check if an option with the normalized name exists
        if Category.objects.filter(name__iexact=normalized_value).exists():
            raise ValidationError("Option with this name already exists.")
        return value

class InvoiceSelectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = '__all__'

