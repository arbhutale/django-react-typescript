# models.py
from django.db import models
from django.conf import settings

class InvoiceCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    def __str__(self):
        return self.user

class InvoiceOption(models.Model):
    name = models.CharField(max_length=100)
    option_name = models.CharField(max_length=100)
    order = models.IntegerField()
    category = models.ForeignKey(InvoiceCategory, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    def __str__(self):
        return self.option_name

    class Meta:
        unique_together = ('name', 'category')
