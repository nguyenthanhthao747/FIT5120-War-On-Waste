from csv import DictReader
from datetime import datetime

from django.core.management import BaseCommand

from constructionviz.models import Construction
from pytz import UTC


DATETIME_FORMAT = '%m/%d/%Y %H:%M'

VACCINES_NAMES = [
    'Canine Parvo',
    'Canine Distemper',
    'Canine Rabies',
    'Canine Leptospira',
    'Feline Herpes Virus 1',
    'Feline Rabies',
    'Feline Leukemia'
]

ALREADY_LOADED_ERROR_MESSAGE = """
If you need to reload the pet data from the CSV file,
first delete the db.sqlite3 file to destroy the database.
Then, run `python manage.py migrate` for a new empty
database with tables"""


class Command(BaseCommand):
    # Show this when the user types help
    help = "Loads data from pet_data.csv into our Pet model"

    def handle(self, *args, **options):
        if Construction.objects.exists():
            print('Construction data already loaded...exiting.')
            print(ALREADY_LOADED_ERROR_MESSAGE)
            return
        print("Creating Construction data")
        for row in DictReader(open('./ConstructionWaste.csv'),delimiter=','):
            construction = Construction()
            construction.property_id = row['property_id']
            construction.data_format = row['data_format']
            construction.postcode = row['postcode']
            construction.year_completed = int(float(row['year_completed']))
            construction.clue_small_area = row['clue_small_area']
            construction.clue_block = row['clue_block']
            construction.street_address = row['street_address']
            construction.floors_above = row['floors_above']
            construction.resi_dwellings = row['resi_dwellings']
            construction.studio_dwe = row['studio_dwe']
            construction.one_bdrm_dwe = row['one_bdrm_dwe']
            construction.two_bdrm_dwe = row['two_bdrm_dwe']
            construction.three_bdrm_dwe = row['three_bdrm_dwe']
            construction.student_apartments = row['student_apartments']
            construction.student_beds = row['student_beds']
            construction.student_accommodation_units = row['student accommodation units']
            construction.intitutional_accom_beds = row['intitutional_accom_beds']
            construction.hotel_rooms = row['hotel_rooms']
            construction.serviced_apartments = row['serviced_apartments']
            construction.hotels_serviced_apartments = row['hotels_serviced_apartments']
            construction.hostel_beds = row['hostel_beds']
            construction.childcare_places = row['childcare_places']
            construction.office_flr = row['office_flr']
            construction.retail_flr = row['retail_flr']
            construction.industrial_flr = row['industrial_flr']
            construction.storage_flr = row['storage_flr']
            construction.education_flr = row['education_flr']
            construction.hospital_flr = row['hospital_flr']
            construction.recreation_flr = row['recreation_flr']
            construction.publicdispaly_flr = row['publicdispaly_flr']
            construction.community_flr = row['community_flr']
            construction.car_spaces = row['car_spaces']
            construction.bike_spaces = row['bike_spaces']
            construction.town_planning_application_no  = row['town_planning_application_no']
            construction.Location = row['Location 1']
            construction.save()
