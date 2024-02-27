# serializers.py
from rest_framework import serializers
from api.bank_account.models import BankAccount 
from api.credit_card.models import CreditCard 
from api.wallet.models import  Wallet
from api.loan.models import Loan 

class BankSerializer(serializers.ModelSerializer):
    class Meta:
        model = BankAccount
        fields = '__all__'

class CreditCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = CreditCard
        fields = '__all__'

class LoanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Loan
        fields = '__all__'

class WalletSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wallet
        fields = '__all__'
