import pandas as pd
from lib import utils
from lib import geo_data
from lib import cleaning
from lib import co2_emission_data
DATA_FOLDER = 'json_data'  # DO NOT CHANGE!

SPEND_DATA_DF = pd.read_excel('SIEVO JUNCTION Spend data.xlsx').fillna('NULL')
EMISSION_PER_EURO = pd.read_excel(
    'SIEVO JUNCTION Emissions per EUR.xlsx').fillna('None')

GEO_DATA = cleaning.clean_geo_data(geo_data.all_geo_data)

COMBINED_DATA_GEO_DF = cleaning.combine(GEO_DATA, SPEND_DATA_DF)
COMBINED_DATA_GEO_DF = cleaning.remove_identifier(
    COMBINED_DATA_GEO_DF, 'ProductName')
COMBINED_DATA_GEO_DF = cleaning.add_co2_emission(co2_emission_data.co2_emission,COMBINED_DATA_GEO_DF,EMISSION_PER_EURO)


def _get_nan_df(df):
    return df[df['ProductId'].isna()]


def analyze_spend_original_currency(input_df, field):
    countries_list = input_df[field].unique()
    countries_dictionary_list = []
    for country in countries_list:
        country_df = utils.filter_df(input_df, field, country)
        country_stats = utils.calc_statistics(
            country_df, 'SpendOriginalCurrency')

        country_data = {
            'code_name': country,
            'stats': country_stats
        }
        countries_dictionary_list.append(country_data)
    return countries_dictionary_list


def analyze_cities(input_df):
    return analyze_spend_original_currency(input_df, 'VendorCity')


def analyze_countries(input_df):
    return analyze_spend_original_currency(input_df, 'VendorCountry')


def analyze_nan_df(input_df):
    nan_df = _get_nan_df(input_df)
    return {
        'countries': analyze_countries(nan_df)
    }


result = utils.convert_df_to_dict(COMBINED_DATA_GEO_DF)


utils.clean_directory(DATA_FOLDER)
utils.output_to_file(f'{DATA_FOLDER}/spend_data', 'spend_data', result)
utils.output_to_file(f'{DATA_FOLDER}/geo_data', 'geo_data', GEO_DATA)


def search(df, filter_criteria):
    product = filter_criteria['product']
    city = filter_criteria['location']['city']
    price_range = filter_criteria['price_range']
    sort = filter_criteria['sort']

    df_product = utils.filter_df(df, 'ProductName', product)
    df_city = utils.filter_df(df_product, 'VendorCity', city)
    df_price = utils.filter_by_range(
        df_city,
        'unit_price',
        price_range.get('upper'),
        price_range.get('lower'))
    return df_price.sort_valus(by=sort)
