# admin.py
from django.contrib import admin
from .models import Category, Option

class OptionAdmin(admin.ModelAdmin):
    list_display = ('name', 'option_name', 'order', 'category')
    search_fields = ('name', 'option_name', 'category__name')

    def save_model(self, request, obj, form, change):
        # Check if the combination of order and category is unique
        if Option.objects.filter(order=obj.order, category=obj.category).exclude(pk=obj.pk).exists():
            # Display an error message in the admin interface
            self.message_user(request, "This combination of order and category already exists.", level='ERROR')
        else:
            # Save the object if the combination is unique
            obj.save()

class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)

admin.site.register(Category, CategoryAdmin)
admin.site.register(Option, OptionAdmin)
