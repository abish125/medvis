# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Body_Point',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=1000)),
                ('snomed_ct_code', models.IntegerField()),
                ('cp_x', models.FloatField()),
                ('cp_y', models.FloatField()),
                ('cp_z', models.FloatField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Organ',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=1000)),
                ('snomed_ct_code', models.IntegerField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Specialty',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=1000)),
                ('organs', models.ManyToManyField(to='hello.Organ')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='body_point',
            name='organs',
            field=models.ManyToManyField(to='hello.Organ'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='body_point',
            name='specialties',
            field=models.ManyToManyField(to='hello.Specialty'),
            preserve_default=True,
        ),
    ]
