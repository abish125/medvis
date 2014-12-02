from django.db import models

class Organ(models.Model):
    name = models.CharField(max_length=1000)
    snomed_ct_code = models.IntegerField()

class Specialty(models.Model):
    name = models.CharField(max_length=1000)
    organs = models.ManyToManyField(Organ)

class Body_Point(models.Model):
    name = models.CharField(max_length=1000)
    snomed_ct_code = models.IntegerField()
    cp_x = models.FloatField()
    cp_y = models.FloatField()
    cp_z = models.FloatField()
    organs = models.ManyToManyField(Organ)
    specialties = models.ManyToManyField(Specialty)


