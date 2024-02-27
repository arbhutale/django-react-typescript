from django import forms
from django.contrib import admin
from .models import Transaction, BankAccount, CreditCard

class TransactionAdminForm(forms.ModelForm):
    class Meta:
        model = Transaction
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        transaction_method = self.initial.get('transaction_method')

        if transaction_method == 'bank':
            self.fields['transaction_source'].queryset = BankAccount.objects.all()
        elif transaction_method == 'credit_card':
            self.fields['transaction_source'].queryset = CreditCard.objects.all()
        elif transaction_method == 'upi':
            self.fields['transaction_source'].queryset = BankAccount.objects.all() | CreditCard.objects.all()

class TransactionAdmin(admin.ModelAdmin):
    form = TransactionAdminForm
    # Other configurations for admin display

admin.site.register(Transaction, TransactionAdmin)
