from django.shortcuts import render
from constructionviz.models import Construction
from django.http import HttpResponse
from django.http import JsonResponse
from django.core import serializers
from django.db import connection
from django.http import Http404


import json
import ast # for parsinf list from string list '[13, 12]'

#view for home page
def home(request):
    return render(request, 'index.html')

#view for search location
def search_location(request):
    return render(request, 'searchLocation.html')

#view for statistics page
def statistics(request):
    return render(request, 'statistics.html')

#view for about page
def about(request):
    return render(request, 'about.html')

#view for test the website
def test_json(request):

    dict_obect = {}
    dict_obect["test"] = "Hello"
    dict_obect["test_object"] = "Hello World"
    return render(request, 'home.html', {'object': dict_obect})

def detail(request, area):
    try:
        sql_str = f"""select year_completed,
        (sum(studio_dwe)* 362 + sum(one_bdrm_dwe) * 625 + sum(two_bdrm_dwe) * 937 + sum(three_bdrm_dwe) * 1114
        + (sum(resi_dwellings) - sum(studio_dwe) - sum(one_bdrm_dwe) - sum(two_bdrm_dwe) - sum(three_bdrm_dwe)) * 1012
        + sum(student_apartments) * 1012 + sum(student_beds) * 1012
        + sum(intitutional_accom_beds) * 1012
        + sum(hotel_rooms) *1012 + sum(serviced_apartments) * 1012
        + sum(hostel_beds) * 1012
        + sum(childcare_places) * 1012
        + sum(office_flr * floors_above) + sum(retail_flr * floors_above)+ sum(industrial_flr * floors_above) + sum(storage_flr * floors_above)
        + sum(education_flr * floors_above) + sum(hospital_flr * floors_above) + sum(recreation_flr * floors_above)
        + sum(publicdispaly_flr * floors_above) + sum(publicdispaly_flr * floors_above) + sum(community_flr * floors_above)
        + sum(car_spaces)*17)
        as construction_size
        FROM constructionviz_construction
        where clue_small_area = '{area}'
        group by year_completed
        order by year_completed"""

        cursor = connection.cursor();
        cursor.execute(sql_str)
        the_rs = cursor.fetchall()

        year = list()
        timber = list()
        plasterboard = list()
        concrete = list()
        bricks = list()
        tiles = list()

        for var in the_rs:
            year.append(var[0])
            timber.append(var[1]*0.5)
            plasterboard.append(var[1]*2.4)
            concrete.append(var[1]*1)
            bricks.append(var[1]*0.75)
            tiles.append(var[1]*2.4)


        data_to_send = {}

        data_to_send["data"] = {}

        the_data = {
            "area": area,
            "year": year,
            "timber": timber,
            "plasterboard": plasterboard,
            "concrete": concrete,
            "bricks": bricks,
            "tiles": tiles,
        }
        data_to_send["data"] = the_data

        return JsonResponse(data_to_send, safe=False)

    except Construction.DoesNotExist:
        raise Http404('Construction not found')
    #return render(request, 'pet_detail.html', {'construction': construction})


def get_json_data(request, year):

    dict_data = {}
    dict_data["type"] = "FeatureCollection"
    dict_data["features"] = []

    try:
        sql_str = f"""
    SELECT
	pp.post_code,
    cc.clue_small_area,
    pp.geometry,
	(
		SUM(studio_dwe)* 362 + SUM(one_bdrm_dwe)* 625 + SUM(two_bdrm_dwe)* 937 + SUM(three_bdrm_dwe)* 1114 +(
			SUM(resi_dwellings)- SUM(studio_dwe)- SUM(one_bdrm_dwe)- SUM(two_bdrm_dwe)- SUM(three_bdrm_dwe)
		)* 1012 + SUM(student_apartments)* 1012 + SUM(student_beds)* 1012 + SUM(intitutional_accom_beds)* 1012 + SUM(hotel_rooms)* 1012 + SUM(serviced_apartments)* 1012 + SUM(hostel_beds)* 1012 + SUM(childcare_places)* 1012 + SUM(office_flr * floors_above)+ SUM(retail_flr * floors_above)+ SUM(industrial_flr * floors_above)+ SUM(storage_flr * floors_above)+ SUM(education_flr * floors_above)+ SUM(hospital_flr * floors_above)+ SUM(recreation_flr * floors_above)+ SUM(publicdispaly_flr * floors_above)+ SUM(publicdispaly_flr * floors_above)+ SUM(community_flr * floors_above)+ SUM(car_spaces)* 17
	) * 7.05 AS construction_size
FROM
	processed_postcode_geo pp
right JOIN constructionviz_construction cc ON pp.post_code = cc.postcode
where year_completed = {year}
GROUP BY
pp.post_code, cc.clue_small_area, pp.geometry
        """

        cursor = connection.cursor();
        cursor.execute(sql_str)
        the_rs = cursor.fetchall()

        post_codes = list()
        post_codes_names = list()
        geometry = list()
        construction_size = list()


        for var in the_rs:
            post_codes.append(var[0])
            post_codes_names.append(var[1])
            geometry.append(var[2])
            construction_size.append(var[3])



        for xindex in range(len(post_codes)):
            # repeat this objbect for each post code boundary
            features_dict = {
                "type": "Feature",
                "id": str(xindex),
                "properties": {
                    "name": post_codes_names[xindex] + " " + post_codes[xindex],
                    "density": construction_size[xindex]
                },
                "geometry":{
                    "type": "Polygon",
                    "coordinates":[
                        ast.literal_eval(geometry[xindex])
                    ]
                }
            }

            dict_data["features"].append(features_dict)

        return JsonResponse(dict_data, safe=False)

    except Construction.DoesNotExist:
        raise Http404('Construction not found')


"""
# old way

    my_test_json_str = '''
{
"type":"FeatureCollection",
"features":[{
    "type":"Feature",
    "id":"01",
    "properties": {
        "name":"Alabama",
        "density":94.65
    },
    "geometry":{
        "type":"Polygon",
        "coordinates":[[
            [-87.359296,35.00118],[-85.606675,34.984749],[-85.431413,34.124869],[-85.184951,32.859696],[-85.069935,32.580372],
            [-84.960397,32.421541],[-85.004212,32.322956],[-84.889196,32.262709],[-85.058981,32.13674],[-85.053504,32.01077],
            [-85.141136,31.840985],[-85.042551,31.539753],[-85.113751,31.27686],[-85.004212,31.003013],[-85.497137,30.997536],
            [-87.600282,30.997536],[-87.633143,30.86609],[-87.408589,30.674397],[-87.446927,30.510088],[-87.37025,30.427934],
            [-87.518128,30.280057],[-87.655051,30.247195],[-87.90699,30.411504],[-87.934375,30.657966],[-88.011052,30.685351],
            [-88.10416,30.499135],[-88.137022,30.318396],[-88.394438,30.367688],[-88.471115,31.895754],[-88.241084,33.796253],
            [-88.098683,34.891641],[-88.202745,34.995703],[-87.359296,35.00118]
        ]]
    }
}]
}
        '''
    obj = json.loads(my_test_json_str)

"""
