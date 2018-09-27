from django.urls import path


from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('map_viz', views.test_json, name='test_json'),
    path('get_json_data/<int:year>/', views.get_json_data, name='get_json_data'),
    path('detail/<str:area>/', views.detail, name='detail'),
    path('about', views.about, name='about'),
    path('statistics', views.statistics, name='statistics'),
    path('searchLocation', views.search_location, name='SearchLocation'),
    path('get_all_locations', views.get_all_locations, name='get_all_locations'),
    path('search_locations/<str:type>/<str:longi>/<str:latti>/', views.search_locations, name='search_locations'),
    path('WasteCalculator', views.waste_calculator, name='WasteCalculator'),
    path('suggestions', views.suggestions, name='suggestions'),
]
