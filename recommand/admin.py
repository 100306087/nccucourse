from django.contrib import admin
from recommand.models import raw_course
from recommand.models import course
from recommand.models import user
from recommand.models import user_course
from recommand.models import course_score

class courseAdmin(admin.ModelAdmin):
    list_display = ('id','c_name', 'c_teacher')

class raw_courseAdmin(admin.ModelAdmin):
    list_display = ('rc_subjectid', 'rc_name', 'rc_teacher', 'rc_semester', 'rc_credit','c_id')

# Register your models here.
admin.site.register(raw_course,raw_courseAdmin)
admin.site.register(course,courseAdmin)
admin.site.register(user)
admin.site.register(user_course)
admin.site.register(course_score)
