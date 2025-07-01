from django.shortcuts import render
from textblob import TextBlob
from rest_framework import viewsets
from .models import JournalEntry
from .serializers import JournalEntrySerializer
from .sentiment import analyze_sentiment

class JournalEntryViewSet(viewsets.ModelViewSet):
    queryset = JournalEntry.objects.all().order_by('-created_at')
    serializer_class = JournalEntrySerializer

    def perform_create(self, serializer):
        content = serializer.validated_data.get('content', '')
        sentiment,polarity = analyze_sentiment(content)   
        serializer.save(sentiment=sentiment, mood_score=polarity)