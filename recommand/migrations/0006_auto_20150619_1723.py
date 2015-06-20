# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('recommand', '0005_auto_20150619_1722'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user_course',
            name='uc_grade',
            field=models.TextField(),
        ),
    ]
