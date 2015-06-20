# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='course',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('c_name', models.CharField(default=b'', max_length=50)),
                ('c_teacher', models.CharField(default=b'', max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='course_score',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('u_id', models.CharField(max_length=10)),
                ('c_id', models.CharField(max_length=10)),
                ('cs_score', models.IntegerField()),
                ('cs_comment', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='raw_course',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('rc_name', models.CharField(default=b'', max_length=50)),
                ('rc_teacher', models.CharField(default=b'', max_length=50)),
                ('rc_semester', models.CharField(default=b'', max_length=5)),
                ('rc_subjectid', models.CharField(default=b'', max_length=9)),
                ('rc_credit', models.IntegerField(default=0)),
                ('rc_weekday', models.CharField(default=b'', max_length=2)),
                ('rc_time', models.CharField(default=b'', max_length=5)),
                ('rc_room', models.CharField(default=b'', max_length=30)),
                ('c_id', models.IntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='user',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('u_name', models.CharField(max_length=10)),
                ('u_fid', models.CharField(max_length=20)),
                ('u_studentid', models.CharField(max_length=10)),
                ('u_depart', models.CharField(max_length=20)),
            ],
        ),
        migrations.CreateModel(
            name='user_course',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('u_id', models.CharField(max_length=10)),
                ('c_id', models.CharField(max_length=10)),
                ('uc_semester', models.CharField(max_length=5)),
                ('uc_grade', models.IntegerField()),
            ],
        ),
    ]
