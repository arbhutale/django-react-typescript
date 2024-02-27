# wallet/models.py
from django.db import models
from django.conf import settings

class Wallet(models.Model):
    WALLET_TYPE_CHOICES = [
        ('digital', 'Digital'),
        ('cash', 'Cash'),
    ]

    name = models.CharField(max_length=255)
    limit = models.DecimalField(max_digits=10, decimal_places=2)
    current_balance = models.DecimalField(max_digits=10, decimal_places=2)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    type = models.CharField(max_length=10, choices=WALLET_TYPE_CHOICES)

    def __str__(self):
        return self.name
