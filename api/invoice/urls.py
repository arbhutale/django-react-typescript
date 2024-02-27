# urls.py
from django.urls import path
from .views import InvoiceUploadView, InvoiceRetrieveView

urlpatterns = [
    path('invoice/', InvoiceUploadView.as_view(), name='upload-invoice'),
    path('invoice/<int:invoice_id>/', InvoiceUploadView.as_view(), name='single-invoice'),
    path('invoices/<int:invoice_id>/', InvoiceRetrieveView.as_view(), name='invoice-detail'),
]
