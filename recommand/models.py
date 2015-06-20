from django.db import models

# Create your models here.

class raw_course(models.Model):
	rc_name = models.CharField(max_length=50, default='')
        rc_teacher = models.CharField(max_length=50, default='')
        rc_semester = models.CharField(max_length=5, default='')
        rc_subjectid = models.CharField(max_length=9, default='')
        rc_credit = models.IntegerField(default=0)
        rc_weekday = models.CharField(max_length=2, default='')
        rc_time = models.CharField(max_length=20, default='')
        rc_room = models.CharField(max_length=30, default='')
	c_id = models.IntegerField(default=0)


class course(models.Model):
	c_name = models.CharField(max_length=50, default='')
        c_teacher = models.CharField(max_length=50, default='')


class user(models.Model):
        u_name = models.CharField(max_length=10)
        u_fid = models.CharField(max_length=20)
        u_studentid = models.CharField(max_length=10)
        u_depart = models.CharField(max_length=20)

class user_course(models.Model):
        u_id = models.CharField(max_length=10)
        c_id = models.CharField(max_length=10)
        uc_grade = models.DecimalField(max_digits=3,decimal_places=3)
        #uc_grade = models.TextField()

class course_score(models.Model):
        u_id = models.CharField(max_length=10)
        c_id = models.CharField(max_length=10)
        cs_score = models.IntegerField()
	cs_comment = models.TextField()