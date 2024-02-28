import os
from django.db import migrations

class Migration(migrations.Migration):
    dependencies = [
        ('backend', '0001_initial'),
    ]

    def generate_superuser(apps, schema_editor):
        # from django.contrib.auth.models import User
        from api.users.models import  CustomUser

        SU_NAME = 'admin'
        
        try: 
            CustomUser.objects.get(username=SU_NAME)
        except CustomUser.DoesNotExist:
            SU_EMAIL = 'admin@example.com'
            SU_PASSWORD = 'admin'
            superuser = CustomUser.objects.create_superuser(
                username=SU_NAME,
                email=SU_EMAIL,
                password=SU_PASSWORD)
            superuser.is_superuser = True
            superuser.is_staff = True
            superuser.save()

    operations = [
        migrations.RunPython(generate_superuser),
    ]