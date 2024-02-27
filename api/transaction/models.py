from django.db import models
from api.bank_account.models import BankAccount
from api.credit_card.models import CreditCard
from api.wallet.models import Wallet
from api.invoice.models import Invoice
from django.conf import settings

class Transaction(models.Model):
    TRANSACTION_METHODS = [
        ('bank', 'Bank'),
        ('credit_card', 'Credit Card'),
        ('debit_card', 'Debit Card'),
        ('wallet', 'Walllet'),
        ('bank_upi', 'Bank UPI'),
        ('credit_upi', 'Credit Card UPI'),
    ]

    TRANSACTION_TYPES = [
        ('debit', 'Debit'),
        ('credit', 'Credit'),
    ]
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE)
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPES)
    transaction_method = models.CharField(max_length=20, choices=TRANSACTION_METHODS)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    transaction_date = models.DateField()
    description = models.TextField()
    transaction_sub_method = models.CharField(max_length=100, blank=True)
    transaction_source = models.CharField(max_length=100, blank=True)  # Add field for bank/credit card details
    transaction_source_name = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.transaction_type} - {self.amount}"

    def save(self, *args, **kwargs):
        if self.pk:  # If it's an existing transaction being updated
            original_transaction = Transaction.objects.get(pk=self.pk)
            
            # Revert the original balance based on the original transaction
            if original_transaction.transaction_method == 'bank' or original_transaction.transaction_method == 'debit_card' or original_transaction.transaction_method == 'bank_upi' :
                bank = BankAccount.objects.get(id=original_transaction.transaction_source)
                if original_transaction.transaction_type == 'credit':
                    bank.balance -= original_transaction.amount
                elif original_transaction.transaction_type == 'debit':
                    bank.balance += original_transaction.amount
                bank.save()
            elif original_transaction.transaction_method == 'credit_card' or original_transaction.transaction_method == 'credit_upi':
                credit_card = CreditCard.objects.get(id=original_transaction.transaction_source)
                if original_transaction.transaction_type == 'credit':
                    credit_card.current_balance -= original_transaction.amount
                elif original_transaction.transaction_type == 'debit':
                    credit_card.current_balance += original_transaction.amount
                credit_card.save()
            elif original_transaction.transaction_method == 'wallet':
                wallet = Wallet.objects.get(id=original_transaction.transaction_source)
                if original_transaction.transaction_type == 'credit':
                    wallet.current_balance -= original_transaction.amount
                elif original_transaction.transaction_type == 'debit':
                    wallet.current_balance += original_transaction.amount
                wallet.save()

        # Save the updated transaction
        super().save(*args, **kwargs)

        # Update the balance based on the updated transaction
        if self.transaction_method == 'bank' or self.transaction_method == 'debit_card' or self.transaction_method == 'bank_upi' :
            bank = BankAccount.objects.get(id=self.transaction_source)
            if self.transaction_type == 'credit':
                bank.balance += self.amount
            elif self.transaction_type == 'debit':
                bank.balance -= self.amount
            bank.save()
        elif self.transaction_method == 'credit_card' or self.transaction_method == 'credit_upi':
            credit_card = CreditCard.objects.get(id=self.transaction_source)
            if self.transaction_type == 'credit':
                credit_card.current_balance += self.amount
            elif self.transaction_type == 'debit':
                credit_card.current_balance -= self.amount
            credit_card.save()
        elif self.transaction_method == 'wallet':
            wallet = Wallet.objects.get(id=self.transaction_source)
            if self.transaction_type == 'credit':
                wallet.current_balance += self.amount
            elif self.transaction_type == 'debit':
                wallet.current_balance -= self.amount
            wallet.save()

            
