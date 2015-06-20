# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('recommand', '0002_remove_user_course_uc_semester'),
    ]

    operations = [
        migrations.AlterField(
            model_name='raw_course',
            name='rc_time',
            field=models.CharField(default=b'', max_length=20),
        ),
    ]
