# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('recommand', '0006_auto_20150619_1723'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user_course',
            name='uc_grade',
            field=models.DecimalField(max_digits=3, decimal_places=3),
        ),
    ]
