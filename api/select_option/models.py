# models.py
from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Option(models.Model):
    name = models.CharField(max_length=100)
    option_name = models.CharField(max_length=100)
    order = models.IntegerField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE)

    def __str__(self):
        return self.option_name

    class Meta:
        unique_together = ('order', 'category')
