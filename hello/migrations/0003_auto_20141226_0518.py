# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('hello', '0002_auto_20141204_0333'),
    ]

    operations = [
        migrations.CreateModel(
            name='Condition',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=1000)),
                ('snomed_ct_code', models.CharField(max_length=1000)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Finding',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=1000)),
                ('snomed_ct_code', models.CharField(max_length=1000)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='organ',
            name='conditions',
            field=models.ManyToManyField(to='hello.Condition', blank=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='organ',
            name='findings',
            field=models.ManyToManyField(to='hello.Finding', blank=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='specialty',
            name='conditions',
            field=models.ManyToManyField(to='hello.Condition', blank=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='specialty',
            name='findings',
            field=models.ManyToManyField(to='hello.Finding', blank=True),
            preserve_default=True,
        ),
    ]
