from django.shortcuts import render
from recommand.models import *
from django.http import HttpResponse
import json
import re
from django.db import connection
# Create your views here.

def dosearch(keywords):

	cursor=connection.cursor()
	course_name=cursor.execute("SELECT * FROM course WHERE c_course LIKE ("%"+keywords+"%")")
	data_list=cursor.fetchall()
	print json.dumps(data_list) 
	return HttpResponse(json.dumps(data_list))
