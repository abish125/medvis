from django.db import models

class Publication(models.Model):
    title = models.CharField(max_length=30)

    def __str__(self):              # __unicode__ on Python 2
        return self.title

    class Meta:
        ordering = ('title',)

class Article(models.Model):
    headline = models.CharField(max_length=100)
    publications = models.ManyToManyField(Publication)

    def __str__(self):              # __unicode__ on Python 2
        return self.headline

    class Meta:
        ordering = ('headline',)



class Article(models.Model):
    title = models.CharField(max_length=1000)
    date = models.DateTimeField('date published')
    specialty = models.ForeignKey(Specialty)
    disease = models.ForeignKey(Disease)
    feed = models.ForeignKey(RSSFeed)

class DOI(models.Model):
    doi = models.CharField(max_length=1000)
    name = models.CharField(max_length=1000)
    role = models.CharField(max_length=50)