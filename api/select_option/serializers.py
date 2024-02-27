# serializers.py
from rest_framework import serializers
from .models import Category, Option

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class SelectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = '__all__'
