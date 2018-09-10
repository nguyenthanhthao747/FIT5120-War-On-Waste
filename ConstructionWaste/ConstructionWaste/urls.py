
from django.contrib import admin
from django.urls import path, include
from constructionviz import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('constructionviz/', include('constructionviz.urls'))
    
]
