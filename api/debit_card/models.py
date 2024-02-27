from django.db import models
from api.bank_account.models import BankAccount  # Assuming you have a Bank model
from django.conf import settings

class DebitCard(models.Model):
    CARD_TYPES = [
        ('master', 'Master'),
        ('visa', 'Visa'),
        ('rupay', 'Rupay'),
    ]
    card_type = models.CharField(max_length=10, choices=CARD_TYPES)
    card_number = models.CharField(max_length=16, unique=True)
    account = models.ForeignKey(BankAccount, on_delete=models.CASCADE, related_name='account_debit')  # Assuming you have a BankAccount model
    expiry_date = models.DateField()
    cvv = models.CharField(max_length=3)
    holder_name = models.CharField(max_length=255)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)  # Add the user association
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.card_number
