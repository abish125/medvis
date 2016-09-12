# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('hello', '0005_secondary_info'),
    ]

    operations = [
        migrations.AddField(
            model_name='body_point',
            name='organ_name',
            field=models.CharField(max_length=1000, blank=True),
        ),
        migrations.AddField(
            model_name='body_point',
            name='selected',
            field=models.BooleanField(default=''),
            preserve_default=False,
        ),
    ]
