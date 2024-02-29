from django.db import models
from api.invoice_group.models import Option
from django.conf import settings
from api.invoice_user.models import User
from api.invoice_group.models import Category

class Invoice(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='invoices', on_delete=models.CASCADE)
    invoice_user = models.ForeignKey(User, related_name='invoices', on_delete=models.CASCADE)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='invoices/')
    description = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    invoice_date = models.DateTimeField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE)

class InvoiceItem(models.Model):
    invoice = models.ForeignKey(Invoice, related_name='items', on_delete=models.CASCADE)
    item = models.ForeignKey(Option, related_name='invoice_items', on_delete=models.CASCADE)
    quantity = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    final_price = models.DecimalField(max_digits=10, decimal_places=2)
    tax = models.DecimalField(max_digits=10, decimal_places=2, null=True)
