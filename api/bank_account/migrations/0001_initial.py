# Generated by Django 3.1.14 on 2024-02-27 20:39

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='BankAccount',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('account_holder_name', models.CharField(max_length=50)),
                ('bank', models.CharField(max_length=20)),
                ('branch', models.CharField(max_length=50)),
                ('ifsc_code', models.CharField(max_length=20)),
                ('account_number', models.CharField(max_length=20)),
                ('account_type', models.CharField(choices=[('savings', 'Savings'), ('current', 'Current')], max_length=10)),
                ('balance', models.DecimalField(decimal_places=2, max_digits=10)),
                ('account_created_at', models.DateTimeField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('passbook_image', models.URLField(max_length=250)),
                ('cheque_image', models.URLField(max_length=250)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
