from django.db import models
from django.contrib.auth.models import User
import math
from api.bank_account.models import BankAccount
from api.credit_card.models import CreditCard
from django.conf import settings
class Loan(models.Model):
    LOAN_TYPES = [
        ('personal', 'Personal Loan'),
        ('home', 'Home Loan'),
        ('car', 'Car Loan'),
        ('education', 'Education Loan'),
         ('other', 'Other'),
    ]

    FREQUENCY_CHOICES = [
        ('monthly', 'Monthly'),
        ('quarterly', 'Quarterly'),
        ('half-yearly', 'Half-Yearly'),
        ('yearly', 'Yearly'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    loan_type = models.CharField(max_length=20, choices=LOAN_TYPES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    interest_rate = models.DecimalField(max_digits=5, decimal_places=2)
    tenure_months = models.IntegerField()
    emi_start_date = models.DateField()
    emi_end_date = models.DateField()
    emi_frequency = models.CharField(max_length=20, choices=FREQUENCY_CHOICES)
    bank = models.ForeignKey(BankAccount, on_delete=models.CASCADE, null=True, blank=True)
    credit_card = models.ForeignKey(CreditCard, on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.get_loan_type_display()} Loan: {self.amount}"

    def calculate_emi(self):
        r = (self.interest_rate / 100) / 12
        n = self.tenure_months
        emi = self.amount * r * (math.pow(1 + r, n)) / (math.pow(1 + r, n) - 1)
        return round(emi, 2)

    def calculate_remaining_principal(self):
        total_principal_paid = self.transaction_set.filter(transaction_type='credit').aggregate(models.Sum('principal_amount'))['principal_amount__sum'] or 0
        remaining_principal = self.amount - total_principal_paid
        return round(remaining_principal, 2)

    def calculate_interest_payment(self, remaining_principal):
        interest_rate = self.interest_rate / 100
        interest_payment = (remaining_principal * interest_rate) / 12
        return round(interest_payment, 2)
