# Generated by Django 3.1.14 on 2024-01-31 22:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('transaction', '0005_auto_20240131_2219'),
    ]

    operations = [
        migrations.AddField(
            model_name='transaction',
            name='transaction_source_name',
            field=models.CharField(blank=True, max_length=100),
        ),
    ]
