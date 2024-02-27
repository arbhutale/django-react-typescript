from django.contrib import admin
from .models import DebitCard

@admin.register(DebitCard)
class CreditCardAdmin(admin.ModelAdmin):
    list_display = ('card_number', 'expiry_date', 'user', 'created_at', 'updated_at')
    list_filter = ('user',)
    search_fields = ('card_number', 'user__username', 'user__email')
