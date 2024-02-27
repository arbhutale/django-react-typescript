from django.db import models
from django.conf import settings

class BankAccount(models.Model):
    ACCOUNT_TYPES = [
        ('savings', 'Savings'),
        ('current', 'Current'),
    ]
    account_holder_name = models.CharField(max_length=50)
    bank = models.CharField(max_length=20)
    branch = models.CharField(max_length=50)
    ifsc_code = models.CharField(max_length=20)
    account_number = models.CharField(max_length=20)
    account_type = models.CharField(max_length=10, choices=ACCOUNT_TYPES)
    balance = models.DecimalField(max_digits=10, decimal_places=2)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    account_created_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    passbook_image = models.URLField(max_length=250)
    cheque_image = models.URLField(max_length=250)

    def __str__(self):
        return self.account_number
