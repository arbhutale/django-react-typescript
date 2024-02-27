from django.contrib import admin
from .models import BankAccount

@admin.register(BankAccount)
class BankAccountAdmin(admin.ModelAdmin):
    list_display = ('account_number', 'account_type', 'balance', 'user')
    list_filter = ('account_type', 'user')
    search_fields = ('account_number', 'user__username', 'user__email')
