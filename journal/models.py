from django.db import models


class JournalEntry(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    sentiment = models.CharField(max_length=20, blank=True)  # Will fill later
    mood_score = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

