from django.contrib import admin
from .models import CustomUser

class OptionAdmin(admin.ModelAdmin):
    list_display = [field.name for field in CustomUser._meta.fields]


admin.site.register(CustomUser, OptionAdmin)
