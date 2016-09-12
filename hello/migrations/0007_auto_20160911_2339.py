# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('hello', '0006_auto_20160911_2319'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='body_point',
            name='conditions',
        ),
        migrations.RemoveField(
            model_name='body_point',
            name='findings',
        ),
        migrations.RemoveField(
            model_name='body_point',
            name='organs',
        ),
        migrations.RemoveField(
            model_name='body_point',
            name='snomed_ct_code',
        ),
        migrations.RemoveField(
            model_name='body_point',
            name='specialties',
        ),
    ]
