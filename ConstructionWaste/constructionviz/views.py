from django.shortcuts import render
from constructionviz.models import Construction
from django.http import HttpResponse
from django.http import JsonResponse
from django.core import serializers
from django.db import connection
from django.http import Http404
from django.contrib.auth.decorators import login_required

import json
import ast # for parsinf list from string list '[13, 12]'

#view for home page
#@login_required
def suggestions(request):
    return render(request, 'suggestions.html')

#view for home page
#@login_required
def home(request):
    return render(request, 'index.html')

#view for search location
#@login_required
def search_location(request):
    return render(request, 'searchLocation.html')

#view for statistics page
#@login_required
def statistics(request):
    return render(request, 'statistics.html')

#view for about page
#@login_required
def about(request):
    return render(request, 'about.html')

#view for calculator
#@login_required
def waste_calculator(request):
    return render(request, 'WasteCalculator.html')

#view for test the website
#@login_required
def test_json(request):

    dict_obect = {}
    dict_obect["test"] = "Hello"
    dict_obect["test_object"] = "Hello World"
    return render(request, 'home.html', {'object': dict_obect})

#@login_required
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
            timber.append(round(var[1]*0.0005,2))
            plasterboard.append(round(var[1]*0.0024,2))
            concrete.append(round(var[1]*0.0001,2))
            bricks.append(round(var[1]*0.00075,2))
            tiles.append(round(var[1]*0.0024,2))


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

#function to get the data for map chart
#@login_required
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
            construction_size.append(round(var[3]/1000,2))



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


#function to get all the location for search page
#@login_required
def get_all_locations(request):

    dict_data = {}
    dict_data["reuse"] = []
    dict_data["recycle"] = []
    dict_data["drop-off"] = []

    try:
        sql_str = f"""
        select * from locations
        """

        cursor = connection.cursor();
        cursor.execute(sql_str)
        the_rs = cursor.fetchall()

        for var in the_rs:
            record = {
            "name": var[0],
            "address": var[1],
            "postcode":var[2],
            "lat":var[4],
            "long":var[5]
            }

            if var[3] == "recycle":
                print("record")
                dict_data["recycle"].append(record)
            if var[3] == "reuse":
                dict_data["reuse"].append(record)
            if var[3] == "drop-off":
                dict_data["drop-off"].append(record)

        return JsonResponse(dict_data, safe=False)

    except Construction.DoesNotExist:
        raise Http404('Construction not found')

#function to search locations
#@login_required
def search_locations(request, type, longi, latti):
    dict_data = {}
    dict_data["result"] = []
    try:
        sql_str = f"""
        select *
        from locations
        where type = '{type}'
        order by sqrt(({latti} - lat)*({latti} - lat)+({longi} - long)*({longi}  - long) )
        fetch first 4 rows only;
        """
        cursor = connection.cursor();
        cursor.execute(sql_str)
        the_rs = cursor.fetchall()

        for var in the_rs:
            record = {
            "name": var[0],
            "address": var[1],
            "postcode":var[2],
            "type":var[3],
            "lat":var[4],
            "long":var[5]
            }
            dict_data["result"].append(record)
        return JsonResponse(dict_data, safe=False)

    except Construction.DoesNotExist:
        raise Http404('Construction not found')
