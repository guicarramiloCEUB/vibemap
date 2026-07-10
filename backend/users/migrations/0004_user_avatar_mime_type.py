from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_alter_user_avatar_url'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='avatar_mime_type',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]