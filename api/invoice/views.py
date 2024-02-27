from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Invoice
from .serializers import InvoiceSerializer, InvoiceListSerializer
import json
from datetime import datetime
from rest_framework.generics import RetrieveAPIView
from django.db.models import Q

class InvoiceUploadView(APIView):
    def post(self, request, format=None):
        items_data = request.data.get('items', [])
        total_amount = request.data.get('total_amount')
        user_id = request.data.get('invoice_user')
        image_file = request.data.get('image')
        description = request.data.get('description')
        invoice_date = request.data.get('invoice_date')
        category = request.data.get('category')

        # Parse the items data from JSON strings to Python list of dictionaries
        try:
            items = json.loads(items_data)
        except json.JSONDecodeError:
            return Response({'error': 'Invalid JSON format in items'}, status=status.HTTP_400_BAD_REQUEST)

        if not isinstance(items, list):
            return Response({'error': 'Items field should be a list'}, status=status.HTTP_400_BAD_REQUEST)

        # Validate and parse invoice date
        try:
            invoice_date = datetime.strptime(invoice_date, '%a %b %d %Y %H:%M:%S GMT%z')
        except ValueError:
            return Response({'error': 'Invalid invoice date format'}, status=status.HTTP_400_BAD_REQUEST)

        # Create a dictionary containing all the data for the invoice
        invoice_data = {
            'total_amount': total_amount,
            'invoice_user': user_id,
            'image': image_file,
            'description': description,
            'items': items,
            'user': request.user.id,
            'invoice_date': invoice_date,
            'category': category
        }

        # Serialize the data and save it to the database
        serializer = InvoiceSerializer(data=invoice_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, invoice_id=None, format=None):
        if invoice_id is not None:
            return self.get_single_invoice(invoice_id, request)
        else:
            invoices = Invoice.objects.filter(user=request.user)
            serializer = InvoiceListSerializer(invoices, many=True)
            return Response(serializer.data)
    
    def get_single_invoice(self, invoice_id, request):
        try:
            invoice = Invoice.objects.get(id=invoice_id, user=request.user)
            serializer = InvoiceSerializer(invoice)
            return Response(serializer.data)
        except Invoice.DoesNotExist:
            return Response({'error': 'Invoice not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def put(self, request, invoice_id, format=None):
        total_amount = request.data.get('total_amount')
        user_id = request.data.get('invoice_user')
        image_file = request.data.get('image')
        description = request.data.get('description')
        invoice_date = request.data.get('invoice_date')
        category = request.data.get('category')
        items_data = request.data.get('items', [])
        total_amount = request.data.get('total_amount')
        user_id = request.data.get('invoice_user')
        image_file = request.data.get('image')
        description = request.data.get('description')
        invoice_date = request.data.get('invoice_date')
        category = request.data.get('category')

        # Parse the items data from JSON strings to Python list of dictionaries
        try:
            items = json.loads(items_data)
        except json.JSONDecodeError:
            return Response({'error': 'Invalid JSON format in items'}, status=status.HTTP_400_BAD_REQUEST)

        if not isinstance(items, list):
            return Response({'error': 'Items field should be a list'}, status=status.HTTP_400_BAD_REQUEST)

        # Validate and parse invoice date
        try:
            invoice_date = datetime.strptime(invoice_date, '%a %b %d %Y %H:%M:%S GMT%z')
        except ValueError:
            return Response({'error': 'Invalid invoice date format'}, status=status.HTTP_400_BAD_REQUEST)

        invoice_data = {
            'items': items,
            'user': request.user.id,
        }

        if(total_amount):
            invoice_data['total_amount'] = total_amount
        if user_id:
            invoice_data['invoice_user'] = user_id
        if image_file:
            invoice_data['image'] = image_file
        if description:
            invoice_data['description'] = description
        if invoice_date:
            invoice_data['invoice_date'] = invoice_date
        if category:
            invoice_data['category'] = category
        try:
            invoice = Invoice.objects.get(id=invoice_id)
        except Invoice.DoesNotExist:
            return Response({'error': 'Invoice not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = InvoiceSerializer(invoice, data=invoice_data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class InvoiceRetrieveView(RetrieveAPIView):

    def get(self, request, invoice_id=None, format=None):
        # search_query = request.query_params.get('search', None)
        if invoice_id:
            invoices = Invoice.objects.filter(Q(id__contains=invoice_id))
        else:
            invoices = Invoice.objects.filter(user=request.user)
        serializer = InvoiceListSerializer(invoices, many=True)
        return Response(serializer.data)

