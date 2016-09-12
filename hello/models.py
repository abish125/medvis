from django.db import models

class Finding(models.Model):
    name = models.CharField(max_length=1000);
    snomed_ct_code = models.CharField(max_length=1000);

class Condition(models.Model):
    name = models.CharField(max_length=1000);
    snomed_ct_code = models.CharField(max_length=1000);

class Organ(models.Model):
    name = models.CharField(max_length=1000)
    snomed_ct_code = models.CharField(max_length=1000)
    findings = models.ManyToManyField(Finding, blank=True)
    conditions = models.ManyToManyField(Condition, blank=True)

class Specialty(models.Model):
    name = models.CharField(max_length=1000)
    organs = models.ManyToManyField(Organ, blank=True)
    findings = models.ManyToManyField(Finding, blank=True)
    conditions = models.ManyToManyField(Condition, blank=True)

class Body_Point(models.Model):
    name = models.CharField(max_length=1000)
    #snomed_ct_code = models.CharField(max_length=1000)
    cp_x = models.FloatField()
    cp_y = models.FloatField()
    cp_z = models.FloatField()
    organ_name = models.CharField(max_length=1000, blank=True)
    selected = models.BooleanField()
    #organs = models.ManyToManyField(Organ, blank=True)
    #specialties = models.ManyToManyField(Specialty, blank=True)
    #findings = models.ManyToManyField(Finding, blank=True)
    #conditions = models.ManyToManyField(Condition, blank=True)

class Secondary_Info(models.Model):
    source = models.CharField(max_length=10000)
    conditions = models.ManyToManyField(Condition, blank=True)
    findings = models.ManyToManyField(Finding, blank=True)
    organs = models.ManyToManyField(Organ, blank=True)
    specialties = models.ManyToManyField(Specialty, blank=True)
    body_points = models.ManyToManyField(Body_Point, blank=True)
