from django.db import models
from django.conf import settings

class CreditCard(models.Model):
    CARD_TYPES = [
        ('master', 'Master'),
        ('visa', 'Visa'),
        ('rupay', 'Rupay'),
    ]
    bank = models.CharField(max_length=16)
    name_on_card = models.CharField(max_length=16)
    card_number = models.CharField(max_length=16)
    card_type = models.CharField(max_length=10, choices=CARD_TYPES)
    expiry_date = models.DateField()
    cvv = models.CharField(max_length=3)
    credit_limit = models.DecimalField(max_digits=10, decimal_places=2)
    current_balance = models.DecimalField(max_digits=10, decimal_places=2)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.card_number
