"""nccucourse URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.conf.urls import include, url
from django.contrib import admin
<<<<<<< HEAD
from recommand.views import hello_world, login, logout, index,my_page,js,css
=======
from login.views import *
from recommand.views import *
from crawler.views import *
from search.views import *
>>>>>>> 7a31db697faddc22c717f5009076d3ca518e42a7

urlpatterns = [
    url(r'^admin/', include(admin.site.urls)),
    #url(r'^hello/$', hello_world),
    # Url Entries for social auth
    url('', include('social.apps.django_app.urls', namespace='social')),
    # Url Entries for django administration
    url('', include('django.contrib.auth.urls', namespace='auth')),
    url(r'^accounts/login/$',login),
    url(r'^accounts/logout/$',logout),
    url(r'^index/$',index),
<<<<<<< HEAD
    url(r'^mypage/$',my_page),
    url(r'^js/(.*)',js),
    url(r'^css/(.*)',css)
=======
    url(r'^score/$',score),
    url(r'^courses_save/$',courses_save),
    url(r'^read_csv/$',read_Coursecsv),
    url(r'^dosearch/$',dosearch),
    #url(r'^search/$',search_all):
>>>>>>> 7a31db697faddc22c717f5009076d3ca518e42a7
]
