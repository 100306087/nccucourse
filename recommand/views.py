# coding=utf8
from django.shortcuts import render
from recommand.models import raw_course
from recommand.models import course
from recommand.models import user
from recommand.models import course_score
from recommand.models import user_course
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
import json
# Create your views here.

@csrf_exempt
def read_Coursecsv(request):
    #F = open('/home/jimmy/Desktop/course2.csv','r')
    #F.readline()
    #F.close()
    LineLenth = 0
    weHave = 0
    weDotHave =0
    rawHave =0
    rawDotHave =0

    for line in open('/home/jimmy/Desktop/allcourse4.csv','r'):
        if (LineLenth>0):
            b = line.replace('\n','').rsplit(',')

            #我們本身有沒有這堂課嗎，並抓出id
            Course = course.objects.filter(c_name=b[3], c_teacher=b[5])
            CourseId = 0
            if(Course):
                CourseId = Course[0].id
                weHave = weHave+1
            else:
                NewCourse = course.objects.create(c_name=b[3], c_teacher=b[5])
                CourseId = NewCourse.id
                weDotHave = weDotHave+1

            #學校這堂課有被輸入近學校課程資料課嗎，沒有舊輸進去
            RawCoures = raw_course.objects.filter(rc_subjectid=b[1])
            if(RawCoures):
                rawHave = rawHave+1
            else:
                NewRawCourse = raw_course.objects.create(rc_name=b[3], rc_teacher=b[5], rc_semester=b[0], rc_subjectid=b[1], rc_credit=b[2], rc_weekday=b[8].decode('utf8')[0], rc_time=b[8].decode('utf8')[1:],rc_room="",c_id=CourseId)
                #return HttpResponse(b[8].decode('utf8')[1:])   
                rawDotHave = rawDotHave+1
        LineLenth = LineLenth+1     


    #return HttpResponse(json.dumps(unicode(b[3])))
    return HttpResponse('csv長度:'+str(LineLenth)+' 課程已有:'+str(weHave)+' 課程未有:'+str(weDotHave)+' 學校課程已有:'+str(rawHave)+' 學校課程未有:'+str(rawDotHave))

@csrf_exempt
def courses_save(request):
    if request.method == 'POST':
        course_name = request.POST.getlist('course_name[]')
        course_code = request.POST.getlist('course_code[]')
        course_score = request.POST.getlist('course_score[]')
        final = zip(course_name,course_code,course_score)
    	for i in final:
    	    #user_course.objects.create(u_id = 123123, c_id = int(i[1]), uc_grade = int(i[2]) )
    	    #print i[1]
            result_list = [{'result':'success'}]
            return HttpResponse(json.dumps(result_list))
        else:
            return HttpResponse('error')

def get_recommand(request):
    if request.method == 'POST':
	user_id = request.POST.get('user_id')
        result_list = [{'result':'success'}]
	return HttpResponse(json.dumps(result_list))
    else:
        result_list = [{'result':'error'}]
	return HttpResponse(json.dumps(result_list))


@csrf_exempt
def score(request):
    if request.method == 'POST':
	score = int(request.POST.get('score'))
	user_id = int(request.POST.get('user_id'))
	course_id = int(request.POST.get('course_id'))
	comment = request.POST.get('comment')
    	course_score.objects.create(u_id=user_id, c_id=course_id, cs_score=score, cs_comment=comment)
        result_list = [{'result':'success'}]
        return HttpResponse(json.dumps(result_list))
    else:
	result = [{'result':'error'}]
        return HttpResponse(json.dumps(result))
