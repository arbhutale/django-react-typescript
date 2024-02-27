# wallet/admin.py
from django.contrib import admin
from .models import Wallet

@admin.register(Wallet)
class WalletAdmin(admin.ModelAdmin):
    list_display = ('name', 'limit', 'current_balance', 'user', 'type')
    search_fields = ('name', 'user__username')  # Add more fields as needed
