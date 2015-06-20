# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('recommand', '0004_auto_20150619_1718'),
    ]

    operations = [
        migrations.AlterField(
            model_name='course_score',
            name='cs_score',
            field=models.IntegerField(),
        ),
        migrations.AlterField(
            model_name='user_course',
            name='uc_grade',
            field=models.DecimalField(max_digits=3, decimal_places=3),
        ),
    ]
