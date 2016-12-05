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
    url(r'^manager/', hello.views.manager, name='manager'),
    url(r'^save', hello.views.save, name='save'),
    url(r'^db', hello.views.db, name='db'),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^media/(?P<path>.*)$', 'django.views.static.serve',{'document_root': settings.MEDIA_ROOT}),
    url(r'^send_data/', hello.views.send_data, name='send_data'),
    url(r'^send_sp/', hello.views.send_sp, name='send_sp'),
    url(r'^send_orgs/', hello.views.send_orgs, name='send_orgs'),
    url(r'^delete/', hello.views.delete, name='delete'),
    url(r'^add_relation/', hello.views.add_relation, name='add_relation'),
    url(r'^remove_relation/', hello.views.remove_relation, name='remove_relation'),
    url(r'^search/', hello.views.search, name='search'),
    url(r'^add_items/', hello.views.add_items, name='add_items'),
    url(r'^find_snomed/', hello.views.find_snomed, name='find_snomed'),
    url(r'^search/', hello.views.search, name='search'),
    url(r'^guess', hello.views.guess, name='guess'),
    url(r'^teach/', hello.views.teach, name='teach'),
    url(r'^planning/', hello.views.planning, name='planning'),
    url(r'^tasks/', hello.views.tasks, name='tasks'),
    url(r'^finances/', hello.views.finances, name='finances'),
    url(r'^ekg/', hello.views.ekg, name='ekg'),
    url(r'^ekg2/', hello.views.ekg2, name='ekg2'),
    #url(r'^display_data/', hello.views.display_data, name='pl'),
    url(r'training/', hello.views.training, name='training'),
    url(r'^train/', hello.views.train, name='train'),
    url(r'^s', hello.views.s, name='s'),
    url(r'^create_organ/send_data', hello.views.send_data, name='send_data'),
    url(r'^create_organ/', hello.views.create_organ, name='create_organ')
)
