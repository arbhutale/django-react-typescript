# Generated by Django 3.1.14 on 2024-02-12 22:42

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('invoice', '0004_invoice_description'),
    ]

    operations = [
        migrations.RenameField(
            model_name='invoice',
            old_name='invoice_suer',
            new_name='invoice_user',
        ),
    ]
