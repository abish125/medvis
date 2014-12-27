# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('hello', '0003_auto_20141226_0518'),
    ]

    operations = [
        migrations.AddField(
            model_name='body_point',
            name='conditions',
            field=models.ManyToManyField(to='hello.Condition', blank=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='body_point',
            name='findings',
            field=models.ManyToManyField(to='hello.Finding', blank=True),
            preserve_default=True,
        ),
    ]
