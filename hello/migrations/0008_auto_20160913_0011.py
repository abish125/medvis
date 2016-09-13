# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('hello', '0007_auto_20160911_2339'),
    ]

    operations = [
        migrations.AlterField(
            model_name='body_point',
            name='name',
            field=models.CharField(max_length=1000, blank=True),
        ),
    ]
