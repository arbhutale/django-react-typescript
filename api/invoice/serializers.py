# serializers.py
from rest_framework import serializers
from .models import Invoice, InvoiceItem
from api.users.views import UserSerializer as CurrentUser
from api.invoice_user.serializers import InvoiceUserSerializer as InvoiceUser
from api.select_option.serializers import CategorySerializer

class InvoiceItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceItem
        exclude = ['invoice']

class InvoiceSerializer(serializers.ModelSerializer):
    items = InvoiceItemSerializer(many=True)

    class Meta:
        model = Invoice
        fields = '__all__'

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        invoice = Invoice.objects.create(**validated_data)
        for item_data in items_data:
            InvoiceItem.objects.create(invoice=invoice, **item_data)
        return invoice
    
    def update(self, instance, validated_data):
        items_data = validated_data.pop('items', None)

        # Update the instance fields
        instance.total_amount = validated_data.get('total_amount', instance.total_amount)
        instance.invoice_user = validated_data.get('invoice_user', instance.invoice_user)
        instance.image = validated_data.get('image', instance.image)
        instance.description = validated_data.get('description', instance.description)
        instance.invoice_date = validated_data.get('invoice_date', instance.invoice_date)
        instance.category = validated_data.get('category', instance.category)
        
        # Save the instance with updated fields
        instance.save()

        # Update associated items if available
        if items_data is not None:
            # Clear existing items
            instance.items.all().delete()
            # Create new items
            for item_data in items_data:
                InvoiceItem.objects.create(invoice=instance, **item_data)

        return instance

class InvoiceListSerializer(serializers.ModelSerializer):
    items = serializers.SerializerMethodField()
    user = CurrentUser()
    invoice_user = InvoiceUser()
    category = CategorySerializer() 

    class Meta:
        model = Invoice
        fields = ['id', 'items', 'total_amount', 'image', 'description', 'created_at', 'user', 'invoice_user', 'invoice_date', 'category']

    def get_items(self, obj):
        # Retrieve the related item names for the given invoice
        items = obj.items.all()
        return [{'name': item.item.name, 'quantity': item.quantity, 'price': item.price, 'final_price': item.final_price, 'tax': item.tax} for item in items]