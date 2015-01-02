# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('hello', '0004_auto_20141226_0522'),
    ]

    operations = [
        migrations.CreateModel(
            name='Secondary_Info',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('source', models.CharField(max_length=10000)),
                ('body_points', models.ManyToManyField(to='hello.Body_Point', blank=True)),
                ('conditions', models.ManyToManyField(to='hello.Condition', blank=True)),
                ('findings', models.ManyToManyField(to='hello.Finding', blank=True)),
                ('organs', models.ManyToManyField(to='hello.Organ', blank=True)),
                ('specialties', models.ManyToManyField(to='hello.Specialty', blank=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
