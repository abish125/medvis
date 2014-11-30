from django.conf.urls import patterns, include, url
from django.conf import settings

from django.contrib import admin
admin.autodiscover()

import hello.views

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'gettingstarted.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^$', hello.views.index, name='index'),
    url(r'^save', hello.views.save, name='save'),
    url(r'^db', hello.views.db, name='db'),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^media/(?P<path>.*)$', 'django.views.static.serve',{'document_root': settings.MEDIA_ROOT}),
)
