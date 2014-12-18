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
    url(r'^send_data/', hello.views.send_data, name='send_data'),
    url(r'^send_sp/', hello.views.send_sp, name='send_sp'),
    url(r'^send_orgs/', hello.views.send_orgs, name='send_orgs'),
    url(r'^delete/', hello.views.delete, name='delete'),
    url(r'^add_relation/', hello.views.add_relation, name='add_relation'),
)
