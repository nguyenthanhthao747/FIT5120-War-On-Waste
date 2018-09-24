
from django.contrib import admin
from django.urls import path, include
from constructionviz import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('constructionviz.urls')),
    path('accounts/', include('django.contrib.auth.urls')),
    
]
