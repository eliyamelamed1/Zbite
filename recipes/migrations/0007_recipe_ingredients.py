# Generated by Django 3.1.12 on 2021-11-19 09:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('recipes', '0006_recipe_instructions'),
    ]

    operations = [
        migrations.AddField(
            model_name='recipe',
            name='ingredients',
            field=models.JSONField(blank=True, null=True),
        ),
    ]
