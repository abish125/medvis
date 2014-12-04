# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('hello', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='body_point',
            name='organs',
            field=models.ManyToManyField(to='hello.Organ', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='body_point',
            name='snomed_ct_code',
            field=models.CharField(max_length=1000),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='body_point',
            name='specialties',
            field=models.ManyToManyField(to='hello.Specialty', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='organ',
            name='snomed_ct_code',
            field=models.CharField(max_length=1000),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='specialty',
            name='organs',
            field=models.ManyToManyField(to='hello.Organ', blank=True),
            preserve_default=True,
        ),
    ]
